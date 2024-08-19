import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { RegistryItem } from "@/src/utils/registry/schema"
import { execa } from "execa"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config
) {
  if (!dependencies) {
    return
  }

  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )
}
