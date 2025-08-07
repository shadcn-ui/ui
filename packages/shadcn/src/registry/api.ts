import { createHash } from "crypto"
import { promises as fs } from "fs"
import { homedir } from "os"
import path from "path"
import { buildUrlAndHeadersForRegistryItem } from "@/src/registry/builder"
import {
  clearRegistryContext,
  getRegistryHeadersFromContext,
} from "@/src/registry/context"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import { resolveRegistryItemsFromRegistries } from "@/src/registry/resolver"
import { deduplicateFilesByTarget, isLocalFile } from "@/src/registry/utils"
import { Config, getTargetStyleFromConfig } from "@/src/utils/get-config"
import { getProjectTailwindVersionFromConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { buildTailwindThemeColorsFromCssVars } from "@/src/utils/updaters/update-tailwind-config"
import deepmerge from "deepmerge"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import { z } from "zod"

import { REGISTRY_URL } from "./constants"
import {
  iconsSchema,
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  registrySchema,
  stylesSchema,
} from "./schema"

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

const registryCache = new Map<string, Promise<any>>()

export const BASE_COLORS = [
  {
    name: "neutral",
    label: "Neutral",
  },
  {
    name: "gray",
    label: "Gray",
  },
  {
    name: "zinc",
    label: "Zinc",
  },
  {
    name: "stone",
    label: "Stone",
  },
  {
    name: "slate",
    label: "Slate",
  },
] as const

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
  config?: Parameters<typeof fetchFromRegistry>[1],
  options?: {
    useCache?: boolean
  }
) {
  options = {
    useCache: true,
    ...options,
  }

  try {
    if (isLocalFile(name)) {
      return await getLocalRegistryItem(name)
    }

    if (isUrl(name)) {
      const [result] = await fetchFromRegistry([name], config)
      return result
    }

    if (name.startsWith("@") && config?.registries) {
      const [result] = await fetchFromRegistry([name], config, options)
      return result
    }

    // Handles regular component names.
    const resolvedStyle = await getResolvedStyle(config)
    const path = `styles/${resolvedStyle ?? "new-york-v4"}/${name}.json`
    const [result] = await fetchFromRegistry([path], config, options)
    return result
  } catch (error) {
    logger.break()
    handleError(error)
    return null
  }
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
  config?: Parameters<typeof fetchFromRegistry>[1]
) {
  try {
    const results = await fetchFromRegistry([name], config, { useCache: false })

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

export async function fetchRegistry(
  paths: string[],
  options: { useCache?: boolean } = {}
) {
  options = {
    useCache: true,
    ...options,
  }

  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path)

        // Check cache first if caching is enabled
        if (options.useCache && registryCache.has(url)) {
          return registryCache.get(url)
        }

        // Store the promise in the cache before awaiting if caching is enabled
        const fetchPromise = (async () => {
          // Get headers from context for this URL
          const headers = getRegistryHeadersFromContext(url)

          const response = await fetch(url, {
            agent,
            headers: {
              ...headers,
            },
          })

          if (!response.ok) {
            const errorMessages: { [key: number]: string } = {
              400: "Bad request",
              401: "Unauthorized",
              403: "Forbidden",
              404: "Not found",
              500: "Internal server error",
            }

            let errorDetails = ""
            try {
              const result = await response.json()
              if (result && typeof result === "object") {
                const messages = []
                if ("error" in result && result.error) {
                  messages.push(`[${result.error}]: `)
                }
                if ("message" in result && result.message) {
                  messages.push(result.message)
                }
                if (messages.length > 0) {
                  errorDetails = `\n\nServer response: \n${messages.join("")}`
                }
              }
            } catch {
              // If we can't parse JSON, that's okay
            }

            if (response.status === 401) {
              throw new Error(
                `You are not authorized to access the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate.${errorDetails}`
              )
            }

            if (response.status === 404) {
              throw new Error(
                `The component at ${highlighter.info(
                  url
                )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.${errorDetails}`
              )
            }

            if (response.status === 403) {
              throw new Error(
                `You do not have access to the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate or a token.${errorDetails}`
              )
            }

            throw new Error(
              `Failed to fetch from ${highlighter.info(url)}.\n${
                errorDetails ||
                response.statusText ||
                errorMessages[response.status]
              }`
            )
          }

          return response.json()
        })()

        if (options.useCache) {
          registryCache.set(url, fetchPromise)
        }
        return fetchPromise
      })
    )

    return results
  } catch (error) {
    logger.error("\n")
    handleError(error)
    return []
  }
}

