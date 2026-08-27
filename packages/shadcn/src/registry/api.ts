import { existsSync } from "fs"
import path from "path"
import { resolveGitHubRegistrySource } from "@/src/registry/address"
import { buildUrlAndHeadersForRegistryItem } from "@/src/registry/builder"
import { configWithDefaults } from "@/src/registry/config"
import {
  BASE_COLORS,
  BUILTIN_REGISTRIES,
  REGISTRY_URL,
} from "@/src/registry/constants"
import { setRegistryHeaders, withRegistryContext } from "@/src/registry/context"
import {
  ConfigParseError,
  RegistriesIndexParseError,
  RegistryInvalidNamespaceError,
  RegistryNotFoundError,
  RegistryParseError,
  RegistryValidationError,
} from "@/src/registry/errors"
import { fetchRegistry } from "@/src/registry/fetcher"
import { fetchGitHubRegistryCatalog } from "@/src/registry/github"
import {
  fetchRegistryItems,
  resolveRegistryTree,
} from "@/src/registry/resolver"
import { isUrl } from "@/src/registry/utils"
import {
  configJsonSchema,
  iconsSchema,
  registriesIndexSchema,
  registriesSchema,
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
import { cosmiconfig } from "cosmiconfig"
import { z } from "zod"

const packageRegistriesExplorer = cosmiconfig("registries", {
  packageProp: "registries",
  searchPlaces: ["package.json"],
})

const registriesConfigFileSchema = z.object({
  registries: registryConfigSchema.optional(),
})

type RegistryApiOptions = {
  config?: Partial<Config>
  useCache?: boolean
}

// Search parameters forwarded to the registry as query params so dynamic
// registries can filter server-side. Static registries ignore them and return
// the full catalog. See https://ui.shadcn.com/docs/registry/dynamic-search.
type RegistrySearchParams = {
  query?: string
  types?: string[]
  limit?: number
  offset?: number
}

type GetRegistryOptions = RegistryApiOptions & {
  searchParams?: RegistrySearchParams
}

function appendSearchParamsToUrl(
  url: string,
  searchParams?: RegistrySearchParams
) {
  if (!searchParams) {
    return url
  }

  const parsedUrl = new URL(url)

  if (searchParams.query) {
    parsedUrl.searchParams.set("q", searchParams.query)
  }

  if (searchParams.types?.length) {
    parsedUrl.searchParams.set("type", searchParams.types.join(","))
  }

  if (searchParams.limit !== undefined) {
    parsedUrl.searchParams.set("limit", String(searchParams.limit))
  }

  if (searchParams.offset !== undefined) {
    parsedUrl.searchParams.set("offset", String(searchParams.offset))
  }

  return parsedUrl.toString()
}

export async function getRegistry(name: string, options?: GetRegistryOptions) {
  return withRegistryContext(() => getRegistryWithContext(name, options))
}

async function getRegistryWithContext(
  name: string,
  options?: GetRegistryOptions
) {
  const { config, useCache, searchParams } = options || {}

  if (isUrl(name)) {
    const url = appendSearchParamsToUrl(name, searchParams)
    const [result] = await fetchRegistry([url], { useCache })
    return parseRegistryCatalog(name, result)
  }

  // GitHub registries are raw files. There is no server to run a search, so
  // search params are not forwarded and filtering happens locally.
  const githubSource = resolveGitHubRegistrySource(name)
  if (githubSource) {
    return fetchGitHubRegistryCatalog(githubSource, { useCache })
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

  // Append search params before registering headers so the header lookup key
  // matches the URL we actually fetch.
  const url = appendSearchParamsToUrl(urlAndHeaders.url, searchParams)

  if (urlAndHeaders.headers && Object.keys(urlAndHeaders.headers).length > 0) {
    setRegistryHeaders({
      [url]: urlAndHeaders.headers,
    })
  }

  const [result] = await fetchRegistry([url], { useCache })

  return parseRegistryCatalog(registryName, result)
}

function parseRegistryCatalog(name: string, result: unknown) {
  try {
    const registry = registrySchema.parse(result)

    if (registry.include?.length) {
      throw new RegistryValidationError(
        `Registry catalog "${name}" uses "include", but consumer registry endpoints must serve a resolved registry catalog. Run "npx shadcn build" and serve the built registry.json, or use loadRegistry() in a dynamic route.`,
        {
          context: {
            registry: name,
            include: registry.include,
          },
          suggestion:
            "Serve a flattened registry.json for CLI consumers. Source registry.json files with include are supported by shadcn build and loadRegistry().",
        }
      )
    }

    return registry
  } catch (error) {
    if (error instanceof RegistryValidationError) {
      throw error
    }

    throw new RegistryParseError(name, error, {
      subject: "registry catalog",
      suggestion:
        "The registry catalog may be corrupted or have an invalid format. Please make sure it returns a valid registry.json object. See https://ui.shadcn.com/schema/registry.json.",
    })
  }
}

export async function getRegistryItems(
  items: string[],
  options?: RegistryApiOptions
) {
  const { config, useCache = false } = options || {}

  return withRegistryContext(() =>
    fetchRegistryItems(items, configWithDefaults(config), { useCache })
  )
}

export async function resolveRegistryItems(
  items: string[],
  options?: RegistryApiOptions
) {
  const { config, useCache = false } = options || {}

  return withRegistryContext(() =>
    resolveRegistryTree(items, configWithDefaults(config), { useCache })
  )
}

export async function getRegistriesConfig(
  cwd: string,
  options?: { useCache?: boolean }
) {
  const { useCache = true } = options || {}

  if (!useCache) {
    explorer.clearCaches()
    packageRegistriesExplorer.clearCaches()
  }

  const packageJsonRegistries = await getPackageJsonRegistries(cwd)

  // Registries are merged from package.json and components.json, with
  // components.json taking precedence per key.
  const componentsJsonPath = path.resolve(cwd, "components.json")
  if (existsSync(componentsJsonPath)) {
    const configResult = await explorer.load(componentsJsonPath)
    const config = parseRegistriesConfig(
      cwd,
      configResult?.config,
      "components.json"
    )

    return {
      registries: {
        ...BUILTIN_REGISTRIES,
        ...packageJsonRegistries,
        ...config.registries,
      },
    }
  }

  return {
    registries: packageJsonRegistries,
  }
}

export async function getPackageJsonRegistries(
  cwd: string
): Promise<z.infer<typeof registryConfigSchema>> {
  const packageJsonPath = path.resolve(cwd, "package.json")
  if (!existsSync(packageJsonPath)) {
    return {}
  }

  const configResult = await packageRegistriesExplorer.load(packageJsonPath)
  return parseRegistriesConfig(
    cwd,
    {
      registries: configResult?.config,
    },
    "package.json"
  ).registries
}

function parseRegistriesConfig(
  cwd: string,
  config: unknown,
  configFile: "components.json" | "package.json"
) {
  const result = registriesConfigFileSchema.safeParse(config)

  if (!result.success) {
    throw new ConfigParseError(cwd, result.error, configFile)
  }

  return {
    registries: result.data.registries || {},
  }
}

export async function getShadcnRegistryIndex() {
  const [result] = await fetchRegistry(["index.json"])

  return registryIndexSchema.parse(result)
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
  const [result] = await fetchRegistry([`colors/${baseColor}.json`])

  return registryBaseColorSchema.parse(result)
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

// Fetch registries with new schema (array of objects with name, homepage, url, featured).
export async function getRegistries(options?: { useCache?: boolean }) {
  options = {
    useCache: true,
    ...options,
  }

  const url = `${REGISTRY_URL}/registries.json`
  const [data] = await fetchRegistry([url], {
    useCache: options.useCache,
  })

  try {
    return registriesSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new RegistriesIndexParseError(error)
    }

    throw error
  }
}

/**
 * @deprecated Use getRegistries() instead.
 */
export async function getRegistriesIndex(options?: { useCache?: boolean }) {
  // Fetch new format and transform to old Record<string, string> for backward compatibility.
  const registries = await getRegistries(options)
  if (!registries) return null
  return Object.fromEntries(registries.map((r) => [r.name, r.url])) as z.infer<
    typeof registriesIndexSchema
  >
}

export async function getPresets(options?: { useCache?: boolean }) {
  options = {
    useCache: true,
    ...options,
  }

  const url = `${REGISTRY_URL}/config.json`
  const [data] = await fetchRegistry([url], {
    useCache: options.useCache,
  })

  const result = configJsonSchema.parse(data)
  return result.presets
}

export async function getPreset(
  name: string,
  options?: { useCache?: boolean }
) {
  const presets = await getPresets(options)
  return (
    presets.find(
      (preset) => preset.name.toLowerCase() === name.toLowerCase()
    ) ?? null
  )
}
