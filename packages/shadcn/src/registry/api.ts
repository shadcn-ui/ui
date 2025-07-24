import { promises as fs } from "fs"
import { homedir } from "os"
import path from "path"
import { isLocalFile } from "@/src/registry/utils"
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

import {
  iconsSchema,
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  stylesSchema,
} from "./schema"

const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://ui.shadcn.com/r"

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

export async function getRegistryItem(name: string, style: string) {
  try {
    // Handle local file paths
    if (isLocalFile(name)) {
      return await getLocalRegistryItem(name)
    }

    // Handle URLs and component names
    const [result] = await fetchRegistry([
      isUrl(name) ? name : `styles/${style}/${name}.json`,
    ])

    return registryItemSchema.parse(result)
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
          const response = await fetch(url, { agent })

          if (!response.ok) {
            const errorMessages: { [key: number]: string } = {
              400: "Bad request",
              401: "Unauthorized",
              403: "Forbidden",
              404: "Not found",
              500: "Internal server error",
            }

            if (response.status === 401) {
              throw new Error(
                `You are not authorized to access the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate.`
              )
            }

            if (response.status === 404) {
              throw new Error(
                `The component at ${highlighter.info(
                  url
                )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`
              )
            }

            if (response.status === 403) {
              throw new Error(
                `You do not have access to the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate or a token.`
              )
            }

            const result = await response.json()
            const message =
              result && typeof result === "object" && "error" in result
                ? result.error
                : response.statusText || errorMessages[response.status]
            throw new Error(
              `Failed to fetch from ${highlighter.info(url)}.\n${message}`
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

async function resolveDependenciesRecursively(
  dependencies: string[],
  config?: Config,
  visited: Set<string> = new Set()
): Promise<{
  items: z.infer<typeof registryItemSchema>[]
  registryNames: string[]
}> {
  const items: z.infer<typeof registryItemSchema>[] = []
  const registryNames: string[] = []

  for (const dep of dependencies) {
    // Avoid infinite recursion.
    if (visited.has(dep)) {
      continue
    }
    visited.add(dep)

    if (isUrl(dep) || isLocalFile(dep)) {
      const item = await getRegistryItem(dep, "")
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
    } else {
      // Registry name - add it to the list
      registryNames.push(dep)

      // If we have config, we can also fetch the item to get its dependencies
      if (config) {
        const style = config.resolvedPaths?.cwd
          ? await getTargetStyleFromConfig(
              config.resolvedPaths.cwd,
              config.style
            )
          : config.style

        try {
          const item = await getRegistryItem(dep, style)
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
          // If we can't fetch the registry item, that's okay - we'll still include the name
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
    // Separate local files, URLs, and registry names.
    const localFiles = names.filter((name) => isLocalFile(name))
    const urls = names.filter((name) => isUrl(name))
    const registryNames = names.filter(
      (name) => !isLocalFile(name) && !isUrl(name)
    )

    const payload: z.infer<typeof registryItemSchema>[] = []

    // Handle local files and URLs directly, collecting their dependencies.
    const allDependencies: string[] = []

    for (const localFile of localFiles) {
      const item = await getRegistryItem(localFile, "")
      if (item) {
        payload.push(item)
        if (item.registryDependencies) {
          allDependencies.push(...item.registryDependencies)
        }
      }
    }

    for (const url of urls) {
      const item = await getRegistryItem(url, "")
      if (item) {
        payload.push(item)
        if (item.registryDependencies) {
          allDependencies.push(...item.registryDependencies)
        }
      }
    }

    // Recursively resolve all dependencies.
    const { items: dependencyItems, registryNames: dependencyRegistryNames } =
      await resolveDependenciesRecursively(allDependencies, config)

    payload.push(...dependencyItems)

    // Handle registry names using existing resolveRegistryItems logic.
    const allRegistryNames = [...registryNames, ...dependencyRegistryNames]
    if (allRegistryNames.length > 0) {
      const index = await getRegistryIndex()
      if (!index) {
        // If we only have local files or URLs, that's fine.
        if (payload.length === 0) {
          return null
        }
      } else {
        // Remove duplicates.
        const uniqueRegistryNames = Array.from(new Set(allRegistryNames))

        // If we're resolving the index, we want it to go first.
        if (uniqueRegistryNames.includes("index")) {
          uniqueRegistryNames.unshift("index")
        }

        let registryItems = await resolveRegistryItems(
          uniqueRegistryNames,
          config
        )
        let result = await fetchRegistry(registryItems)
        const registryPayload = z.array(registryItemSchema).parse(result)
        payload.push(...registryPayload)
      }
    }

    if (!payload.length) {
      return null
    }

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

    // Sort the payload so that registry:theme is always first.
    payload.sort((a, b) => {
      if (a.type === "registry:theme") {
        return -1
      }
      return 1
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

    return registryResolvedItemsTreeSchema.parse({
      dependencies: deepmerge.all(
        payload.map((item) => item.dependencies ?? [])
      ),
      devDependencies: deepmerge.all(
        payload.map((item) => item.devDependencies ?? [])
      ),
      files: deepmerge.all(payload.map((item) => item.files ?? [])),
      tailwind,
      cssVars,
      css,
      docs,
    })
  } catch (error) {
    handleError(error)
    return null
  }
}

async function resolveRegistryDependencies(
  url: string,
  config: Config
): Promise<string[]> {
  const { registryNames } = await resolveDependenciesRecursively([url], config)

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

  // Filter out local files and URLs - these should be handled directly by getRegistryItem
  const registryNames = names.filter(
    (name) => !isLocalFile(name) && !isUrl(name)
  )

  for (const name of registryNames) {
    const itemRegistryDependencies = await resolveRegistryDependencies(
      name,
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
