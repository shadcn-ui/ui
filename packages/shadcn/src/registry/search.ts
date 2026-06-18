import {
  registryItemTypeSchema,
  searchResultErrorSchema,
  searchResultItemSchema,
  searchResultsSchema,
} from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fuzzysort from "fuzzysort"
import { z } from "zod"

import { resolveGitHubRegistrySource } from "./address"
import { getRegistry } from "./api"
import { BUILTIN_REGISTRIES } from "./constants"
import { clearRegistryContext } from "./context"

// Resolves which registries a search should target. When none are provided
// explicitly, returns every registry configured in the project, excluding
// builtin registries (e.g. @shadcn) — "search all" means the registries the
// user actually configured. Shared by the CLI command and the MCP server so
// both resolve "search all" the same way.
export function resolveSearchRegistries(
  registries: string[],
  config?: Partial<Config>
): string[] {
  if (registries.length > 0) {
    return registries
  }

  return Object.keys(config?.registries ?? {}).filter(
    (registry) => !(registry in BUILTIN_REGISTRIES)
  )
}

// Cap how many registries we fetch at once so searching many configured
// registries does not open an unbounded number of connections.
export const SEARCH_CONCURRENCY = 8

// Like Promise.allSettled, but runs at most `limit` tasks at a time and
// preserves input order in the returned results.
async function mapSettledWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      try {
        results[index] = { status: "fulfilled", value: await fn(items[index]) }
      } catch (reason) {
        results[index] = { status: "rejected", reason }
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker()
  )
  await Promise.all(workers)

  return results
}

export async function searchRegistries(
  registries: string[],
  options?: {
    query?: string
    types?: string[]
    limit?: number
    offset?: number
    config?: Partial<Config>
    useCache?: boolean
    // When true, a registry that fails to load is skipped (and recorded in the
    // returned `errors`) instead of throwing. Use this when searching across
    // many registries (e.g. all configured registries) so one broken registry
    // does not abort the entire search.
    continueOnError?: boolean
  }
) {
  const {
    query,
    types,
    limit,
    offset,
    config,
    useCache = false,
    continueOnError,
  } = options || {}

  // Start from a clean slate so this call does not inherit registry header
  // context from a previous operation. Matches getRegistryItems/resolve.
  clearRegistryContext()

  let allItems: z.infer<typeof searchResultItemSchema>[] = []
  const errors: z.infer<typeof searchResultErrorSchema>[] = []

  // Fetch registries concurrently (capped), then process the results in the
  // original order so the output is deterministic regardless of which
  // responses land first. This matters most when searching many registries.
  const outcomes = await mapSettledWithConcurrency(
    registries,
    SEARCH_CONCURRENCY,
    (registry) => getRegistry(registry, { config, useCache })
  )

  for (let index = 0; index < registries.length; index++) {
    const registry = registries[index]
    const outcome = outcomes[index]

    if (outcome.status === "rejected") {
      if (!continueOnError) {
        throw outcome.reason
      }
      errors.push({
        registry,
        message:
          outcome.reason instanceof Error
            ? outcome.reason.message
            : String(outcome.reason),
      })
      continue
    }

    const itemsWithRegistry = (outcome.value.items || []).map((item) => ({
      name: item.name,
      type: item.type,
      description: item.description,
      registry,
      addCommandArgument: buildRegistryItemNameFromRegistry(
        item.name,
        registry
      ),
    }))

    allItems = allItems.concat(itemsWithRegistry)
  }

  // Filter by type before the fuzzy query. Accepts both shorthand ("ui") and
  // the full namespaced form ("registry:ui"), case-insensitively.
  if (types?.length) {
    const wantedTypes = new Set(
      types.map((type) => formatSearchResultType(type).toLowerCase())
    )
    allItems = allItems.filter(
      (item) =>
        item.type &&
        wantedTypes.has(formatSearchResultType(item.type).toLowerCase())
    )
  }

  if (query) {
    allItems = searchItems(allItems, {
      query,
      limit: allItems.length,
      keys: ["name", "description"],
    }) as z.infer<typeof searchResultItemSchema>[]
  }

  const paginationOffset = offset || 0
  const paginationLimit = limit || allItems.length
  const totalItems = allItems.length

  const result: z.infer<typeof searchResultsSchema> = {
    pagination: {
      total: totalItems,
      offset: paginationOffset,
      limit: paginationLimit,
      hasMore: paginationOffset + paginationLimit < totalItems,
    },
    items: allItems.slice(paginationOffset, paginationOffset + paginationLimit),
    // Only surface errors when present so consumers parsing successful
    // searches see the same shape as before.
    ...(errors.length > 0 ? { errors } : {}),
  }

  return searchResultsSchema.parse(result)
}

