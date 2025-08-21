import { searchResultItemSchema, searchResultsSchema } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import fuzzysort from "fuzzysort"
import { z } from "zod"

import { getRegistry } from "./api"

export async function searchRegistries(
  registries: string[],
  options?: {
    query?: string
    limit?: number
    offset?: number
    config?: Partial<Config>
    useCache?: boolean
  }
) {
  const { query, limit, offset, config, useCache } = options || {}

  let allItems: z.infer<typeof searchResultItemSchema>[] = []

  for (const registry of registries) {
    const registryData = await getRegistry(registry, { config, useCache })

    const itemsWithRegistry = (registryData.items || []).map((item) => ({
      name: item.name,
      type: item.type,
      description: item.description,
      registry: registry,
      addCommandArgument: buildRegistryItemNameFromRegistry(
        item.name,
        registry
      ),
    }))

    allItems = allItems.concat(itemsWithRegistry)
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
  } = SearchableItem
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
