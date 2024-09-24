import path from "path"
import { Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import {
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemFileSchema,
  registryItemSchema,
  registryResolvedItemsTreeSchema,
  stylesSchema,
} from "@/src/utils/registry/schema"
import { buildTailwindThemeColorsFromCssVars } from "@/src/utils/updaters/update-tailwind-config"
import deepmerge from "deepmerge"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import { z } from "zod"

export const REGISTRY_URL =
  process.env.REGISTRY_URL ?? "https://ui.shadcn.com/r"

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function getRegistryIndex(registryUrl?: string) {
  try {
    const [result] = await fetchRegistry(["index.json"], registryUrl)
    return registryIndexSchema.parse(result)
  } catch (error) {
    logger.error("\n")
    handleError(error)
  }
}

export async function getRegistryStyles(registryUrl?: string) {
  try {
    const [result] = await fetchRegistry(["styles/index.json"], registryUrl)

    return stylesSchema.parse(result)
  } catch (error) {
    logger.error("\n")
    handleError(error)
    return []
  }
}

export async function getRegistryItem(
  name: string,
  style: string,
  registryUrl?: string
) {
  try {
    let [result] = await fetchRegistry(
      [isUrl(name) ? name : `styles/${style}/${name}.json`],
      registryUrl,
      true
    )

    return registryItemSchema.parse(result)
  } catch (error) {
    logger.break()
    handleError(error)
    return null
  }
}

export async function getRegistryBaseColors() {
  return [
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
  ]
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
  registryUrl?: string,
  ignoreErrors?: boolean
) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path, registryUrl)
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
      })
    )

    return results
  } catch (error) {
    if (!ignoreErrors) {
      logger.error("\n")
      handleError(error)
    }
    return []
  }
}

export function getRegistryItemFileTargetPath(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
  override?: string
) {
  if (override) {
    return override
  }

  if (file.type === "registry:ui") {
    return config.resolvedPaths.ui
  }

  if (file.type === "registry:lib") {
    return config.resolvedPaths.lib
  }

  if (file.type === "registry:block" || file.type === "registry:component") {
    return config.resolvedPaths.components
  }

  if (file.type === "registry:hook") {
    return config.resolvedPaths.hooks
  }

  // TODO: we put this in components for now.
  // We should move this to pages as per framework.
  if (file.type === "registry:page") {
    return config.resolvedPaths.components
  }

  return config.resolvedPaths.components
}

export async function registryResolveItemsTree(
  names: z.infer<typeof registryItemSchema>["name"][],
  config: Config
) {
  try {
    const index = await getRegistryIndex(config.url)

    if (!index) {
      return null
    }

    // If we're resolving the index, we want it to go first.
    if (names.includes("index")) {
      names.unshift("index")
    }

    let registryDependencies: string[] = []
    for (const name of names) {
      const itemRegistryDependencies = await resolveRegistryDependencies(
        name,
        config,
      )
      registryDependencies.push(...itemRegistryDependencies)
    }

    const uniqueRegistryDependencies = Array.from(new Set(registryDependencies))
    let result = await fetchRegistry(uniqueRegistryDependencies, config.url)
    const payload = z.array(registryItemSchema).parse(result)

    if (!payload) {
      return null
    }

    // If we're resolving the index, we want to fetch
    // the theme item if a base color is provided.
    // We do this for index only.
    // Other components will ship with their theme tokens.
    if (names.includes("index")) {
      if (config.tailwind.baseColor) {
        const theme = await registryGetTheme(config.tailwind.baseColor, config)
        if (theme) {
          payload.unshift(theme)
        }
      }
    }

    let tailwind = {}
    payload.forEach((item) => {
      tailwind = deepmerge(tailwind, item.tailwind ?? {})
    })

    let cssVars = {}
    payload.forEach((item) => {
      cssVars = deepmerge(cssVars, item.cssVars ?? {})
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
  const visited = new Set<string>()
  const payload: string[] = []

  async function resolveDependencies(itemUrl: string) {
    const url = getRegistryUrl(
      isUrl(itemUrl) ? itemUrl : `styles/${config.style}/${itemUrl}.json`,
      config.url
    )

    if (visited.has(url)) {
      return
    }

    visited.add(url)

    try {
      const [result] = await fetchRegistry([url], config.url)
      const item = registryItemSchema.parse(result)
      payload.push(url)

      if (item.registryDependencies) {
        for (const dependency of item.registryDependencies) {
          await resolveDependencies(dependency)
        }
      }
    } catch (error) {
      console.error(
        `Error fetching or parsing registry item at ${itemUrl}:`,
        error
      )
    }
  }

  await resolveDependencies(url)
  return Array.from(new Set(payload))
}

export async function registryGetTheme(name: string, config: Config) {
  const baseColor = await getRegistryBaseColor(name)
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
      light: {
        radius: "0.5rem",
      },
      dark: {},
    },
  } satisfies z.infer<typeof registryItemSchema>

  if (config.tailwind.cssVariables) {
    theme.tailwind.config.theme.extend.colors = {
      ...theme.tailwind.config.theme.extend.colors,
      ...buildTailwindThemeColorsFromCssVars(baseColor.cssVars.dark),
    }
    theme.cssVars = {
      light: {
        ...baseColor.cssVars.light,
        ...theme.cssVars.light,
      },
      dark: {
        ...baseColor.cssVars.dark,
        ...theme.cssVars.dark,
      },
    }
  }

  return theme
}

function getRegistryUrl(path: string, registryUrl?: string) {
  if (isUrl(path)) {
    // If the url contains /chat/b/, we assume it's the v0 registry.
    // We need to add the /json suffix if it's missing.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith("/json")) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${registryUrl || REGISTRY_URL}/${path}`
}

function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

export async function getDefaultConfig(
  defaultConfig: Config,
  registryUrl?: string
) {
  if (registryUrl === "https://ui.shadcn.com/r") {
    return defaultConfig
  }

  const [result] = await fetchRegistry(["config.json"], registryUrl, true)

  if (result) {
    return {
      ...defaultConfig,
      ...result,
      tailwind: {
        ...defaultConfig.tailwind,
        ...(result as any).tailwind,
      },
      aliases: {
        ...defaultConfig.aliases,
        ...(result as any).aliases,
      },
    } as Config
  }

  return defaultConfig
}
