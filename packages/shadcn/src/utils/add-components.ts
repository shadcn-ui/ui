import path from "path"
import {
  configSchema,
  findCommonRoot,
  findPackageRoot,
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

  const workspaceConfig = await getWorkspaceConfig(config)
  if (
    workspaceConfig &&
    workspaceConfig?.ui.resolvedPaths.cwd !== config.resolvedPaths.cwd
  ) {
    return await addWorkspaceComponents(components, config, workspaceConfig, {
      ...options,
      isRemote:
        components?.length === 1 && !!components[0].match(/\/chat\/b\//),
    })
  }

  return await addProjectComponents(components, config, options)
}

async function addProjectComponents(
  components: string[],
  config: z.infer<typeof configSchema>,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
  }
) {
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

async function addWorkspaceComponents(
  components: string[],
  config: z.infer<typeof configSchema>,
  workspaceConfig: z.infer<typeof workspaceConfigSchema>,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
    isRemote?: boolean
  }
) {
  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()
  let registryItems = await resolveRegistryItems(components, config)
  let result = await fetchRegistry(registryItems)
  const payload = z.array(registryItemSchema).parse(result)
  if (!payload) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()

  const registryParentMap = getRegistryParentMap(payload)
  const registryTypeAliasMap = getRegistryTypeAliasMap()

  const filesCreated: string[] = []
  const filesUpdated: string[] = []
  const filesSkipped: string[] = []

  const rootSpinner = spinner(`Installing components.`)?.start()

  for (const component of payload) {
    const alias = registryTypeAliasMap.get(component.type)
    const registryParent = registryParentMap.get(component.name)

    // We don't support this type of component.
    if (!alias) {
      continue
    }

    // A good start is ui for now.
    // TODO: Add support for other types.
    let targetConfig =
      component.type === "registry:ui" || registryParent?.type === "registry:ui"
        ? workspaceConfig.ui
        : config

    const workspaceRoot = findCommonRoot(
      config.resolvedPaths.cwd,
      targetConfig.resolvedPaths.ui
    )
    const packageRoot =
      (await findPackageRoot(workspaceRoot, targetConfig.resolvedPaths.cwd)) ??
      targetConfig.resolvedPaths.cwd

    // 1. Update tailwind config.
    if (component.tailwind?.config) {
      await updateTailwindConfig(component.tailwind?.config, targetConfig, {
        silent: true,
      })
      filesUpdated.push(
        path.relative(workspaceRoot, targetConfig.resolvedPaths.tailwindConfig)
      )
    }

    // 2. Update css vars.
    if (component.cssVars) {
      await updateCssVars(component.cssVars, targetConfig, {
        silent: true,
      })
      filesUpdated.push(
        path.relative(workspaceRoot, targetConfig.resolvedPaths.tailwindCss)
      )
    }

    // 3. Update dependencies.
    await updateDependencies(component.dependencies, targetConfig, {
      silent: true,
    })

    // 4. Update files.
    const files = await updateFiles(component.files, targetConfig, {
      overwrite: options.overwrite,
      silent: true,
      rootSpinner,
      isRemote: options.isRemote,
    })

    filesCreated.push(
      ...files.filesCreated.map((file) =>
        path.relative(workspaceRoot, path.join(packageRoot, file))
      )
    )
    filesUpdated.push(
      ...files.filesUpdated.map((file) =>
        path.relative(workspaceRoot, path.join(packageRoot, file))
      )
    )
    filesSkipped.push(
      ...files.filesSkipped.map((file) =>
        path.relative(workspaceRoot, path.join(packageRoot, file))
      )
    )
  }

  rootSpinner?.succeed()

  // Sort files.
  filesCreated.sort()
  filesUpdated.sort()
  filesSkipped.sort()

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length
  if (!hasUpdatedFiles && !filesSkipped.length) {
    spinner(`No files updated.`, {
      silent: options.silent,
    })?.info()
  }

  if (filesCreated.length) {
    spinner(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? "file" : "files"
      }:`,
      {
        silent: options.silent,
      }
    )?.succeed()
    for (const file of filesCreated) {
      logger.log(`  - ${file}`)
    }
  }

  if (filesUpdated.length) {
    spinner(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`,
      {
        silent: options.silent,
      }
    )?.info()
    for (const file of filesUpdated) {
      logger.log(`  - ${file}`)
    }
  }

  if (filesSkipped.length) {
    spinner(
      `Skipped ${filesSkipped.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }: (use --overwrite to overwrite)`,
      {
        silent: options.silent,
      }
    )?.info()
    for (const file of filesSkipped) {
      logger.log(`  - ${file}`)
    }
  }
}
