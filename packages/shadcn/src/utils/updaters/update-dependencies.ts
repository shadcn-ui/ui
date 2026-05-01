import { SHADCN_URL } from "@/src/registry/constants"
import { RegistryItem } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import prompts from "prompts"

/**
 * Extracts the package name from a dependency specifier string.
 *
 * Handles both regular and scoped packages:
 *   "recharts@3.8.0"       → "recharts"
 *   "@base-ui/react@^1.4.1" → "@base-ui/react"
 *   "class-variance-authority" → "class-variance-authority"
 *   "@base-ui/react"        → "@base-ui/react"
 */
function getPackageName(dep: string): string {
  if (dep.startsWith("@")) {
    // Scoped package: "@scope/name@version" — split on the "@" after the scope.
    const secondAt = dep.indexOf("@", 1)
    return secondAt === -1 ? dep : dep.slice(0, secondAt)
  }
  // Regular package: "name@version" — split on the first "@".
  const atIndex = dep.indexOf("@")
  return atIndex === -1 ? dep : dep.slice(0, atIndex)
}

/**
 * Deduplicates a dependency list by package name.
 *
 * When the same package appears both with and without a version specifier
 * (e.g. "recharts" and "recharts@3.8.0"), keeping both corrupts package.json
 * because the package manager may apply the wrong specifier to the wrong
 * package on subsequent installs. We resolve conflicts by preferring the
 * entry that carries an explicit version over a bare package name.
 */
function deduplicateDependencies(deps: string[]): string[] {
  const seen = new Map<string, string>()
  for (const dep of deps) {
    const name = getPackageName(dep)
    const existing = seen.get(name)
    if (!existing) {
      seen.set(name, dep)
    } else {
      // Prefer the specifier that includes an explicit version.
      const existingHasVersion = existing !== name
      const depHasVersion = dep !== name
      if (!existingHasVersion && depHasVersion) {
        seen.set(name, dep)
      }
    }
  }
  return Array.from(seen.values())
}

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  devDependencies: RegistryItem["devDependencies"],
  config: Config,
  options: {
    silent?: boolean
  }
) {
  dependencies = deduplicateDependencies(Array.from(new Set(dependencies)))
  devDependencies = deduplicateDependencies(Array.from(new Set(devDependencies)))

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
    await execa(packageManager, ["add", ...dependencies], {
      cwd,
    })
  }

  if (devDependencies?.length) {
    await execa(packageManager, ["add", "-D", ...devDependencies], { cwd })
  }
}

async function installWithNpm(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
  flag?: string
) {
  if (dependencies.length) {
    await execa(
      "npm",
      ["install", ...(flag ? [`--${flag}`] : []), ...dependencies],
      { cwd }
    )
  }

  if (devDependencies.length) {
    await execa(
      "npm",
      ["install", ...(flag ? [`--${flag}`] : []), "-D", ...devDependencies],
      { cwd }
    )
  }
}

async function installWithDeno(
  dependencies: string[],
  devDependencies: string[],
  cwd: string
) {
  if (dependencies?.length) {
    await execa("deno", ["add", ...dependencies.map((dep) => `npm:${dep}`)], {
      cwd,
    })
  }

  if (devDependencies?.length) {
    await execa(
      "deno",
      ["add", "-D", ...devDependencies.map((dep) => `npm:${dep}`)],
      { cwd }
    )
  }
}

async function installWithExpo(
  dependencies: string[],
  devDependencies: string[],
  cwd: string
) {
  if (dependencies.length) {
    await execa("npx", ["expo", "install", ...dependencies], { cwd })
  }

  if (devDependencies.length) {
    await execa("npx", ["expo", "install", "-- -D", ...devDependencies], {
      cwd,
    })
  }
}
