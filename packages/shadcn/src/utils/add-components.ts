import {
  configSchema,
  getWorkspaceConfig,
  workspaceConfigSchema,
  type Config,
} from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  fetchRegistry,
  getRegistryParentMap,
  getRegistryTypeAliasMap,
  registryResolveItemsTree,
  resolveRegistryItems,
} from "@/src/utils/registry"
import { registryItemSchema } from "@/src/utils/registry/schema"
import { spinner } from "@/src/utils/spinner"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateFiles } from "@/src/utils/updaters/update-files"
import { updateTailwindConfig } from "@/src/utils/updaters/update-tailwind-config"
import { z } from "zod"

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
  }
) {
  options = {
    overwrite: false,
    silent: false,
    isNewProject: false,
    ...options,
  }

  // Workspaces.
  const workspaceConfig = await getWorkspaceConfig(config)
  if (workspaceConfig) {
    const workspaceSpinner = spinner(`Checking workspace.`, {
      silent: options.silent,
    })?.start()
    let registryItems = await resolveRegistryItems(components, config)
    let result = await fetchRegistry(registryItems)
    const payload = z.array(registryItemSchema).parse(result)
    workspaceSpinner?.succeed(`Checking workspace.`)

    if (!payload) {
      return null
    }

    const registryParentMap = getRegistryParentMap(payload)

    for (const component of payload) {
      await addWorkspaceComponent(
        component,
        config,
        workspaceConfig,
        registryParentMap.get(component.name) ?? null,
        options
      )
    }

    return
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()

  await updateTailwindConfig(tree.tailwind?.config, config, {
    silent: options.silent,
  })
  await updateCssVars(tree.cssVars, config, {
    cleanupDefaultNextStyles: options.isNewProject,
    silent: options.silent,
  })

  await updateDependencies(tree.dependencies, config, {
    silent: options.silent,
  })
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    silent: options.silent,
  })

  if (tree.docs) {
    logger.info(tree.docs)
  }
}

async function addWorkspaceComponent(
  registryItem: z.infer<typeof registryItemSchema>,
  config: z.infer<typeof configSchema>,
  workspaceConfig: z.infer<typeof workspaceConfigSchema>,
  registryParent: z.infer<typeof registryItemSchema> | null,
  options: {
    overwrite?: boolean
    silent?: boolean
  }
) {
  const registryTypeAliasMap = getRegistryTypeAliasMap()
  const alias = registryTypeAliasMap.get(registryItem.type)

  if (!alias) {
    return
  }

  // A good start is ui for now.
  // TODO: Add support for other types.
  let targetConfig =
    registryItem.type === "registry:ui" ||
    registryParent?.type === "registry:ui"
      ? workspaceConfig.ui
      : config

  await updateTailwindConfig(registryItem.tailwind?.config, targetConfig, {
    silent: options.silent,
  })
  await updateCssVars(registryItem.cssVars, targetConfig, {
    silent: options.silent,
  })
  await updateDependencies(registryItem.dependencies, targetConfig, {
    silent: options.silent,
  })
  await updateFiles(registryItem.files, targetConfig, {
    overwrite: options.overwrite,
    silent: options.silent,
  })
}
