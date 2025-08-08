import path from "path"
import { BASE_COLORS } from "@/src/registry/constants"
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
  try {
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
      return null
    }

    return registrySchema.parse(result)
  } catch (error) {
    logger.break()
    handleError(error)
    return null
  }
}

export async function getRegistryItems(
  items: string[],
  config?: Pick<Config, "style" | "registries"> & {
    resolvedPaths: Pick<Config["resolvedPaths"], "cwd">
  },
  options?: { useCache?: boolean }
): Promise<(z.infer<typeof registryItemSchema> | null)[]> {
  options = {
    useCache: true,
    ...options,
  }

  // Get resolved style once for all items.
  const resolvedStyle = config ? await getResolvedStyle(config) : undefined
  const configWithStyle =
    config && resolvedStyle ? { ...config, style: resolvedStyle } : config

  // Categorize items for batch processing.
  const categorized = {
    local: [] as { index: number; path: string }[],
    urls: [] as { index: number; url: string }[],
    scopedPackages: [] as { index: number; item: string }[],
    regular: [] as { index: number; item: string }[],
  }

  items.forEach((item, index) => {
    // Skip registry paths - they should use getRegistry instead.
    if (item.endsWith("/registry")) {
      logger.error(
        `Registry path "${item}" should be fetched using getRegistry() instead`
      )
      return
    }

    if (isLocalFile(item)) {
      categorized.local.push({ index, path: item })
    } else if (isUrl(item)) {
      categorized.urls.push({ index, url: item })
    } else if (item.startsWith("@") && config?.registries) {
      categorized.scopedPackages.push({ index, item })
    } else {
      categorized.regular.push({ index, item })
    }
  })

  // Initialize results array with nulls.
  const results: (z.infer<typeof registryItemSchema> | null)[] = new Array(
    items.length
  ).fill(null)

  // Process local files (no batching needed).
  await Promise.all(
    categorized.local.map(async ({ index, path }) => {
      try {
        results[index] = await fetchRegistryLocal(path)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`Failed to fetch "${path}": ${errorMessage}`)
      }
    })
  )

  // Batch fetch URLs.
  if (categorized.urls.length > 0) {
    try {
      const urlPaths = categorized.urls.map((u) => u.url)
      const urlResults = await fetchRegistry(urlPaths, options)

      categorized.urls.forEach(({ index, url }, i) => {
        try {
          const result = urlResults[i]
          if (result) {
            results[index] = registryItemSchema.parse(result)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logger.error(`Failed to parse "${url}": ${errorMessage}`)
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`Failed to batch fetch URLs: ${errorMessage}`)
    }
  }

  // Batch fetch scoped packages.
  if (categorized.scopedPackages.length > 0 && configWithStyle) {
    try {
      const scopedPaths = categorized.scopedPackages.map(({ item }) => {
        const [resolvedPath] = resolveRegistryItemsFromRegistries(
          [item],
          configWithStyle
        )
        return resolvedPath
      })
      const scopedResults = await fetchRegistry(scopedPaths, options)

      categorized.scopedPackages.forEach(({ index }, i) => {
        try {
          const result = scopedResults[i]
          if (result) {
            results[index] = registryItemSchema.parse(result)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logger.error(
            `Failed to parse scoped package "${items[index]}": ${errorMessage}`
          )
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`Failed to batch fetch scoped packages: ${errorMessage}`)
    }
  }

  // Batch fetch regular items.
  if (categorized.regular.length > 0) {
    try {
      const regularPaths = categorized.regular.map(
        ({ item }) => `styles/${resolvedStyle ?? "new-york-v4"}/${item}.json`
      )
      const regularResults = await fetchRegistry(regularPaths, options)

      categorized.regular.forEach(({ index }, i) => {
        try {
          const result = regularResults[i]
          if (result) {
            results[index] = registryItemSchema.parse(result)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logger.error(`Failed to parse "${items[index]}": ${errorMessage}`)
        }
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(`Failed to batch fetch regular items: ${errorMessage}`)
    }
  }

  return results
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
