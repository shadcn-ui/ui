import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { RegistryItem } from "@/src/utils/registry/schema"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config,
  options: {
    silent?: boolean
    forceInstall?: boolean
  }
) {
  dependencies = Array.from(new Set(dependencies))
  if (!dependencies?.length) {
    return
  }

  options = {
    silent: false,
    forceInstall: false,
    ...options,
  }

  const dependenciesSpinner = spinner(`Installing dependencies.`, {
    silent: options.silent,
  })?.start()
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", 
      options.forceInstall ? "--force" : "",
      ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )
  dependenciesSpinner?.succeed()
}