const searchableItemSchema = z
  .object({
    name: z.string(),
    type: z.string().optional(),
    description: z.string().optional(),
    registry: z.string().optional(),
    addCommandArgument: z.string().optional(),
  })
  .passthrough()

type SearchableItem = z.infer<typeof searchableItemSchema>

function searchItems<
  T extends {
    name: string
    type?: string
    description?: string
    addCommandArgument?: string
    [key: string]: any
  } = SearchableItem,
>(
  items: T[],
  options: {
    query: string
  } & Pick<Parameters<typeof fuzzysort.go>[2], "keys" | "threshold" | "limit">
) {
  options = {
    limit: 100,
    threshold: -10000,
    ...options,
  }

  const searchResults = fuzzysort.go(options.query, items, {
    keys: options.keys,
    threshold: options.threshold,
    limit: options.limit,
  })

  const results = searchResults.map((result) => result.obj)

  return z.array(searchableItemSchema).parse(results)
}

function isUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// Builds the registry item name for the add command.
// For namespaced registries, returns "registry/item".
// For URL registries, replaces "registry" with the item name in the URL.
export function buildRegistryItemNameFromRegistry(
  name: string,
  registry: string
) {
  const githubSource = resolveGitHubRegistrySource(registry)
  if (githubSource) {
    const itemAddress = `${githubSource.owner}/${githubSource.repo}/${name}`
    return githubSource.ref ? `${itemAddress}#${githubSource.ref}` : itemAddress
  }

  // If registry is not a URL, return namespace format.
  if (!isUrl(registry)) {
    return `${registry}/${name}`
  }

  // Find where the host part ends in the original string.
  const protocolEnd = registry.indexOf("://") + 3
  const hostEnd = registry.indexOf("/", protocolEnd)

  if (hostEnd === -1) {
    // No path, check for query params.
    const queryStart = registry.indexOf("?", protocolEnd)
    if (queryStart !== -1) {
      // Has query params but no path.
      const beforeQuery = registry.substring(0, queryStart)
      const queryAndAfter = registry.substring(queryStart)
      // Replace "registry" with itemName in query params only.
      const updatedQuery = queryAndAfter.replace(/\bregistry\b/g, name)
      return beforeQuery + updatedQuery
    }
    // No path or query, return as is.
    return registry
  }

  // Split at host boundary.
  const hostPart = registry.substring(0, hostEnd)
  const pathAndQuery = registry.substring(hostEnd)

  // Find all occurrences of "registry" in path and query.
  // Replace only the last occurrence in the path segment.
  const pathEnd =
    pathAndQuery.indexOf("?") !== -1
      ? pathAndQuery.indexOf("?")
      : pathAndQuery.length
  const pathOnly = pathAndQuery.substring(0, pathEnd)
  const queryAndAfter = pathAndQuery.substring(pathEnd)

  // Replace the last occurrence of "registry" in the path.
  const lastIndex = pathOnly.lastIndexOf("registry")
  let updatedPath = pathOnly
  if (lastIndex !== -1) {
    updatedPath =
      pathOnly.substring(0, lastIndex) +
      name +
      pathOnly.substring(lastIndex + "registry".length)
  }

  // Replace all occurrences of "registry" in query params.
  const updatedQuery = queryAndAfter.replace(/\bregistry\b/g, name)

  return hostPart + updatedPath + updatedQuery
}

export const SEARCH_RESULT_DESCRIPTION_MAX_LENGTH = 80

