import { existsSync, promises as fs } from "fs"
import path from "path"
import { configWithDefaults } from "@/src/registry/config"
import { fetchRegistryItems } from "@/src/registry/resolver"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { isSafeTarget } from "@/src/utils/is-safe-target"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import {
  findCommonRoot,
  resolveFilePath,
} from "@/src/utils/updaters/update-files"

export async function removeComponents(
  components: string[],
  config: Config,
  options: {
    force?: boolean
    dryRun?: boolean
    silent?: boolean
  }
) {
  options = { force: false, dryRun: false, silent: false, ...options }

  const registrySpinner = spinner("Checking registry.", {
    silent: options.silent,
  })?.start()

  let items: Awaited<ReturnType<typeof fetchRegistryItems>>
  try {
    items = await fetchRegistryItems(components, configWithDefaults(config))
  } catch (error) {
    registrySpinner?.fail()
    logger.error(
      `Failed to fetch components from registry: ${(error as Error).message}`
    )
    process.exit(1)
  }

  if (!items.length) {
    registrySpinner?.fail()
    logger.error("Failed to fetch components from registry")
    process.exit(1)
  }

  registrySpinner?.succeed()

  for (const item of items) {
    for (const file of item.files ?? []) {
      if (
        file.target &&
        !isSafeTarget(file.target, config.resolvedPaths.cwd)
      ) {
        logger.error(
          `Unsafe file path "${file.target}" in registry item "${item.name}". Aborting`
        )
        process.exit(1)
      }
    }
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  const planned: { componentName: string; absolutePath: string }[] = []
  const plannedCountByComponent = new Map<string, number>()

  for (const item of items) {
    const allPaths = (item.files ?? []).map((f) => f.path)
    const filesWithContent = (item.files ?? []).filter((f) => !!f?.content)
    let count = 0

    for (let i = 0; i < filesWithContent.length; i++) {
      const file = filesWithContent[i]
      let resolved = resolveFilePath(file, config, {
        isSrcDir: projectInfo?.isSrcDir,
        framework: projectInfo?.framework.name,
        commonRoot: findCommonRoot(allPaths, file.path),
        fileIndex: i,
      })

      if (!resolved) {
        continue
      }

      if (!config.tsx) {
        resolved = resolved.replace(/\.tsx?$/, (match) =>
          match === ".tsx" ? ".jsx" : ".js"
        )
      }

      planned.push({ componentName: item.name, absolutePath: resolved })
      count++
    }

    plannedCountByComponent.set(item.name, count)
  }

  /**
   * 
   * I added critical files because some registry could include one of the critical files in its files, 
   * and it wouldn’t be good if the user accidentally removed them
   * 
   * UPD: I thought about it more, and maybe this check is unnecessary. 
   * If the responsibility is on the user, then they should verify what was removed themselves. 
   * Besides, there’s Git and the ability to restore changes
   * 
   * UPD 2: Although Git isn’t always that reliable, and 
   * it’s probably better to prevent the problem than deal with it afterward
   * 
   * */

  const criticalPaths = new Set(
    [
      config.resolvedPaths.utils,
      config.resolvedPaths.tailwindCss,
      config.resolvedPaths.tailwindConfig,
    ].filter(Boolean)
  )
  const critical = planned.filter((p) => criticalPaths.has(p.absolutePath))

  if (critical.length > 0 && !options.force) {
    logger.error(
      "The following files would be deleted but appear to be project infrastructure:"
    )
    for (const c of critical) {
      logger.error(
        `  - ${path.relative(config.resolvedPaths.cwd, c.absolutePath)}`
      )
    }
    logger.error("Run with -f, --force if you really want to delete them")
    process.exit(1)
  }

  const toDelete: string[] = []
  const missingByComponent = new Map<string, number>()

  for (const p of planned) {
    if (!existsSync(p.absolutePath)) {
      missingByComponent.set(
        p.componentName,
        (missingByComponent.get(p.componentName) ?? 0) + 1
      )
      continue
    }
    toDelete.push(p.absolutePath)
  }

  for (const [name, missing] of missingByComponent.entries()) {
    const total = plannedCountByComponent.get(name) ?? 0
    if (total > 0 && missing === total) {
      logger.warn(
        `No files found for ${highlighter.info(name)} at expected paths. ` +
        `They may have been installed with a custom --path. Skipping.`
      )
    }
  }

  if (options.dryRun) {
    if (!options.silent) {
      logger.info("Files that would be deleted:")
      for (const filePath of toDelete) {
        logger.log(`  - ${path.relative(config.resolvedPaths.cwd, filePath)}`)
      }
    }
    return
  }

  const deleted: string[] = []
  for (const filePath of toDelete) {
    try {
      await fs.unlink(filePath)
      deleted.push(filePath)
    } catch (error) {
      logger.error(`Failed to delete ${filePath}: ${(error as Error).message}`)
    }
  }

  if (!options.silent && deleted.length > 0) {
    spinner(
      `Deleted ${deleted.length} ${deleted.length === 1 ? "file" : "files"}:`,
      { silent: options.silent }
    )?.succeed()
    for (const filePath of deleted) {
      logger.log(`  - ${path.relative(config.resolvedPaths.cwd, filePath)}`)
    }
  }

  if (!options.silent) {
    const requested = new Set(items.map((item) => item.name))
    const registryDeps = new Set<string>()
    const npmDeps = new Set<string>()

    for (const item of items) {
      for (const dep of item.registryDependencies ?? []) {
        if (!requested.has(dep)) {
          registryDeps.add(dep)
        }
      }
      for (const dep of item.dependencies ?? []) {
        npmDeps.add(dep)
      }
    }

    if (registryDeps.size > 0) {
      const names = Array.from(registryDeps).sort()
      logger.break()
      logger.info(
        "The following registry components were installed as dependencies " +
        "they may still be used elsewhere in your project. Check before removing them:"
      )
      logger.log(`  ${names.join(", ")}`)
      logger.break()
      logger.log("To remove them too, run:")
      logger.log(`  shadcn remove ${names.join(" ")}`)
    }

    if (npmDeps.size > 0) {
      logger.break()
      logger.info(
        "The following npm packages may no longer be needed. Please review your package.json:"
      )
      logger.log(`  ${Array.from(npmDeps).sort().join(", ")}`)
    }
  }
}
