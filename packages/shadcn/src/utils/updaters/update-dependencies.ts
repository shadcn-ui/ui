import { SHADCN_URL } from "@/src/registry/constants"
import { RegistryItem } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import prompts from "prompts"

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  devDependencies: RegistryItem["devDependencies"],
  config: Config,
  options: {
    silent?: boolean
  }
) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd, false)
  const packageManager = await getUpdateDependenciesPackageManager(config)

  // Expo resolves its own SDK-compatible versions via `expo install`, so for
  // Expo projects we still dedupe requests but must not skip already declared
  // dependencies — otherwise we'd block intentional version alignment.
  const skipInstalled = packageManager !== "expo"
  dependencies = normalizeDependencyRequests(dependencies, packageInfo, {
    skipInstalled,
  })
  devDependencies = normalizeDependencyRequests(devDependencies, packageInfo, {
    skipInstalled,
  })

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

/**
 * The registry hands us bare package names (e.g. "recharts"). Forwarding a bare
 * name to `pnpm add` / `npm install` re-resolves it to the current `latest` and
 * overwrites whatever specifier is already declared in package.json. Re-running
 * `shadcn add` therefore silently rewrites existing dependency ranges (#10525).
 *
 * To keep the operation idempotent we drop bare requests for packages that are
 * already declared, while still installing explicit specs (e.g. "recharts@3.8.0")
 * so a registry item can intentionally pin a version. Within a single request we
 * also dedupe by package name, preferring the explicit spec over a bare one.
 */
function normalizeDependencyRequests(
  dependencies: RegistryItem["dependencies"] = [],
  packageInfo: ReturnType<typeof getPackageInfo>,
  { skipInstalled = true }: { skipInstalled?: boolean } = {}
) {
  const installedDependencies = new Set([
    ...Object.keys(packageInfo?.dependencies ?? {}),
    ...Object.keys(packageInfo?.devDependencies ?? {}),
    ...Object.keys(packageInfo?.optionalDependencies ?? {}),
    ...Object.keys(packageInfo?.peerDependencies ?? {}),
  ])

  const installRequests = new Map<
    string,
    { dependency: string; hasSpecifier: boolean }
  >()

  for (const dependency of dependencies) {
    const packageRequest = parsePackageRequest(dependency)

    // Protocol/alias specs (file:, workspace:, git+https:, npm:, etc.) are kept
    // as-is since we cannot reliably reason about their declared version.
    if (!packageRequest) {
      installRequests.set(dependency, { dependency, hasSpecifier: true })
      continue
    }

    // Bare name that is already declared in package.json -> skip so we never
    // rewrite the existing specifier (this is the #10525 fix).
    if (
      skipInstalled &&
      !packageRequest.hasSpecifier &&
      installedDependencies.has(packageRequest.name)
    ) {
      continue
    }

    const existing = installRequests.get(packageRequest.name)
    if (!existing || (!existing.hasSpecifier && packageRequest.hasSpecifier)) {
      installRequests.set(packageRequest.name, {
        dependency,
        hasSpecifier: packageRequest.hasSpecifier,
      })
    }
  }

  return Array.from(installRequests.values()).map(
    ({ dependency }) => dependency
  )
}

function parsePackageRequest(dependency: string) {
  // Protocol-prefixed specs: file:, workspace:, link:, git+https:, npm:, etc.
  if (/^[a-z][a-z0-9+.-]*:/i.test(dependency)) {
    return null
  }

  const match = dependency.startsWith("@")
    ? dependency.match(/^(@[^/]+\/[^@/]+)(@.+)?$/)
    : dependency.match(/^([^@/]+)(@.+)?$/)

  if (!match) {
    return null
  }

  return {
    name: match[1],
    hasSpecifier: Boolean(match[2]),
  }
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
