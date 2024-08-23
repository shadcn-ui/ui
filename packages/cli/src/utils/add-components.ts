import { type Config } from "@/src/utils/get-config"
import { logger } from "@/src/utils/logger"
import { registryResolveItemsTree } from "@/src/utils/registry"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateFiles } from "@/src/utils/updaters/update-files"
import { updateTailwindConfig } from "@/src/utils/updaters/update-tailwind-config"
import { updateTailwindCss } from "@/src/utils/updaters/update-tailwind-css"
import ora from "ora"

export async function addComponents(
  components: string[],
  config: Config,
  options: { overwrite?: boolean }
) {
  options = {
    overwrite: false,
    ...options,
  }

  const initializersSpinner = ora(`Initializing project.`)?.start()
  const tree = await registryResolveItemsTree(components, config)

  if (!tree) {
    initializersSpinner?.fail()
    logger.error(`Something went wrong during the initialization process.`)
    process.exit(1)
  }

  await updateTailwindConfig(tree.tailwind?.config, config)
  await updateTailwindCss(tree.cssVars, config)
  initializersSpinner?.succeed()

  const dependenciesSpinner = ora(`Installing dependencies.`)?.start()
  await updateDependencies(tree.dependencies, config)
  dependenciesSpinner?.succeed()

  const filesSpinner = ora(`Writing files.`)?.start()
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
  })
  filesSpinner?.succeed()
}
