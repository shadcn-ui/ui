import { type Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { registryResolveItemsTree } from "@/src/utils/registry"
import { spinner } from "@/src/utils/spinner"
import { updateComponentJson } from "@/src/utils/updaters/update-component-json"
// import { updateCssVars } from "@/src/utils/updaters/update-css-vars"
import { removeDependencies } from "@/src/utils/updaters/update-dependencies"
import { removeFiles } from "@/src/utils/updaters/update-files"

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

  //TODO:create endpoint to return just required feilds
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()
  // To Do Write removeCssVars function
  // await updateCssVars(tree.cssVars, config, {
  //   cleanupDefaultNextStyles: options.isNewProject,
  //   silent: options.silent,
  // })

  await removeDependencies(tree.dependencies, config, {
    silent: options.silent,
  })
  await removeFiles(tree.files, config, {
    silent: options.silent,
  })
  await updateComponentJson(components, config, "remove")
  if (tree.docs) {
    logger.info(tree.docs)
  }
}