export function formatSearchResultType(type?: string) {
  if (!type) {
    return ""
  }

  return type.startsWith("registry:") ? type.slice("registry:".length) : type
}

// Internal-only types that should not be offered as a --type filter.
const INTERNAL_TYPES = ["registry:example", "registry:internal"]

// The item types accepted by the --type filter, in shorthand form (e.g. "ui").
export const SEARCHABLE_TYPES = registryItemTypeSchema.options
  .filter((type) => !INTERNAL_TYPES.includes(type))
  .map((type) => formatSearchResultType(type))

// Returns the provided types that are not valid searchable types. Accepts both
// shorthand ("ui") and the full namespaced form ("registry:ui").
export function findUnknownSearchTypes(types: string[]): string[] {
  const valid = new Set(SEARCHABLE_TYPES.map((type) => type.toLowerCase()))
  return types.filter(
    (type) => !valid.has(formatSearchResultType(type).toLowerCase())
  )
}

export function formatSearchResultDescription(
  description: string,
  maxLength = SEARCH_RESULT_DESCRIPTION_MAX_LENGTH
) {
  const normalized = description.trim().replace(/\s+/g, " ")

  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength - 3).trimEnd()
  const lastSpace = truncated.lastIndexOf(" ")
  const base =
    lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated

  return `${base.trimEnd()}...`
}

function formatSearchResultItem(
  item: z.infer<typeof searchResultsSchema>["items"][number],
  options: {
    showRegistry: boolean
  }
) {
  const name = item.addCommandArgument ?? item.name
  const type = formatSearchResultType(item.type)
  const typeSuffix = type ? ` (${type})` : ""
  const registrySuffix =
    options.showRegistry && item.registry ? ` · ${item.registry}` : ""
  const descriptionSuffix = item.description
    ? ` — ${formatSearchResultDescription(item.description)}`
    : ""

  return `- ${highlighter.info(name)}${typeSuffix}${registrySuffix}${descriptionSuffix}`
}

// Describes what was searched, e.g. ` of type ui matching "button" in @one`.
// Shared by the results header and the empty-state message so they stay in
// sync. Types are normalized for display ("registry:ui" → "ui") to match how
// types are shown in the results themselves.
function formatSearchScope(options: {
  query?: string
  types?: string[]
  registries: string[]
}) {
  const { query, types, registries } = options

  let scope = ""
  if (types?.length) {
    scope += ` of type ${types
      .map((type) => formatSearchResultType(type))
      .join(", ")}`
  }
  if (query) {
    scope += ` matching ${highlighter.info(`"${query}"`)}`
  }
  if (registries.length > 0) {
    scope += ` in ${registries.join(", ")}`
  }

  return scope
}

export function printSearchResults(
  results: z.infer<typeof searchResultsSchema>,
  options: {
    query?: string
    types?: string[]
    registries: string[]
  }
) {
  const { pagination, items, errors } = results
  const showRegistry = options.registries.length > 1

  // Surface any registries that were skipped during the search so users know
  // the results may be incomplete.
  if (errors?.length) {
    for (const { registry, message } of errors) {
      logger.warn(`Skipped ${registry}: ${message}`)
    }
    logger.break()
  }

  if (items.length === 0) {
    logger.warn(`No items found${formatSearchScope(options)}.`)
    return
  }

  const itemCount = `${pagination.total} item${
    pagination.total === 1 ? "" : "s"
  }`
  logger.info(`Found ${itemCount}${formatSearchScope(options)}`)

  const start = pagination.offset + 1
  const end = Math.min(pagination.offset + pagination.limit, pagination.total)
  logger.log(`Showing ${start}-${end} of ${pagination.total}`)
  logger.break()

  logger.log(
    items
      .map((item) => formatSearchResultItem(item, { showRegistry }))
      .join("\n")
  )

  if (pagination.hasMore) {
    logger.break()
    logger.log(
      `More items available. Use ${highlighter.info(
        `--offset ${pagination.offset + pagination.limit}`
      )} to see the next page.`
    )
  }
}
