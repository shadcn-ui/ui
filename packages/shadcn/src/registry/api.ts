import { createHash } from "crypto"
import { promises as fs } from "fs"
import { homedir } from "os"
import path from "path"
import { clearRegistryContext } from "@/src/registry/context"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import { resolveRegistryItemsFromRegistries } from "@/src/registry/resolver"
import { isLocalFile, isUrl } from "@/src/registry/utils"
import { Config } from "@/src/utils/get-config"
import { getProjectTailwindVersionFromConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { z } from "zod"

import { BASE_COLORS } from "./constants"
import { fetchRegistry } from "./fetcher"
import {
  iconsSchema,
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemSchema,
  registrySchema,
  stylesSchema,
} from "./schema"

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"])

    return registryIndexSchema.parse(result)
  } catch (error) {
    logger.error("\n")
    handleError(error)
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"])

    return stylesSchema.parse(result)
  } catch (error) {
    logger.error("\n")
    handleError(error)
    return []
  }
}

export async function getRegistryIcons() {
  try {
    const [result] = await fetchRegistry(["icons/index.json"])
    return iconsSchema.parse(result)
  } catch (error) {
    handleError(error)
    return {}
  }
}

export async function getRegistryItem(
  name: string,
  config?: Parameters<typeof getRegistryItems>[1],
  options?: {
    useCache?: boolean
  }
) {
  const [result] = await getRegistryItems([name], config, options)
  return result
}

async function getLocalRegistryItem(filePath: string) {
  try {
    // Handle tilde expansion for home directory
    let expandedPath = filePath
    if (filePath.startsWith("~/")) {
      expandedPath = path.join(homedir(), filePath.slice(2))
    }

    const resolvedPath = path.resolve(expandedPath)
    const content = await fs.readFile(resolvedPath, "utf8")
    const parsed = JSON.parse(content)

    return registryItemSchema.parse(parsed)
  } catch (error) {
    logger.error(`Failed to read local registry file: ${filePath}`)
    handleError(error)
    return null
  }
}

export async function getRegistry(
  name: `${string}/registry`,
  config?: Parameters<typeof getRegistryItems>[1]
) {
  try {
    const results = await getRegistryItems([name], config, { useCache: false })

    if (!results?.length) {
      return null
    }

    return registrySchema.parse(results[0])
  } catch (error) {
    logger.break()
    handleError(error)
    return null
  }
}

export async function getRegistryBaseColors() {
  return BASE_COLORS
}