export function clearRegistryCache() {
  registryCache.clear()
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

export async function fetchFromRegistry(
  items: `${string}/registry`[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<z.infer<typeof registrySchema>[]>

export async function fetchFromRegistry(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<z.infer<typeof registryItemSchema>[]>

export async function fetchFromRegistry(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options: { useCache?: boolean } = {}
): Promise<
  (z.infer<typeof registrySchema> | z.infer<typeof registryItemSchema>)[]
> {
  clearRegistryContext()

  const resolvedStyle = await getResolvedStyle(config)
  const configWithStyle =
    config && resolvedStyle ? { ...config, style: resolvedStyle } : config
  const paths = configWithStyle
    ? resolveRegistryItemsFromRegistries(items, configWithStyle)
    : items

  const results = await fetchRegistry(paths, options)

  return results.map((result, index) => {
    const originalItem = items[index]
    const resolvedItem = paths[index]

    if (
      originalItem.endsWith("/registry") ||
      resolvedItem.endsWith("/registry.json")
    ) {
      return registrySchema.parse(result)
    }

    return registryItemSchema.parse(result)
  })
}

async function resolveDependenciesRecursively(
  dependencies: string[],
  config?: Pick<Config, "style" | "registries" | "resolvedPaths">,
  visited: Set<string> = new Set()
) {
  const items: z.infer<typeof registryItemSchema>[] = []
  const registryNames: string[] = []

  for (const dep of dependencies) {
    if (visited.has(dep)) {
      continue
    }
    visited.add(dep)

    // Handle URLs and local files directly
    if (isUrl(dep) || isLocalFile(dep)) {
      const item = await getRegistryItem(dep, config)
      if (item) {
        items.push(item)
        if (item.registryDependencies) {
          const nested = await resolveDependenciesRecursively(
            item.registryDependencies,
            config,
            visited
          )
          items.push(...nested.items)
          registryNames.push(...nested.registryNames)
        }
      }
    }
    // Handle namespaced items (e.g., @one/foo, @two/bar)
    else if (dep.startsWith("@") && config?.registries) {
      // Check if the registry exists
      const { registry } = parseRegistryAndItemFromString(dep)
      if (registry && !(registry in config.registries)) {
        throw new Error(
          `The items you're adding depend on unknown registry ${registry}. \nMake sure it is defined in components.json as follows:\n` +
            `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
        )
      }

      // Let getRegistryItem handle the namespaced item with config
      // This ensures proper authentication headers are used
      const item = await getRegistryItem(dep, config)
      if (item) {
        items.push(item)
        if (item.registryDependencies) {
          const nested = await resolveDependenciesRecursively(
            item.registryDependencies,
            config,
            visited
          )
          items.push(...nested.items)
          registryNames.push(...nested.registryNames)
        }
      }
    }
    // Handle regular component names
    else {
      registryNames.push(dep)

      if (config) {
        try {
          const item = await getRegistryItem(dep, config)
          if (item && item.registryDependencies) {
            const nested = await resolveDependenciesRecursively(
              item.registryDependencies,
              config,
              visited
            )
            items.push(...nested.items)
            registryNames.push(...nested.registryNames)
          }
        } catch (error) {
          // If we can't fetch the registry item, that's okay - we'll still include the name.
        }
      }
    }
  }

  return { items, registryNames }
}

export async function registryResolveItemsTree(
  names: z.infer<typeof registryItemSchema>["name"][],
  config: Config
) {
  try {
    // Check for namespaced items when no registries are configured
    const namespacedItems = names.filter(
      (name) => !isLocalFile(name) && !isUrl(name) && name.startsWith("@")
    )

    if (namespacedItems.length > 0 && !config?.registries) {
      const { registry } = parseRegistryAndItemFromString(namespacedItems[0])
      throw new Error(
        `Unknown registry "${registry}". Make sure it is defined in components.json as follows:\n` +
          `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
      )
    }

    // Separate local files, URLs, and registry names.
    const localFiles = names.filter((name) => isLocalFile(name))
    const urls = names.filter((name) => isUrl(name))
    const registryNames = names.filter(
      (name) => !isLocalFile(name) && !isUrl(name)
    )

    let payload: z.infer<typeof registryItemWithSourceSchema>[] = []

    // Handle local files and URLs directly, resolving their dependencies individually.
    let allDependencyItems: z.infer<typeof registryItemWithSourceSchema>[] = []
    let allDependencyRegistryNames: string[] = []

    const resolvedStyle = await getResolvedStyle(config)
    const configWithStyle =
      config && resolvedStyle ? { ...config, style: resolvedStyle } : config

    // Deduplicate exact URLs/paths before fetching
    const uniqueLocalFiles = Array.from(new Set(localFiles))
    const uniqueUrls = Array.from(new Set(urls))

    for (const localFile of uniqueLocalFiles) {
      const item = await getRegistryItem(localFile)
      if (item) {
        // Add source tracking
        const itemWithSource: z.infer<typeof registryItemWithSourceSchema> = {
          ...item,
          _source: localFile,
        }
        payload.push(itemWithSource)
        if (item.registryDependencies) {
          // Resolve namespace syntax and set headers for dependencies
          let resolvedDependencies = item.registryDependencies

          // Check for namespaced dependencies when no registries are configured
          if (!config?.registries) {
            const namespacedDeps = item.registryDependencies.filter((dep) =>
              dep.startsWith("@")
            )
            if (namespacedDeps.length > 0) {
              const { registry } = parseRegistryAndItemFromString(
                namespacedDeps[0]
              )
              throw new Error(
                `The items you're adding depend on unknown registry ${registry}. \nMake sure it is defined in components.json as follows:\n` +
                  `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
              )
            }
          } else {
            resolvedDependencies = resolveRegistryItemsFromRegistries(
              item.registryDependencies,
              configWithStyle
            )
          }

          const { items, registryNames } = await resolveDependenciesRecursively(
            resolvedDependencies,
            config,
            new Set()
          )
          allDependencyItems.push(...items)
          allDependencyRegistryNames.push(...registryNames)
        }
      }
    }

    for (const url of uniqueUrls) {
      const item = await getRegistryItem(url, config)
      if (item) {
        // Add source tracking
        const itemWithSource: z.infer<typeof registryItemWithSourceSchema> = {
          ...item,
          _source: url,
        }
        payload.push(itemWithSource)
        if (item.registryDependencies) {
          // Resolve namespace syntax and set headers for dependencies
          let resolvedDependencies = item.registryDependencies

          // Check for namespaced dependencies when no registries are configured
          if (!config?.registries) {
            const namespacedDeps = item.registryDependencies.filter((dep) =>
              dep.startsWith("@")
            )
            if (namespacedDeps.length > 0) {
              const { registry } = parseRegistryAndItemFromString(
                namespacedDeps[0]
              )
              throw new Error(
                `The items you're adding depend on unknown registry ${registry}. \nMake sure it is defined in components.json as follows:\n` +
                  `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
              )
            }
          } else {
            resolvedDependencies = resolveRegistryItemsFromRegistries(
              item.registryDependencies,
              configWithStyle
            )
          }

          const { items, registryNames } = await resolveDependenciesRecursively(
            resolvedDependencies,
            config,
            new Set()
          )

          allDependencyItems.push(...items)
          allDependencyRegistryNames.push(...registryNames)
        }
      }
    }

    payload.push(...allDependencyItems)

    // Handle registry names using the new fetchFromRegistry logic.
    const allRegistryNames = [...registryNames, ...allDependencyRegistryNames]
    if (allRegistryNames.length > 0) {
      // Separate namespaced and non-namespaced items
      const nonNamespacedItems = allRegistryNames.filter(
        (name) => !name.startsWith("@")
      )
      const namespacedItems = allRegistryNames.filter((name) =>
        name.startsWith("@")
      )

      // Handle namespaced items directly with fetchFromRegistry
      if (namespacedItems.length > 0) {
        const results = await fetchFromRegistry(namespacedItems, config)
        const namespacedPayload = results as z.infer<
          typeof registryItemSchema
        >[]

        // Add source tracking for namespaced items
        const itemsWithSource: z.infer<typeof registryItemWithSourceSchema>[] =
          namespacedPayload.map((item, index) => ({
            ...item,
            _source: namespacedItems[index],
          }))

        payload.push(...itemsWithSource)

        // Process dependencies of namespaced items
        for (const item of namespacedPayload) {
          if (item.registryDependencies) {
            const { items: depItems, registryNames: depNames } =
              await resolveDependenciesRecursively(
                item.registryDependencies,
                config,
                new Set([...namespacedItems])
              )
            payload.push(...depItems)

            // Add any non-namespaced dependencies to be processed
            const nonNamespacedDeps = depNames.filter(
              (name) => !name.startsWith("@")
            )
            nonNamespacedItems.push(...nonNamespacedDeps)
          }
        }
      }

      // For non-namespaced items, we need the index and style resolution
      if (nonNamespacedItems.length > 0) {
        const index = await getRegistryIndex()
        if (!index && payload.length === 0) {
          return null
        }

        if (index) {
          // Remove duplicates from non-namespaced items
          const uniqueNonNamespaced = Array.from(new Set(nonNamespacedItems))

          // If we're resolving the index, we want it to go first
          if (uniqueNonNamespaced.includes("index")) {
            uniqueNonNamespaced.unshift("index")
          }

          // Resolve non-namespaced items through the existing flow
          let registryItems = await resolveRegistryItems(
            uniqueNonNamespaced,
            config
          )
          let result = await fetchRegistry(registryItems)
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
    if (allRegistryNames.includes("index")) {
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
      dependencies: deepmerge.all(
        payload.map((item) => item.dependencies ?? [])
      ),
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
  } catch (error) {
    handleError(error)
    return null
  }
}

async function resolveRegistryDependencies(url: string, config: Config) {
  if (isUrl(url)) {
    return [url]
  }

  const { registryNames } = await resolveDependenciesRecursively(
    [url],
    config,
    new Set()
  )

  const style = config.resolvedPaths?.cwd
    ? await getTargetStyleFromConfig(config.resolvedPaths.cwd, config.style)
    : config.style

  const urls = registryNames.map((name) =>
    getRegistryUrl(isUrl(name) ? name : `styles/${style}/${name}.json`)
  )

  return Array.from(new Set(urls))
}

export async function registryGetTheme(name: string, config: Config) {
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

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    // If the url contains /chat/b/, we assume it's the v0 registry.
    // We need to add the /json suffix if it's missing.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith("/json")) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL}/${path}`
}

export function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

// TODO: We're double-fetching here. Use a cache.
export async function resolveRegistryItems(names: string[], config: Config) {
  let registryDependencies: string[] = []

  const registryNames = names.filter(
    (name) => !isLocalFile(name) && !isUrl(name)
  )

  const resolvedStyle = await getResolvedStyle(config)
  for (const name of registryNames) {
    let resolvedName = name
    if (config) {
      try {
        const configWithStyle =
          config && resolvedStyle ? { ...config, style: resolvedStyle } : config

        const resolved = buildUrlAndHeadersForRegistryItem(
          name,
          configWithStyle
        )
        if (resolved) {
          resolvedName = resolved.url
        }
      } catch (error) {}
    }

    const itemRegistryDependencies = await resolveRegistryDependencies(
      resolvedName,
      config
    )
    registryDependencies.push(...itemRegistryDependencies)
  }

  return Array.from(new Set(registryDependencies))
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
