import { createHash } from "crypto"
import path from "path"
import {
  getRegistryBaseColor,
  getShadcnRegistryIndex,
} from "@/src/registry/api"
import {
  buildUrlAndHeadersForRegistryItem,
  resolveRegistryUrl,
} from "@/src/registry/builder"
import { setRegistryHeaders } from "@/src/registry/context"
import {
  RegistryNotConfiguredError,
  RegistryParseError,
} from "@/src/registry/errors"
import { fetchRegistry, fetchRegistryLocal } from "@/src/registry/fetcher"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import {
  deduplicateFilesByTarget,
  isLocalFile,
  isUrl,
} from "@/src/registry/utils"
import {
  registryItemSchema,
  registryResolvedItemsTreeSchema,
} from "@/src/schema"
import { Config, getTargetStyleFromConfig } from "@/src/utils/get-config"
import { getProjectTailwindVersionFromConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { buildTailwindThemeColorsFromCssVars } from "@/src/utils/updaters/update-tailwind-config"
import deepmerge from "deepmerge"
import { z } from "zod"

export function resolveRegistryItemsFromRegistries(
  items: string[],
  config: Config
) {
  const registryHeaders: Record<string, Record<string, string>> = {}
  const resolvedItems = [...items]

  if (!config?.registries) {
    setRegistryHeaders({})
    return resolvedItems
  }

  for (let i = 0; i < resolvedItems.length; i++) {
    const resolved = buildUrlAndHeadersForRegistryItem(resolvedItems[i], config)

    if (resolved) {
      resolvedItems[i] = resolved.url

      if (Object.keys(resolved.headers).length > 0) {
        registryHeaders[resolved.url] = resolved.headers
      }
    }
  }

  setRegistryHeaders(registryHeaders)

  return resolvedItems
}

// Internal function that fetches registry items without clearing context.
// This is used for recursive dependency resolution.
export async function fetchRegistryItems(
  items: string[],
  config: Config,
  options: { useCache?: boolean } = {}
) {
  const results = await Promise.all(
    items.map(async (item) => {
      if (isLocalFile(item)) {
        return fetchRegistryLocal(item)
      }

      if (isUrl(item)) {
        const [result] = await fetchRegistry([item], options)
        try {
          return registryItemSchema.parse(result)
        } catch (error) {
          throw new RegistryParseError(item, error)
        }
      }

      if (item.startsWith("@") && config?.registries) {
        const paths = resolveRegistryItemsFromRegistries([item], config)
        const [result] = await fetchRegistry(paths, options)
        try {
          return registryItemSchema.parse(result)
        } catch (error) {
          throw new RegistryParseError(item, error)
        }
      }

      const path = `styles/${config?.style ?? "new-york-v4"}/${item}.json`
      const [result] = await fetchRegistry([path], options)
      try {
        return registryItemSchema.parse(result)
      } catch (error) {
        throw new RegistryParseError(item, error)
      }
    })
  )

  return results
}

// Helper schema for items with source tracking
const registryItemWithSourceSchema = registryItemSchema.extend({
  _source: z.string().optional(),
})

// Resolves a list of registry items with all their dependencies and returns
// a complete installation bundle with merged configuration.
export async function resolveRegistryTree(
  names: z.infer<typeof registryItemSchema>["name"][],
  config: Config,
  options: { useCache?: boolean } = {}
) {
  options = {
    useCache: true,
    ...options,
  }

  let payload: z.infer<typeof registryItemWithSourceSchema>[] = []
  let allDependencyItems: z.infer<typeof registryItemWithSourceSchema>[] = []
  let allDependencyRegistryNames: string[] = []

  const uniqueNames = Array.from(new Set(names))

  const results = await fetchRegistryItems(uniqueNames, config, options)

  const resultMap = new Map<string, z.infer<typeof registryItemSchema>>()
  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      resultMap.set(uniqueNames[i], results[i])
    }
  }

  for (const [sourceName, item] of Array.from(resultMap.entries())) {
    // Add source tracking
    const itemWithSource: z.infer<typeof registryItemWithSourceSchema> = {
      ...item,
      _source: sourceName,
    }
    payload.push(itemWithSource)

    if (item.registryDependencies) {
      // Resolve namespace syntax and set headers for dependencies
      let resolvedDependencies = item.registryDependencies

      // Check for namespaced dependencies when no registries are configured
      if (!config?.registries) {
        const namespacedDeps = item.registryDependencies.filter((dep: string) =>
          dep.startsWith("@")
        )
        if (namespacedDeps.length > 0) {
          const { registry } = parseRegistryAndItemFromString(namespacedDeps[0])
          throw new RegistryNotConfiguredError(registry)
        }
      } else {
        resolvedDependencies = resolveRegistryItemsFromRegistries(
          item.registryDependencies,
          config
        )
      }

      const { items, registryNames } = await resolveDependenciesRecursively(
        resolvedDependencies,
        config,
        options,
        new Set(uniqueNames)
      )
      allDependencyItems.push(...items)
      allDependencyRegistryNames.push(...registryNames)
    }
  }

  payload.push(...allDependencyItems)

  // Handle any remaining registry names that need index resolution
  if (allDependencyRegistryNames.length > 0) {
    // Remove duplicates from registry names
    const uniqueRegistryNames = Array.from(new Set(allDependencyRegistryNames))

    // Separate namespaced and non-namespaced items
    const nonNamespacedItems = uniqueRegistryNames.filter(
      (name) => !name.startsWith("@")
    )
    const namespacedDepItems = uniqueRegistryNames.filter((name) =>
      name.startsWith("@")
    )

    // Handle namespaced dependency items
    if (namespacedDepItems.length > 0) {
      // This will now throw specific errors on failure
      const depResults = await fetchRegistryItems(
        namespacedDepItems,
        config,
        options
      )

      for (let i = 0; i < depResults.length; i++) {
        const item = depResults[i]
        const itemWithSource: z.infer<typeof registryItemWithSourceSchema> = {
          ...item,
          _source: namespacedDepItems[i],
        }
        payload.push(itemWithSource)
      }
    }

    // For non-namespaced items, we need the index and style resolution
    if (nonNamespacedItems.length > 0) {
      const index = await getShadcnRegistryIndex()
      if (!index && payload.length === 0) {
        return null
      }

      if (index) {
        // If we're resolving the index, we want it to go first
        if (nonNamespacedItems.includes("index")) {
          nonNamespacedItems.unshift("index")
        }

        // Resolve non-namespaced items through the existing flow
        // Get URLs for all registry items including their dependencies
        const registryUrls: string[] = []
        for (const name of nonNamespacedItems) {
          const itemDependencies = await resolveRegistryDependencies(
            name,
            config,
            options
          )
          registryUrls.push(...itemDependencies)
        }

        // Deduplicate URLs
        const uniqueUrls = Array.from(new Set(registryUrls))
        let result = await fetchRegistry(uniqueUrls, options)
        const registryPayload = z.array(registryItemSchema).parse(result)
        payload.push(...registryPayload)
      }
    }
  }

  if (!payload.length) {
    return null
  }

  // No deduplication - we want to support multiple items with the same name from different sources

  // If we're resolving the index, we want to fetch
  // the theme item if a base color is provided.
  // We do this for index only.
  // Other components will ship with their theme tokens.
  if (
    uniqueNames.includes("index") ||
    allDependencyRegistryNames.includes("index")
  ) {
    if (config.tailwind.baseColor) {
      const theme = await registryGetTheme(config.tailwind.baseColor, config)
      if (theme) {
        payload.unshift(theme)
      }
    }
  }

  // Build source map for topological sort
  const sourceMap = new Map<z.infer<typeof registryItemSchema>, string>()
  payload.forEach((item) => {
    // Use the _source property if it was added, otherwise use the name
    const source = item._source || item.name
    sourceMap.set(item, source)
  })

  // Apply topological sort to ensure dependencies come before dependents
  payload = topologicalSortRegistryItems(payload, sourceMap)

  // Sort the payload so that registry:theme items come first,
  // while maintaining the relative order of all items.
  payload.sort((a, b) => {
    if (a.type === "registry:theme" && b.type !== "registry:theme") {
      return -1
    }
    if (a.type !== "registry:theme" && b.type === "registry:theme") {
      return 1
    }
    return 0
  })

  let tailwind = {}
  payload.forEach((item) => {
    tailwind = deepmerge(tailwind, item.tailwind ?? {})
  })

  let cssVars = {}
  payload.forEach((item) => {
    cssVars = deepmerge(cssVars, item.cssVars ?? {})
  })

  let css = {}
  payload.forEach((item) => {
    css = deepmerge(css, item.css ?? {})
  })

  let docs = ""
  payload.forEach((item) => {
    if (item.docs) {
      docs += `${item.docs}\n`
    }
  })

  let envVars = {}
  payload.forEach((item) => {
    envVars = deepmerge(envVars, item.envVars ?? {})
  })

  // Deduplicate files based on resolved target paths.
  const deduplicatedFiles = await deduplicateFilesByTarget(
    payload.map((item) => item.files ?? []),
    config
  )

  const parsed = registryResolvedItemsTreeSchema.parse({
    dependencies: deepmerge.all(payload.map((item) => item.dependencies ?? [])),
    devDependencies: deepmerge.all(
      payload.map((item) => item.devDependencies ?? [])
    ),
    files: deduplicatedFiles,
    tailwind,
    cssVars,
    css,
    docs,
  })

  if (Object.keys(envVars).length > 0) {
    parsed.envVars = envVars
  }

  return parsed
}

