import path from "path"
import { BASE_COLORS } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { RegistryError, RegistryParseError } from "@/src/registry/errors"
import { fetchRegistry, fetchRegistryLocal } from "@/src/registry/fetcher"
import {
  getResolvedStyle,
  resolveRegistryItemsFromRegistries,
} from "@/src/registry/resolver"
import {
  iconsSchema,
  registryBaseColorSchema,
  registryIndexSchema,
  registryItemSchema,
  registrySchema,
  stylesSchema,
} from "@/src/registry/schema"
import { isLocalFile, isUrl } from "@/src/registry/utils"
import { Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { z } from "zod"

export async function getRegistry(
  name: `${string}/registry`,
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  }
) {
  // Get resolved style once.
  const resolvedStyle = config ? await getResolvedStyle(config) : undefined
  const configWithStyle =
    config && resolvedStyle ? { ...config, style: resolvedStyle } : config

  let path: string
  if (name.startsWith("@") && config?.registries) {
    // Scoped registry.
    const [resolvedPath] = resolveRegistryItemsFromRegistries(
      [name],
      configWithStyle || config!
    )
    path = resolvedPath
  } else if (configWithStyle) {
    // Regular registry path.
    const [resolvedPath] = resolveRegistryItemsFromRegistries(
      [name],
      configWithStyle
    )
    path = resolvedPath
  } else {
    path = name
  }

  const [result] = await fetchRegistry([path], { useCache: false })
  if (!result) {
    throw new RegistryError(`Failed to fetch registry: ${name}`, {
      context: { name, path },
    })
  }

  try {
    return registrySchema.parse(result)
  } catch (error) {
    throw new RegistryParseError(name, error)
  }
}

export async function getRegistryItems(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options: { useCache?: boolean } = {}
): Promise<z.infer<typeof registryItemSchema>[]> {
  clearRegistryContext()

  const resolvedStyle = await getResolvedStyle(config)
  const configWithStyle =
    config && resolvedStyle ? { ...config, style: resolvedStyle } : config

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

      if (item.startsWith("@") && configWithStyle?.registries) {
        const paths = resolveRegistryItemsFromRegistries(
          [item],
          configWithStyle
        )
        const [result] = await fetchRegistry(paths, options)
        try {
          return registryItemSchema.parse(result)
        } catch (error) {
          throw new RegistryParseError(item, error)
        }
      }

      const path = `styles/${resolvedStyle ?? "new-york-v4"}/${item}.json`
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
