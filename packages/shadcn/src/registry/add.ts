import path from "path"
import { clearRegistryContext } from "@/src/registry/context"
import { resolveRegistryTree } from "@/src/registry/resolver"
import {
  addComponents,
  type AddComponentsOptions,
} from "@/src/utils/add-components"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { createConfig, getConfig, type Config } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"

const TARGET_ALIAS_KEYS = ["components", "ui", "lib", "hooks"] as const

export interface AddRegistryItemsOptions
  extends Pick<
    AddComponentsOptions,
    "overwrite" | "overwriteCssVars" | "silent" | "skipFonts" | "path"
  > {
  /** The project directory. Defaults to the current working directory. */
  cwd?: string
}

/**
 * Resolve and install registry items into a project.
 *
 * This is the programmatic equivalent of `shadcn add` for an existing project.
 * Universal registry items with explicit file targets can also be installed
 * without a components.json file.
 */
export async function addRegistryItems(
  items: string[],
  options: AddRegistryItemsOptions = {}
): Promise<void> {
  if (items.length === 0) {
    return
  }

  const cwd = path.resolve(options.cwd ?? process.cwd())

  try {
    await loadEnvFiles(cwd)

    const projectConfig = await getConfig(cwd)
    let config =
      projectConfig ??
      createConfig({
        resolvedPaths: { cwd },
      })

    const { config: configWithRegistries } = await ensureRegistriesInConfig(
      items,
      config,
      {
        silent: options.silent,
        writeFile: projectConfig !== null,
      }
    )
    config = configWithRegistries

    if (!projectConfig) {
      const registryTree = await resolveRegistryTree(items, config, {
        useCache: true,
        requireUniversal: true,
      })
      if (!hasResolvedTargetAliases(registryTree, config)) {
        throw new Error(
          "A components.json file is required to resolve target aliases."
        )
      }
    }

    await addComponents(items, config, options)
  } finally {
    clearRegistryContext()
  }
}

function hasResolvedTargetAliases(
  registryTree: Awaited<ReturnType<typeof resolveRegistryTree>>,
  config: Config
) {
  if (!registryTree) {
    return false
  }

  return (registryTree.files ?? []).every((file) => {
    const aliasKey = file.target?.match(/^@([^/]+)\//)?.[1]

    return (
      !aliasKey ||
      !isTargetAliasKey(aliasKey) ||
      Boolean(config.resolvedPaths[aliasKey])
    )
  })
}

function isTargetAliasKey(
  key: string
): key is (typeof TARGET_ALIAS_KEYS)[number] {
  return TARGET_ALIAS_KEYS.includes(key as (typeof TARGET_ALIAS_KEYS)[number])
}
