import { Config } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { RegistryItem } from "@/src/utils/registry/schema"
import { execa } from "execa"
import ora from "ora"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config
) {
  dependencies = Array.from(new Set(dependencies))

  if (!dependencies?.length) {
    return
  }

  const dependenciesSpinner = ora(
    `Installing ${dependencies.map((d) => highlighter.info(d)).join(", ")}.`
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
