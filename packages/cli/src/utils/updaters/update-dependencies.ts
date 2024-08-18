import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { execa } from "execa"

export async function updateDependencies(
  dependencies: string[],
  config: Config
) {
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )
}
