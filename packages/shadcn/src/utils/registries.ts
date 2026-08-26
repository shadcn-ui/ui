import path from "path"
import {
  getPackageJsonRegistries,
  getRegistriesIndex,
} from "@/src/registry/api"
import { BUILTIN_REGISTRIES } from "@/src/registry/constants"
import { resolveRegistryNamespaces } from "@/src/registry/namespaces"
import { Config } from "@/src/utils/get-config"
import { spinner } from "@/src/utils/spinner"
import fs from "fs-extra"

export async function ensureRegistriesInConfig(
  components: string[],
  config: Config,
  options: {
    silent?: boolean
    writeFile?: boolean
  } = {}
) {
  options = {
    silent: false,
    writeFile: true,
    ...options,
  }

  // Use resolveRegistryNamespaces to discover all namespaces including dependencies.
  const registryNames = await resolveRegistryNamespaces(components, config)

  const missingRegistries = registryNames.filter(
    (registry) =>
      !config.registries?.[registry] &&
      !Object.keys(BUILTIN_REGISTRIES).includes(registry)
  )

  if (missingRegistries.length === 0) {
    return {
      config,
      newRegistries: [],
      discoveredRegistries: {},
      packageJsonRegistries: {},
    }
  }

  // Resolve missing registries from package.json first. These are merged
  // into the config in memory and never written to components.json.
  const declaredRegistries = await getPackageJsonRegistries(
    config.resolvedPaths.cwd
  )
  const packageJsonRegistries: NonNullable<Config["registries"]> = {}
  const unresolvedRegistries: string[] = []
  for (const registry of missingRegistries) {
    if (declaredRegistries[registry]) {
      packageJsonRegistries[registry] = declaredRegistries[registry]
    } else {
      unresolvedRegistries.push(registry)
    }
  }

  // Fall back to the registries index for anything not in package.json.
  // We'll fail silently if we can't fetch the registry index.
  // The error handling by caller will guide user to add the missing registries.
  const discoveredRegistries: Record<string, string> = {}
  if (unresolvedRegistries.length > 0) {
    const registryIndex = await getRegistriesIndex({
      useCache: process.env.NODE_ENV !== "development",
    })

    if (registryIndex) {
      for (const registry of unresolvedRegistries) {
        if (registryIndex[registry]) {
          discoveredRegistries[registry] = registryIndex[registry]
        }
      }
    }
  }

  const foundRegistries = {
    ...packageJsonRegistries,
    ...discoveredRegistries,
  }

  if (Object.keys(foundRegistries).length === 0) {
    return {
      config,
      newRegistries: [],
      discoveredRegistries: {},
      packageJsonRegistries: {},
    }
  }

  // Filter out built-in registries from existing config before merging
  const existingRegistries = Object.fromEntries(
    Object.entries(config.registries || {}).filter(
      ([key]) => !Object.keys(BUILTIN_REGISTRIES).includes(key)
    )
  )

  const newConfigWithRegistries = {
    ...config,
    registries: {
      ...existingRegistries,
      ...foundRegistries,
    },
  }

  // Only registries discovered from the registries index are persisted.
  // The written config is built from the file on disk so registries that
  // only live in memory (e.g. from package.json) are never persisted.
  if (options.writeFile && Object.keys(discoveredRegistries).length > 0) {
    const configPath = path.resolve(config.resolvedPaths.cwd, "components.json")
    if (fs.existsSync(configPath)) {
      const configSpinner = spinner("Updating components.json.", {
        silent: options.silent,
      }).start()
      const rawConfig = await fs.readJson(configPath)
      const updatedConfig = {
        ...rawConfig,
        registries: {
          ...rawConfig.registries,
          ...discoveredRegistries,
        },
      }
      await fs.writeFile(
        configPath,
        JSON.stringify(updatedConfig, null, 2) + "\n",
        "utf-8"
      )
      configSpinner.succeed()
    }
  }

  return {
    config: newConfigWithRegistries,
    newRegistries: Object.keys(foundRegistries),
    discoveredRegistries,
    packageJsonRegistries,
  }
}
