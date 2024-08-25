import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { RegistryItem } from "@/src/utils/registry/schema"
import { execa } from "execa"
import { cyan } from "kleur/colors"
import ora from "ora"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config
) {
  if (!dependencies) {
    return
  }

  const dependenciesSpinner = ora(
    `Installing ${dependencies.map((d) => cyan(d)).join(", ")}.`
  )?.start()
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )
  dependenciesSpinner?.succeed()
}
