import { promises as fs, rmSync } from "fs"
import path from "path"
import { type Config } from "@/src/utils/get-config"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"

export async function removeComponentsSafely(
  components: string[],
  config: Config,
  silent: boolean
) {
  const filesDeletedSpinner = spinner(`removing files.`, {
    silent,
  })?.start()
  const filesDeleted: string[] = []
  const filesFailed: string[] = []
  let { components: Component, hooks, lib, ui } = config.installed
  // convert each to set
  const componentSet = new Set(Component)
  const hooksSet = new Set(hooks)
  const libSet = new Set(lib)
  const uiSet = new Set(ui)

  const cwd = config.resolvedPaths.cwd
  let target: string = ""
  components.forEach(async (component) => {
    let file = component + (config.tsx ? ".tsx" : "jsx")
    let relativePath = ""
    let filePath = ""
    // check where is file located
    if (componentSet?.has(component)) {
      target = config.resolvedPaths.components
      componentSet.delete(component)
      filePath = path.join(target, file)
      relativePath = path.relative(cwd, filePath)
    } else if (uiSet?.has(component)) {
      target = config.resolvedPaths.ui
      uiSet.delete(component)
      filePath = path.join(target, file)
      relativePath = path.relative(cwd, filePath)
    } else if (libSet?.has(component)) {
      file = component + (config.tsx ? ".ts" : "js")
      target = config.resolvedPaths.lib
      libSet.delete(component)
      filePath = path.join(target, file)
      relativePath = path.relative(cwd, filePath)
    } else if (hooksSet?.has(component)) {
      target = config.resolvedPaths.hooks
      hooksSet.delete(component)
      filePath = path.join(target, file)
      relativePath = path.relative(cwd, filePath)
    } else {
      filePath = path.join(target, file)
      relativePath = path.relative(cwd, filePath)
      filesFailed.push(relativePath)
      return
    }
    filePath = path.join(target, file)
    relativePath = path.relative(cwd, filePath)
    const success = removeFile(file, target)
    if (success) {
      filesDeleted.push(relativePath)
      return
    }
    filesFailed.push(relativePath)
    return
  })

  filesDeletedSpinner.succeed()
  if (filesFailed.length) {
    spinner(
      `failed to delete ${filesFailed.length} ${
        filesFailed.length === 1 ? "file" : "files"
      }:`
    )?.fail()
    if (!silent) {
      for (const file of filesFailed) {
        logger.log(`  - ${file}`)
      }
    }
  }
  spinner(
    `deleted ${filesDeleted.length} ${
      filesDeleted.length === 1 ? "file" : "files"
    }:`
  )?.succeed()
  if (!silent) {
    for (const file of filesDeleted) {
      logger.log(`  - ${file}`)
    }
  }

  // convert back to array

  const updateSpinner = spinner(`Updating components.json.`, {
    silent: silent,
  })?.start()
  const { resolvedPaths, ...cleanedConfig } = config

  cleanedConfig.installed = {
    components: Array.from(componentSet),
    ui: Array.from(uiSet),
    lib: Array.from(libSet),
    hooks: Array.from(hooksSet),
  }
  // Write the updated config to components.json

  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(cleanedConfig, null, 2), "utf8")
  updateSpinner.succeed()
}

function removeFile(fileName: string, resolvedPath: string): boolean {
  try {
    let filePath = path.join(resolvedPath, fileName)
    rmSync(filePath)
    return true
  } catch (error: any) {
    logger.info(error.message)
    return false
  }
}
