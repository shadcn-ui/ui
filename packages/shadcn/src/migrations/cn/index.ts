import { promises as fs } from "fs"
import path from "path"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import {
  installDependencies,
  removeDependencies,
} from "@/src/utils/updaters/update-dependencies"
import fsExtra from "fs-extra"
import prompts from "prompts"

import { resolveMigrationFiles } from "./files"
import { createCnTransformer } from "./transform"
import { OLD_PACKAGES, type CnMigrationIssue, type OldPackage } from "./types"

export { transformCnSource } from "./transform"
export type { CnMigrationIssue, CnSourceTransformResult } from "./types"

export async function migrateCn(options: {
  cwd: string
  path?: string
  yes?: boolean
}) {
  if (!fsExtra.existsSync(path.resolve(options.cwd, "package.json"))) {
    throw new Error(
      "No `package.json` file found. Ensure you are at the root of your project."
    )
  }

  const files = await resolveMigrationFiles(options.cwd, options.path)
  const contents = await Promise.all(
    files.map((file) => fs.readFile(file, "utf-8"))
  )
  const transform = createCnTransformer()
  const results = files.map((file, index) => {
    const content = contents[index]
    return { file, content, result: transform(content, file) }
  })

  const changedFiles = results.filter(
    ({ content, result }) => content !== result.content
  )
  const unsupported = results.flatMap(({ file, result }) =>
    result.unsupported.map((issue) => ({ ...issue, file }))
  )
  const migratedPackages = new Set(
    results.flatMap(({ result }) => result.migratedPackages)
  )

  if (!changedFiles.length) {
    logger.info("No supported clsx, tailwind-merge or cnfast usage found.")
    printUnsupportedIssues(unsupported, options.cwd)
    return
  }

  assertTailwindCompatibility(options.cwd, migratedPackages)

  if (!options.yes) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      initial: true,
      message: `We will migrate ${highlighter.info(
        changedFiles.length
      )} file(s) to ${highlighter.info("cn")}${
        unsupported.length
          ? ` and leave ${highlighter.warn(
              unsupported.length
            )} item(s) for manual review`
          : ""
      }. Continue?`,
    })

    if (!confirm) {
      logger.info("Migration cancelled.")
      return
    }
  }

  const migrationSpinner = spinner("Migrating to cn...")?.start()
  await installDependencies(options.cwd, ["cn"])

  for (const { file, result } of changedFiles) {
    await fs.writeFile(file, result.content)
  }

  migrationSpinner?.succeed(
    `Migrated ${changedFiles.length} file${changedFiles.length === 1 ? "" : "s"}.`
  )

  const retainedPackages = new Set(
    results.flatMap(({ result }) => result.remainingPackages)
  )
  const removablePackages = options.path
    ? []
    : OLD_PACKAGES.filter(
        (packageName) =>
          migratedPackages.has(packageName) &&
          !retainedPackages.has(packageName)
      )

  if (removablePackages.length) {
    try {
      await removeDependencies(options.cwd, removablePackages)
    } catch {
      logger.warn(
        `Could not remove ${removablePackages.join(
          ", "
        )}. Remove them manually after reviewing the migration.`
      )
    }
  }

  if (options.path) {
    logger.info(
      "Kept clsx, tailwind-merge and cnfast dependencies because this was a scoped migration."
    )
  }

  printUnsupportedIssues(unsupported, options.cwd)
}

function assertTailwindCompatibility(
  cwd: string,
  migratedPackages: Set<OldPackage>
) {
  if (!migratedPackages.has("tailwind-merge")) {
    return
  }

  const packageInfo = getPackageInfo(cwd, false)
  const tailwindVersion = findDependencyVersion(packageInfo, "tailwindcss")
  const tailwindMergeVersion = findDependencyVersion(
    packageInfo,
    "tailwind-merge"
  )

  if (
    (getDeclaredMajor(tailwindVersion) ?? 4) < 4 ||
    (getDeclaredMajor(tailwindMergeVersion) ?? 3) < 3
  ) {
    throw new Error(
      "The cn migration requires Tailwind CSS v4 and tailwind-merge v3. Tailwind CSS v3 projects should continue using tailwind-merge v2."
    )
  }
}

function findDependencyVersion(
  packageInfo: ReturnType<typeof getPackageInfo>,
  packageName: string
) {
  return (
    packageInfo?.dependencies?.[packageName] ??
    packageInfo?.devDependencies?.[packageName] ??
    packageInfo?.optionalDependencies?.[packageName] ??
    packageInfo?.peerDependencies?.[packageName]
  )
}

function getDeclaredMajor(version?: string) {
  if (!version || /^(?:workspace|file|link|git|https?):/i.test(version)) {
    return null
  }

  const match = version.match(/(?:^|[^0-9])(\d+)(?:\.|$)/)
  return match ? Number(match[1]) : null
}

function printUnsupportedIssues(issues: CnMigrationIssue[], cwd: string) {
  if (!issues.length) {
    return
  }

  logger.break()
  logger.warn(
    `Manual review required for ${issues.length} item${
      issues.length === 1 ? "" : "s"
    }:`
  )
  for (const issue of issues) {
    const file = issue.file ? path.relative(cwd, issue.file) : "unknown file"
    const symbol = issue.symbol ? ` (${issue.symbol})` : ""
    logger.warn(`  - ${file}${symbol}: ${issue.reason}`)
  }
}
