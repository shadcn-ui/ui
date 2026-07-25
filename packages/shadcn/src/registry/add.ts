import path from "path"
import {
  clearRegistryContext,
  withRegistryContext,
} from "@/src/registry/context"
import { resolveRegistryTree } from "@/src/registry/resolver"
import {
  addComponents,
  type AddComponentsOptions,
} from "@/src/utils/add-components"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { createConfig, getConfig, type Config } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { getTargetAliasKey } from "@/src/utils/target-aliases"

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
  const env = await loadEnvFiles(cwd, {
    processEnv: { ...process.env },
  })

  return withRegistryContext(
    async () => {
      try {
        const projectConfig = await getConfig(cwd)
        let config =
          projectConfig ??
          createConfig({
            style: "new-york",
            resolvedPaths: { cwd },
          })
        let resolvedTree:
          | NonNullable<Awaited<ReturnType<typeof resolveRegistryTree>>>
          | undefined

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
          if (!registryTree) {
            throw new Error("Failed to fetch components from registry.")
          }
          if (!hasResolvedTargetAliases(registryTree, config)) {
            throw new Error(
              "A components.json file is required to resolve target aliases."
            )
          }
          resolvedTree = registryTree
        }

        await addComponents(items, config, {
          ...options,
          interactive: false,
          overwriteCssVars:
            options.overwriteCssVars ?? (projectConfig ? undefined : false),
          resolvedTree,
        })
      } finally {
        clearRegistryContext()
      }
    },
    { env }
  )
}

function hasResolvedTargetAliases(
  registryTree: Awaited<ReturnType<typeof resolveRegistryTree>>,
  config: Config
) {
  if (!registryTree) {
    return false
  }

  return (registryTree.files ?? []).every((file) => {
    const aliasKey = getTargetAliasKey(file.target)

    return !aliasKey || Boolean(config.resolvedPaths[aliasKey])
  })
}
