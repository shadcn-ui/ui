import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { resolveRegistryTree } from "@/src/registry/resolver"
import {
  configSchema,
  registryItemFileSchema,
  registryItemSchema,
  workspaceConfigSchema,
} from "@/src/schema"
import {
  findCommonRoot,
  findPackageRoot,
  getWorkspaceConfig,
  type Config,
} from "@/src/utils/get-config"
import { getProjectTailwindVersionFromConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { isSafeTarget } from "@/src/utils/is-safe-target"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateCss } from "@/src/utils/updaters/update-css"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateEnvVars } from "@/src/utils/updaters/update-env-vars"
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
    baseStyle?: boolean
    registryHeaders?: Record<string, Record<string, string>>
    path?: string
  }
) {
  options = {
    overwrite: false,
    silent: false,
    isNewProject: false,
    baseStyle: true,
    ...options,
  }

  const workspaceConfig = await getWorkspaceConfig(config)
  if (
    workspaceConfig &&
    workspaceConfig.ui &&
    workspaceConfig.ui.resolvedPaths.cwd !== config.resolvedPaths.cwd
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
    baseStyle?: boolean
    path?: string
  }
) {
  if (!options.baseStyle && !components.length) {
    return
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()
  const tree = await resolveRegistryTree(components, configWithDefaults(config))

  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }

  try {
    validateFilesTarget(tree.files ?? [], config.resolvedPaths.cwd)
  } catch (error) {
    registrySpinner?.fail()
    return handleError(error)
  }

  registrySpinner?.succeed()

  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)

  await updateTailwindConfig(tree.tailwind?.config, config, {
    silent: options.silent,
    tailwindVersion,
  })

  const overwriteCssVars = await shouldOverwriteCssVars(components, config)
  await updateCssVars(tree.cssVars, config, {
    cleanupDefaultNextStyles: options.isNewProject,
    silent: options.silent,
    tailwindVersion,
    tailwindConfig: tree.tailwind?.config,
    overwriteCssVars,
    initIndex: options.baseStyle,
  })

  // Add CSS updater
  await updateCss(tree.css, config, {
    silent: options.silent,
  })

  await updateEnvVars(tree.envVars, config, {
    silent: options.silent,
  })

  await updateDependencies(tree.dependencies, tree.devDependencies, config, {
    silent: options.silent,
  })
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    silent: options.silent,
    path: options.path,
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
    baseStyle?: boolean
    path?: string
  }
) {
  if (!options.baseStyle && !components.length) {
    return
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()
  const tree = await resolveRegistryTree(components, configWithDefaults(config))

  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }

  try {
    validateFilesTarget(tree.files ?? [], config.resolvedPaths.cwd)
  } catch (error) {
    registrySpinner?.fail()
    return handleError(error)
  }

  registrySpinner?.succeed()

  const filesCreated: string[] = []
  const filesUpdated: string[] = []
  const filesSkipped: string[] = []

  const rootSpinner = spinner(`Installing components.`)?.start()

  // Process global updates (tailwind, css vars, dependencies) first for the main target.
  // These should typically go to the UI package in a workspace.
  const mainTargetConfig = workspaceConfig.ui
  const tailwindVersion = await getProjectTailwindVersionFromConfig(
    mainTargetConfig
  )
  const workspaceRoot = findCommonRoot(
    config.resolvedPaths.cwd,
    mainTargetConfig.resolvedPaths.ui
  )

  // 1. Update tailwind config.
  if (tree.tailwind?.config) {
    await updateTailwindConfig(tree.tailwind?.config, mainTargetConfig, {
      silent: true,
      tailwindVersion,
    })
    filesUpdated.push(
      path.relative(
        workspaceRoot,
        mainTargetConfig.resolvedPaths.tailwindConfig
      )
    )
  }

  // 2. Update css vars.
  if (tree.cssVars) {
    const overwriteCssVars = await shouldOverwriteCssVars(components, config)
    await updateCssVars(tree.cssVars, mainTargetConfig, {
      silent: true,
      tailwindVersion,
      tailwindConfig: tree.tailwind?.config,
      overwriteCssVars,
    })
    filesUpdated.push(
      path.relative(workspaceRoot, mainTargetConfig.resolvedPaths.tailwindCss)
    )
  }

  // 3. Update CSS
  if (tree.css) {
    await updateCss(tree.css, mainTargetConfig, {
      silent: true,
    })
    filesUpdated.push(
      path.relative(workspaceRoot, mainTargetConfig.resolvedPaths.tailwindCss)
    )
  }

  // 4. Update environment variables
  if (tree.envVars) {
    await updateEnvVars(tree.envVars, mainTargetConfig, {
      silent: true,
    })
  }

  // 5. Update dependencies.
  await updateDependencies(
    tree.dependencies,
    tree.devDependencies,
    mainTargetConfig,
    {
      silent: true,
    }
  )

  // 6. Group files by their type to determine target config and update files.
  const filesByType = new Map<string, typeof tree.files>()

  for (const file of tree.files ?? []) {
    const type = file.type || "registry:ui"
    if (!filesByType.has(type)) {
      filesByType.set(type, [])
    }
    filesByType.get(type)!.push(file)
  }

  // Process each type of component with its appropriate target config.
  for (const type of Array.from(filesByType.keys())) {
    const typeFiles = filesByType.get(type)!

    let targetConfig = type === "registry:ui" ? workspaceConfig.ui : config

    const typeWorkspaceRoot = findCommonRoot(
      config.resolvedPaths.cwd,
      targetConfig.resolvedPaths.ui || targetConfig.resolvedPaths.cwd
    )
    const packageRoot =
      (await findPackageRoot(
        typeWorkspaceRoot,
        targetConfig.resolvedPaths.cwd
      )) ?? targetConfig.resolvedPaths.cwd

    // Update files for this type.
    const files = await updateFiles(typeFiles, targetConfig, {
      overwrite: options.overwrite,
      silent: true,
      rootSpinner,
      isRemote: options.isRemote,
      isWorkspace: true,
      path: options.path,
    })

    filesCreated.push(
      ...files.filesCreated.map((file) =>
        path.relative(typeWorkspaceRoot, path.join(packageRoot, file))
      )
    )
    filesUpdated.push(
      ...files.filesUpdated.map((file) =>
        path.relative(typeWorkspaceRoot, path.join(packageRoot, file))
      )
    )
    filesSkipped.push(
      ...files.filesSkipped.map((file) =>
        path.relative(typeWorkspaceRoot, path.join(packageRoot, file))
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

  if (tree.docs) {
    logger.info(tree.docs)
  }
}

async function shouldOverwriteCssVars(
  components: z.infer<typeof registryItemSchema>["name"][],
  config: z.infer<typeof configSchema>
) {
  const result = await getRegistryItems(components, { config })
  const payload = z.array(registryItemSchema).parse(result)

  return payload.some(
    (component) =>
      component.type === "registry:theme" || component.type === "registry:style"
  )
}

function validateFilesTarget(
  files: z.infer<typeof registryItemFileSchema>[],
  cwd: string
) {
  for (const file of files) {
    if (!file?.target) {
      continue
    }

    if (!isSafeTarget(file.target, cwd)) {
      throw new Error(
        `We found an unsafe file path "${file.target} in the registry item. Installation aborted.`
      )
    }
  }
}
