import path from "path"
import { type Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  getRegistryItemFileTargetPath,
  registryResolveItemsTree,
} from "@/src/utils/registry"
import { spinner } from "@/src/utils/spinner"
import { updateComponentJson } from "@/src/utils/updaters/update-component-json"
// import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { removeDependencies } from "@/src/utils/updaters/update-dependencies"
import {
  removeFiles,
  resolveTargetDir,
} from "@/src/utils/updaters/update-files"
import prompts from "prompts"
import { z } from "zod"

import { getProjectInfo } from "./get-project-info"
import { registryResolvedItemsTreeSchema } from "./registry/schema"

export async function removeComponents(
  components: string[],
  config: Config,
  options: {
    silent?: boolean
    isNewProject?: boolean
    recursive?: boolean
  }
) {
  options = {
    silent: false,
    isNewProject: false,
    ...options,
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()

  //TODO:create endpoint to return just required feilds instead of this
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()
  await confirmRemoval(tree, config)
  // TODO:Write removeTailwindConfig function

  // TODO:Write removeCssVars function

  await removeDependencies(tree.dependencies, config, {
    silent: options.silent,
  })
  await removeFiles(tree.files, config, {
    silent: options.silent,
  })
  await updateComponentJson(tree.files, config, options, "remove")
  if (tree.docs) {
    logger.info(tree.docs)
  }
}

async function confirmRemoval(
  tree: z.infer<typeof registryResolvedItemsTreeSchema>,
  config: Config
) {
  if (tree.files?.length) {
    logger.log("files :")
    const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

    for (const file of tree.files) {
      const fileName = path.basename(file.path)

      let targetDir = getRegistryItemFileTargetPath(file, config)
      let filePath = path.join(targetDir, fileName)
      if (file.target) {
        filePath = resolveTargetDir(projectInfo, config, file.target)
        targetDir = path.dirname(filePath)
      }
      const relativePath = path.relative(config.resolvedPaths.cwd, filePath)
      logger.log(`  - ${relativePath}`)
    }
  }
  if (tree.dependencies?.length) {
    logger.log("dependecies :")
    for (const dependency of tree.dependencies) {
      logger.log(`  - ${dependency}`)
    }
  }

  if (tree.devDependencies?.length) {
    logger.log("Dev dependecies :")
    for (const dependency of tree.devDependencies) {
      logger.log(`  - ${dependency}`)
    }
  }

  const { proceed } = await prompts({
    type: "confirm",
    name: "proceed",
    message: "are you sure you want to remove above ?",
    initial: true,
  })

  if (!proceed) {
    logger.info("exiting...")
    logger.break()
    process.exit(1)
  }
}
