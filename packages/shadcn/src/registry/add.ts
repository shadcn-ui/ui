import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { clearRegistryContext } from "@/src/registry/context"
import { isUniversalRegistryItem } from "@/src/registry/utils"
import {
  addComponents,
  type AddComponentsOptions,
} from "@/src/utils/add-components"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { createConfig, getConfig } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"

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
      const registryItems = await getRegistryItems(items, { config })
      if (!registryItems.every(isUniversalRegistryItem)) {
        throw new Error(
          "A components.json file is required to add non-universal registry items."
        )
      }
    }

    await addComponents(items, config, options)
  } finally {
    clearRegistryContext()
  }
}