async function resolveDependenciesRecursively(
  dependencies: string[],
  config: Config,
  options: { useCache?: boolean } = {},
  visited: Set<string> = new Set()
) {
  const items: z.infer<typeof registryItemSchema>[] = []
  const registryNames: string[] = []

  for (const dep of dependencies) {
    if (visited.has(dep)) {
      continue
    }
    visited.add(dep)

    // Handle URLs and local files directly.
    if (isUrl(dep) || isLocalFile(dep)) {
      const [item] = await fetchRegistryItems([dep], config, options)
      if (item) {
        items.push(item)
        if (item.registryDependencies) {
          // Resolve namespaced dependencies to set proper headers.
          const resolvedDeps = config?.registries
            ? resolveRegistryItemsFromRegistries(
                item.registryDependencies,
                config
              )
            : item.registryDependencies

          const nested = await resolveDependenciesRecursively(
            resolvedDeps,
            config,
            options,
            visited
          )
          items.push(...nested.items)
          registryNames.push(...nested.registryNames)
        }
      }
    }
    // Handle namespaced items (e.g., @one/foo, @two/bar).
    else if (dep.startsWith("@") && config?.registries) {
      // Check if the registry exists.
      const { registry } = parseRegistryAndItemFromString(dep)
      if (registry && !(registry in config.registries)) {
        throw new RegistryNotConfiguredError(registry)
      }

      // Let getRegistryItem handle the namespaced item with config
      // This ensures proper authentication headers are used
      const [item] = await fetchRegistryItems([dep], config, options)
      if (item) {
        items.push(item)
        if (item.registryDependencies) {
          // Resolve namespaced dependencies to set proper headers.
          const resolvedDeps = config?.registries
            ? resolveRegistryItemsFromRegistries(
                item.registryDependencies,
                config
              )
            : item.registryDependencies

          const nested = await resolveDependenciesRecursively(
            resolvedDeps,
            config,
            options,
            visited
          )
          items.push(...nested.items)
          registryNames.push(...nested.registryNames)
        }
      }
    }
    // Handle regular component names.
    else {
      registryNames.push(dep)

      if (config) {
        try {
          const [item] = await fetchRegistryItems([dep], config, options)
          if (item && item.registryDependencies) {
            // Resolve namespaced dependencies to set proper headers.
            const resolvedDeps = config?.registries
              ? resolveRegistryItemsFromRegistries(
                  item.registryDependencies,
                  config
                )
              : item.registryDependencies

            const nested = await resolveDependenciesRecursively(
              resolvedDeps,
              config,
              options,
              visited
            )
            items.push(...nested.items)
            registryNames.push(...nested.registryNames)
          }
        } catch (error) {
          // If we can't fetch the registry item, that's okay - we'll still
          // include the name.
        }
      }
    }
  }

  return { items, registryNames }
}

