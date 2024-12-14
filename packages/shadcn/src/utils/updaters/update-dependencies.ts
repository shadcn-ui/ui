import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { logger } from "@/src/utils/logger"
import {
  RegistryItem,
  registryResolvedItemsTreeSchema,
} from "@/src/utils/registry/schema"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import prompts from "prompts"
import { z } from "zod"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config,
  options: {
    silent?: boolean
    trackers?: z.infer<typeof registryResolvedItemsTreeSchema>["trackers"]
  }
) {
  dependencies = Array.from(new Set(dependencies))
  if (!dependencies?.length) {
    return
  }

  options = {
    silent: false,
    ...options,
  }

  const dependenciesSpinner = spinner(`Installing dependencies.`, {
    silent: options.silent,
  })?.start()
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  // Offer to use --force or --legacy-peer-deps if using React 19 with npm.
  let flag = ""
  if (isUsingReact19(config) && packageManager === "npm") {
    dependenciesSpinner.stopAndPersist()
    logger.warn(
      "\nIt looks like you are using React 19. \nSome packages may fail to install due to peer dependency issues in npm (see https://ui.shadcn.com/react-19).\n"
    )
    const confirmation = await prompts([
      {
        type: "select",
        name: "flag",
        message: "How would you like to proceed?",
        choices: [
          { title: "Use --force", value: "force" },
          { title: "Use --legacy-peer-deps", value: "legacy-peer-deps" },
        ],
      },
    ])

    if (confirmation) {
      flag = confirmation.flag
    }
  }

  dependenciesSpinner?.start()

  let uiDependencies: string[] = []
  let nonUiDependencies = dependencies
  if (options.trackers?.ui?.dependencies?.length) {
    // Split dependencies into ui and non-ui dependencies.
    uiDependencies = dependencies.filter((dependency) =>
      options.trackers?.ui?.dependencies?.includes(dependency)
    )
    nonUiDependencies = dependencies.filter(
      (dependency) => !options.trackers?.ui?.dependencies?.includes(dependency)
    )
  }

  // Install ui dependencies where ui resolves to.
  if (uiDependencies?.length) {
    await execa(
      packageManager,
      [
        packageManager === "npm" ? "install" : "add",
        ...(packageManager === "npm" && flag ? [`--${flag}`] : []),
        ...uiDependencies,
      ],
      {
        cwd: config.resolvedPaths.ui,
      }
    )
  }

  // Install non-ui dependencies where the project resolves to.
  if (nonUiDependencies?.length) {
    await execa(
      packageManager,
      [
        packageManager === "npm" ? "install" : "add",
        ...(packageManager === "npm" && flag ? [`--${flag}`] : []),
        ...nonUiDependencies,
      ],
      {
        cwd: config.resolvedPaths.cwd,
      }
    )
  }

  dependenciesSpinner?.succeed()
}

function isUsingReact19(config: Config) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd)

  if (!packageInfo?.dependencies?.react) {
    return false
  }

  return /^(?:\^|~)?19(?:\.\d+)*(?:-.*)?$/.test(packageInfo.dependencies.react)
}
