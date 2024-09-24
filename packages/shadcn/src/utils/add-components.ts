import { type Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { registryResolveItemsTree } from "@/src/utils/registry"
import { spinner } from "@/src/utils/spinner"
import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateFiles } from "@/src/utils/updaters/update-files"
import { updateTailwindConfig } from "@/src/utils/updaters/update-tailwind-config"

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
    registryName?: string
  }
) {
  options = {
    overwrite: false,
    silent: false,
    isNewProject: false,
    ...options,
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
    registryName: options.registryName,
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
