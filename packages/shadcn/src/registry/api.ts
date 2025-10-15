import path from "path"
import { buildUrlAndHeadersForRegistryItem } from "@/src/registry/builder"
import { configWithDefaults } from "@/src/registry/config"
import {
  BASE_COLORS,
  BUILTIN_REGISTRIES,
  REGISTRY_URL,
} from "@/src/registry/constants"
import {
  clearRegistryContext,
  setRegistryHeaders,
} from "@/src/registry/context"
import {
  ConfigParseError,
  RegistriesIndexParseError,
  RegistryInvalidNamespaceError,
  RegistryNotFoundError,
  RegistryParseError,
} from "@/src/registry/errors"
import { fetchRegistry } from "@/src/registry/fetcher"
import {
  fetchRegistryItems,
  resolveRegistryTree,
} from "@/src/registry/resolver"
import { isUrl } from "@/src/registry/utils"
import {
  iconsSchema,
  registriesIndexSchema,
  registryBaseColorSchema,
  registryConfigSchema,
  registryIndexSchema,
  registryItemSchema,
  registrySchema,
  stylesSchema,
} from "@/src/schema"
import { Config, explorer } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { z } from "zod"

export async function getRegistry(
  name: string,
  options?: {
    config?: Partial<Config>
    useCache?: boolean
  }
) {
  const { config, useCache } = options || {}

  if (isUrl(name)) {
    const [result] = await fetchRegistry([name], { useCache })
    try {
      return registrySchema.parse(result)
    } catch (error) {
      throw new RegistryParseError(name, error)
    }
  }

  if (!name.startsWith("@")) {
    throw new RegistryInvalidNamespaceError(name)
  }

  let registryName = name
  if (!registryName.endsWith("/registry")) {
    registryName = `${registryName}/registry`
  }

  const urlAndHeaders = buildUrlAndHeadersForRegistryItem(
    registryName as `@${string}`,
    configWithDefaults(config)
  )

  if (!urlAndHeaders?.url) {
    throw new RegistryNotFoundError(registryName)
  }

  if (urlAndHeaders.headers && Object.keys(urlAndHeaders.headers).length > 0) {
    setRegistryHeaders({
      [urlAndHeaders.url]: urlAndHeaders.headers,
    })
  }

  const [result] = await fetchRegistry([urlAndHeaders.url], { useCache })

  try {
    return registrySchema.parse(result)
  } catch (error) {
    throw new RegistryParseError(registryName, error)
  }
}

export async function getRegistryItems(
  items: string[],
  options?: {
    config?: Partial<Config>
    useCache?: boolean
  }
) {
  const { config, useCache = false } = options || {}

  clearRegistryContext()

  return fetchRegistryItems(items, configWithDefaults(config), { useCache })
}

export async function resolveRegistryItems(
  items: string[],
  options?: {
    config?: Partial<Config>
    useCache?: boolean
  }
) {
  const { config, useCache = false } = options || {}

  clearRegistryContext()
  return resolveRegistryTree(items, configWithDefaults(config), { useCache })
}

export async function getRegistriesConfig(
  cwd: string,
  options?: { useCache?: boolean }
) {
  const { useCache = true } = options || {}

  // Clear cache if requested
  if (!useCache) {
    explorer.clearCaches()
  }

  const configResult = await explorer.search(cwd)

  if (!configResult) {
    // Do not throw an error if the config is missing.
    // We still have access to the built-in registries.
    return {
      registries: BUILTIN_REGISTRIES,
    }
  }

  // Parse just the registries field from the config
  const registriesConfig = z
    .object({
      registries: registryConfigSchema.optional(),
    })
    .safeParse(configResult.config)

  if (!registriesConfig.success) {
    throw new ConfigParseError(cwd, registriesConfig.error)
  }

  // Merge built-in registries with user registries
  return {
    registries: {
      ...BUILTIN_REGISTRIES,
      ...(registriesConfig.data.registries || {}),
    },
  }
}

export async function getShadcnRegistryIndex() {
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

/**
 * @deprecated This function is deprecated and will be removed in a future version.
 */
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

/**
 * @deprecated This function is deprecated and will be removed in a future version.
 */
export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const paths = tree.map((item) => `styles/${style}/${item.name}.json`)
    const results = await fetchRegistry(paths)
    return results.map((result) => registryItemSchema.parse(result))
  } catch (error) {
    handleError(error)
    return []
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

export async function getRegistriesIndex(options?: { useCache?: boolean }) {
  options = {
    useCache: true,
    ...options,
  }

  const url = `${REGISTRY_URL}/registries.json`
  const [data] = await fetchRegistry([url], {
    useCache: options.useCache,
  })

  try {
    return registriesIndexSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new RegistriesIndexParseError(error)
    }

    throw error
  }
}
