import { existsSync, promises as fs } from "fs"
import path from "path"
import { type Config } from "@/src/utils/get-config"
import { RegistryItem } from "@/src/utils/registry/schema"
import { spinner } from "@/src/utils/spinner"

export async function updateComponentJson(
  files: RegistryItem["files"],
  config: Config,
  options: {
    silent?: boolean
  },
  caller: "add" | "remove" = "add"
) {
  if (!files) {
    process.exit(1)
  }
  const updateSpinner = spinner(`Updating components.json.`, {
    silent: options.silent,
  })?.start()
  const { resolvedPaths, ...cleanedConfig } = config
  let { components, hooks, lib, ui } = config.installed

  // convert each to set
  const componentSet = new Set(components)
  const hooksSet = new Set(hooks)
  const libSet = new Set(lib)
  const uiSet = new Set(ui)

  files.forEach(async (file) => {
    // remove extension
    const fileName = getFileNameWithoutExtension(file.path)
    switch (file.type) {
      case "registry:ui":
        caller === "add" ? uiSet?.add(fileName) : uiSet?.delete(fileName)
        break
      case "registry:hook":
        caller === "add" ? hooksSet?.add(fileName) : hooksSet?.delete(fileName)
        break
      case "registry:lib":
        caller === "add" ? libSet?.add(fileName) : libSet?.delete(fileName)
        break
      default:
        caller === "add"
          ? componentSet?.add(fileName)
          : componentSet?.delete(fileName)
        break
    }
  })

  // convert back to array

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

// Helper function to get file name without extension
function getFileNameWithoutExtension(filePath: string): string {
  return path.basename(filePath, path.extname(filePath))
}

export async function resetComponentsJson(
  config: Config,
  options: { silent?: boolean },
  reset?: boolean
) {
  const updateSpinner = spinner(`Updating components.json.`, {
    silent: options.silent,
  })?.start()

  try {
    // Helper function to check if path is a file
    const isFile = async (dir: string, file: string) => {
      const filePath = path.join(dir, file)
      const stats = await fs.stat(filePath)
      return stats.isFile()
    }

    // Helper function to process files/directories in a folder
    const processDirectory = async (dirPath: string) => {
      const processedEntries = []

      if (existsSync(dirPath)) {
        const entries = await fs.readdir(dirPath)

        for (const entry of entries) {
          if (await isFile(dirPath, entry)) {
            // If it's a file, remove the extension
            processedEntries.push(getFileNameWithoutExtension(entry))
          }
        }
        // Directories are skipped, so they won't be added to the result
      }

      return processedEntries
    }

    // Process directories concurrently and remove extensions for files
    const [cleanedComponents, cleanedHooks, cleanedLib, cleanedUi] =
      await Promise.all([
        processDirectory(config.resolvedPaths.components),
        processDirectory(config.resolvedPaths.hooks),
        processDirectory(config.resolvedPaths.lib),
        processDirectory(config.resolvedPaths.ui),
      ])

    // Cleaned config with updated components
    const { resolvedPaths, ...cleanedConfig } = config
    cleanedConfig.installed = {
      components: cleanedComponents,
      hooks: cleanedHooks,
      lib: cleanedLib,
      ui: cleanedUi,
    }

    // Write the updated config to components.json
    const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")
    await fs.writeFile(
      targetPath,
      JSON.stringify(cleanedConfig, null, 2),
      "utf8"
    )

    // Update the config object with resolved paths and return it
    config = { ...cleanedConfig, resolvedPaths }
    updateSpinner.succeed()

    return config
  } catch (error: any) {
    updateSpinner.fail(`Failed to reset components.json: ${error.message}`)
    throw error
  }
}