async function resolveRegistryDependencies(
  url: string,
  config: Config,
  options: { useCache?: boolean } = {}
) {
  if (isUrl(url)) {
    return [url]
  }

  const { registryNames } = await resolveDependenciesRecursively(
    [url],
    config,
    options,
    new Set()
  )

  const style = config.resolvedPaths?.cwd
    ? await getTargetStyleFromConfig(config.resolvedPaths.cwd, config.style)
    : config.style

  const urls = registryNames.map((name) =>
    resolveRegistryUrl(isUrl(name) ? name : `styles/${style}/${name}.json`)
  )

  return Array.from(new Set(urls))
}

async function registryGetTheme(name: string, config: Config) {
  const [baseColor, tailwindVersion] = await Promise.all([
    getRegistryBaseColor(name),
    getProjectTailwindVersionFromConfig(config),
  ])
  if (!baseColor) {
    return null
  }

  // TODO: Move this to the registry i.e registry:theme.
  const theme = {
    name,
    type: "registry:theme",
    tailwind: {
      config: {
        theme: {
          extend: {
            borderRadius: {
              lg: "var(--radius)",
              md: "calc(var(--radius) - 2px)",
              sm: "calc(var(--radius) - 4px)",
            },
            colors: {},
          },
        },
      },
    },
    cssVars: {
      theme: {},
      light: {
        radius: "0.5rem",
      },
      dark: {},
    },
  } satisfies z.infer<typeof registryItemSchema>

  if (config.tailwind.cssVariables) {
    theme.tailwind.config.theme.extend.colors = {
      ...theme.tailwind.config.theme.extend.colors,
      ...buildTailwindThemeColorsFromCssVars(baseColor.cssVars.dark ?? {}),
    }
    theme.cssVars = {
      theme: {
        ...baseColor.cssVars.theme,
        ...theme.cssVars.theme,
      },
      light: {
        ...baseColor.cssVars.light,
        ...theme.cssVars.light,
      },
      dark: {
        ...baseColor.cssVars.dark,
        ...theme.cssVars.dark,
      },
    }

    if (tailwindVersion === "v4" && baseColor.cssVarsV4) {
      theme.cssVars = {
        theme: {
          ...baseColor.cssVarsV4.theme,
          ...theme.cssVars.theme,
        },
        light: {
          radius: "0.625rem",
          ...baseColor.cssVarsV4.light,
        },
        dark: {
          ...baseColor.cssVarsV4.dark,
        },
      }
    }
  }

  return theme
}

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
