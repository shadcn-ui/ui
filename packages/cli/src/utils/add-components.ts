import { type Config } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
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

  const registrySpinner = ora(`Checking registry.`)?.start()
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()

  await updateTailwindConfig(tree.tailwind?.config, config)
  await updateTailwindCss(tree.cssVars, config)

  await updateDependencies(tree.dependencies, config)
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
  })
}