export async function getRegistryBaseColor(baseColor: string) {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`])

    return registryBaseColorSchema.parse(result)
  } catch (error) {
    handleError(error)
  }
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[]
) {
  const tree: z.infer<typeof registryIndexSchema> = []

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name)

    if (!entry) {
      continue
    }

    tree.push(entry)

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies)
      tree.push(...dependencies)
    }
  }

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  )
}

export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const paths = tree.map((item) => `styles/${style}/${item.name}.json`)
    const result = await fetchRegistry(paths)
    return registryIndexSchema.parse(result)
  } catch (error) {
    handleError(error)
  }
}

/**
 * @deprecated This function is deprecated and will be removed in a future version.
 */
export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof registryItemSchema>, "type">,
  override?: string
) {
  if (override) {
    return override
  }

  if (item.type === "registry:ui") {
    return config.resolvedPaths.ui ?? config.resolvedPaths.components
  }

  const [parent, type] = item.type?.split(":") ?? []
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type
  )
}

async function getResolvedStyle(
  config?: Pick<Config, "style"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  }
) {
  if (!config) {
    return undefined
  }

  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)
  return tailwindVersion === "v4" && config.style === "new-york"
    ? "new-york-v4"
    : config.style
}

// Overload for registry path.
export async function getRegistryItems(
  items: `${string}/registry`[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<(z.infer<typeof registrySchema> | null)[]>

// Overload for registry items.
export async function getRegistryItems(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<(z.infer<typeof registryItemSchema> | null)[]>

// Fetches registry items from various sources including local files, URLs,
// scoped packages, and regular component names.
export async function getRegistryItems(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<
  (z.infer<typeof registryItemSchema> | z.infer<typeof registrySchema> | null)[]
> {
  options = {
    useCache: true,
    ...options,
  }
  clearRegistryContext()

  const results = await Promise.all(
    items.map(async (item) => {
      try {
        if (isLocalFile(item)) {
          return await getLocalRegistryItem(item)
        }

        if (isUrl(item)) {
          const [result] = await fetchRegistry([item], options)
          if (item.endsWith("/registry.json") || item.endsWith("/registry")) {
            return registrySchema.parse(result)
          }
          return registryItemSchema.parse(result)
        }

        if (item.endsWith("/registry")) {
          const resolvedStyle = await getResolvedStyle(config)
          const configWithStyle =
            config && resolvedStyle
              ? { ...config, style: resolvedStyle }
              : config

          const paths = configWithStyle
            ? resolveRegistryItemsFromRegistries([item], configWithStyle)
            : [item]

          const [result] = await fetchRegistry(paths, options)
          return registrySchema.parse(result)
        }

        if (item.startsWith("@") && config?.registries) {
          const resolvedStyle = await getResolvedStyle(config)
          const configWithStyle =
            config && resolvedStyle
              ? { ...config, style: resolvedStyle }
              : config

          const [resolvedPath] = resolveRegistryItemsFromRegistries(
            [item],
            configWithStyle
          )
          const [result] = await fetchRegistry([resolvedPath], options)
          return registryItemSchema.parse(result)
        }

        const resolvedStyle = config
          ? await getResolvedStyle(config)
          : undefined
        const path = `styles/${resolvedStyle ?? "new-york-v4"}/${item}.json`
        const [result] = await fetchRegistry([path], options)
        return registryItemSchema.parse(result)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`Failed to fetch "${item}": ${errorMessage}`)
        return null
      }
    })
  )

  return results
}
export function getRegistryTypeAliasMap() {
  return new Map<string, string>([
    ["registry:ui", "ui"],
    ["registry:lib", "lib"],
    ["registry:hook", "hooks"],
    ["registry:block", "components"],
    ["registry:component", "components"],
  ])
}

// Track a dependency and its parent.
export function getRegistryParentMap(
  registryItems: z.infer<typeof registryItemSchema>[]
) {
  const map = new Map<string, z.infer<typeof registryItemSchema>>()
  registryItems.forEach((item) => {
    if (!item.registryDependencies) {
      return
    }

    item.registryDependencies.forEach((dependency) => {
      map.set(dependency, item)
    })
  })
  return map
}

const registryItemWithSourceSchema = registryItemSchema.extend({
  _source: z.string().optional(),
})

function computeItemHash(
  item: Pick<z.infer<typeof registryItemSchema>, "name">,
  source?: string
) {
  const identifier = source || item.name

  const hash = createHash("sha256")
    .update(identifier)
    .digest("hex")
    .substring(0, 8)

  return `${item.name}::${hash}`
}

function extractItemIdentifierFromDependency(dependency: string) {
  if (isUrl(dependency)) {
    const url = new URL(dependency)
    const pathname = url.pathname
    const match = pathname.match(/\/([^/]+)\.json$/)
    const name = match ? match[1] : path.basename(pathname, ".json")

    return {
      name,
      hash: computeItemHash({ name }, dependency),
    }
  }

  if (isLocalFile(dependency)) {
    const match = dependency.match(/\/([^/]+)\.json$/)
    const name = match ? match[1] : path.basename(dependency, ".json")

    return {
      name,
      hash: computeItemHash({ name }, dependency),
    }
  }

  const { item } = parseRegistryAndItemFromString(dependency)
  return {
    name: item,
    hash: computeItemHash({ name: item }, dependency),
  }
}

function topologicalSortRegistryItems(
  items: z.infer<typeof registryItemSchema>[],
  sourceMap: Map<z.infer<typeof registryItemSchema>, string>
) {
  const itemMap = new Map<string, z.infer<typeof registryItemSchema>>()
  const hashToItem = new Map<string, z.infer<typeof registryItemSchema>>()
  const inDegree = new Map<string, number>()
  const adjacencyList = new Map<string, string[]>()

  items.forEach((item) => {
    const source = sourceMap.get(item) || item.name
    const hash = computeItemHash(item, source)

    itemMap.set(hash, item)
    hashToItem.set(hash, item)
    inDegree.set(hash, 0)
    adjacencyList.set(hash, [])
  })

  // Build a map of dependency to possible items.
  const depToHashes = new Map<string, string[]>()
  items.forEach((item) => {
    const source = sourceMap.get(item) || item.name
    const hash = computeItemHash(item, source)

    if (!depToHashes.has(item.name)) {
      depToHashes.set(item.name, [])
    }
    depToHashes.get(item.name)!.push(hash)

    if (source !== item.name) {
      if (!depToHashes.has(source)) {
        depToHashes.set(source, [])
      }
      depToHashes.get(source)!.push(hash)
    }
  })

  items.forEach((item) => {
    const itemSource = sourceMap.get(item) || item.name
    const itemHash = computeItemHash(item, itemSource)

    if (item.registryDependencies) {
      item.registryDependencies.forEach((dep) => {
        let depHash: string | undefined

        const exactMatches = depToHashes.get(dep) || []
        if (exactMatches.length === 1) {
          depHash = exactMatches[0]
        } else if (exactMatches.length > 1) {
          // Multiple matches - try to disambiguate.
          // For now, just use the first one and warn.
          depHash = exactMatches[0]
        } else {
          const { name } = extractItemIdentifierFromDependency(dep)
          const nameMatches = depToHashes.get(name) || []
          if (nameMatches.length > 0) {
            depHash = nameMatches[0]
          }
        }

        if (depHash && itemMap.has(depHash)) {
          adjacencyList.get(depHash)!.push(itemHash)
          inDegree.set(itemHash, inDegree.get(itemHash)! + 1)
        }
      })
    }
  })

  // Implements Kahn's algorithm.
  const queue: string[] = []
  const sorted: z.infer<typeof registryItemSchema>[] = []

  inDegree.forEach((degree, hash) => {
    if (degree === 0) {
      queue.push(hash)
    }
  })

  while (queue.length > 0) {
    const currentHash = queue.shift()!
    const item = itemMap.get(currentHash)!
    sorted.push(item)

    adjacencyList.get(currentHash)!.forEach((dependentHash) => {
      const newDegree = inDegree.get(dependentHash)! - 1
      inDegree.set(dependentHash, newDegree)

      if (newDegree === 0) {
        queue.push(dependentHash)
      }
    })
  }

  if (sorted.length !== items.length) {
    console.warn("Circular dependency detected in registry items")
    // Return all items even if there are circular dependencies
    // Items not in sorted are part of circular dependencies
    const sortedHashes = new Set(
      sorted.map((item) => {
        const source = sourceMap.get(item) || item.name
        return computeItemHash(item, source)
      })
    )

    items.forEach((item) => {
      const source = sourceMap.get(item) || item.name
      const hash = computeItemHash(item, source)
      if (!sortedHashes.has(hash)) {
        sorted.push(item)
      }
    })
  }

  return sorted
}
