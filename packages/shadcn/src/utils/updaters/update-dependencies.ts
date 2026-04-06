import { SHADCN_URL } from "@/src/registry/constants"
import { RegistryItem } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { x } from "tinyexec"
import prompts from "prompts"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  devDependencies: RegistryItem["devDependencies"],
  config: Config,
  options: {
    silent?: boolean
  }
) {
  dependencies = Array.from(new Set(dependencies))
  devDependencies = Array.from(new Set(devDependencies))

  if (!dependencies?.length && !devDependencies?.length) {
    return
  }

  options = {
    silent: false,
    ...options,
  }

  const dependenciesSpinner = spinner(`Installing dependencies.`, {
    silent: options.silent,
  })?.start()
  const packageManager = await getUpdateDependenciesPackageManager(config)

  // Offer to use --force or --legacy-peer-deps if using React 19 with npm.
  let flag = ""
  if (shouldPromptForNpmFlag(config) && packageManager === "npm") {
    if (options.silent) {
      flag = "force"
    } else {
      dependenciesSpinner.stopAndPersist()
      logger.warn(
        `\nIt looks like you are using React 19. \nSome packages may fail to install due to peer dependency issues in npm (see ${SHADCN_URL}/react-19).\n`
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
  }

  dependenciesSpinner?.start()

  await installWithPackageManager(
    packageManager,
    dependencies,
    devDependencies,
    config.resolvedPaths.cwd,
    flag
  )

  dependenciesSpinner?.succeed()
}

function shouldPromptForNpmFlag(config: Config) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd, false)

  if (!packageInfo?.dependencies?.react) {
    return false
  }

  const hasReact19 = /^(?:\^|~)?19(?:\.\d+)*(?:-.*)?$/.test(
    packageInfo.dependencies.react
  )
  const hasReactDayPicker8 =
    packageInfo.dependencies["react-day-picker"]?.startsWith("8")

  return hasReact19 && hasReactDayPicker8
}

async function getUpdateDependenciesPackageManager(config: Config) {
  const expoVersion = getPackageInfo(config.resolvedPaths.cwd, false)
    ?.dependencies?.expo

  if (expoVersion) {
    // Ensures package versions match the React Native version.
    // https://docs.expo.dev/more/expo-cli/#install
    return "expo"
  }

  return getPackageManager(config.resolvedPaths.cwd)
}

async function installWithPackageManager(
  packageManager: Awaited<
    ReturnType<typeof getUpdateDependenciesPackageManager>
  >,
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
  flag?: string
) {
  if (packageManager === "npm") {
    return installWithNpm(dependencies, devDependencies, cwd, flag)
  }

  if (packageManager === "deno") {
    return installWithDeno(dependencies, devDependencies, cwd)
  }

  if (packageManager === "expo") {
    return installWithExpo(dependencies, devDependencies, cwd)
  }

  if (dependencies?.length) {
    await x(packageManager, ["add", ...dependencies], {
      nodeOptions: {
        cwd,
      },
      throwOnError: true,
    })
  }

  if (devDependencies?.length) {
    await x(packageManager, ["add", "-D", ...devDependencies], {
      nodeOptions: {
        cwd,
      },
      throwOnError: true,
    })
  }
}

async function installWithNpm(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
  flag?: string
) {
  if (dependencies.length) {
    await x(
      "npm",
      ["install", ...(flag ? [`--${flag}`] : []), ...dependencies],
      {
        nodeOptions: {
          cwd,
        },
        throwOnError: true,
      }
    )
  }

  if (devDependencies.length) {
    await x(
      "npm",
      ["install", ...(flag ? [`--${flag}`] : []), "-D", ...devDependencies],
      {
        nodeOptions: {
          cwd,
        },
        throwOnError: true,
      }
    )
  }
}

async function installWithDeno(
  dependencies: string[],
  devDependencies: string[],
  cwd: string
) {
  if (dependencies?.length) {
    await x("deno", ["add", ...dependencies.map((dep) => `npm:${dep}`)], {
      nodeOptions: {
        cwd,
      },
      throwOnError: true,
    })
  }

  if (devDependencies?.length) {
    await x(
      "deno",
      ["add", "-D", ...devDependencies.map((dep) => `npm:${dep}`)],
      {
        nodeOptions: {
          cwd,
        },
        throwOnError: true,
      }
    )
  }
}

async function installWithExpo(
  dependencies: string[],
  devDependencies: string[],
  cwd: string
) {
  if (dependencies.length) {
    await x("npx", ["expo", "install", ...dependencies], {
      nodeOptions: {
        cwd,
      },
      throwOnError: true,
    })
  }

  if (devDependencies.length) {
    await x("npx", ["expo", "install", "-- -D", ...devDependencies], {
      nodeOptions: {
        cwd,
      },
      throwOnError: true,
    })
  }
}
