import { promises as fs } from "fs"
import path from "path"
import { type Config } from "@/src/utils/get-config"
import { spinner } from "@/src/utils/spinner"

export async function updateComponentJson(
  components: string[],
  config: Config,
  options: {
    silent?: boolean
  },
  caller: "add" | "remove" = "add"
) {
  if (components.includes("index")) {
    return
  }
  const updateSpinner = spinner(`Updating components.json.`, {
    silent: options.silent,
  })?.start()
  const { resolvedPaths, ...cleanedConfig } = config

  cleanedConfig.components = cleanedConfig.components || []

  const componentSet = new Set(cleanedConfig.components)
  if (caller === "remove") {
    components.forEach((component) => componentSet.delete(component))
  } else {
    components.forEach((component) => componentSet.add(component))
  }

  cleanedConfig.components = Array.from(componentSet)

  // Write the updated config to components.json
  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(cleanedConfig, null, 2), "utf8")
  updateSpinner.succeed()
}

export async function resetComponentsJson(
  config: Config,
  options: {
    silent?: boolean
  },
  reset?: boolean
) {
  const updateSpinner = spinner(`Updating components.json.`, {
    silent: options.silent,
  })?.start()
  const { resolvedPaths, ...cleanedConfig } = config
  cleanedConfig.components = cleanedConfig.components || []

  const foundComponents = await fs.readdir(config.resolvedPaths.ui)
  // Remove file extensions from the filenames
  const componentsWithoutExtensions = foundComponents.map((file) =>
    file.replace(path.extname(file), "")
  )
  const componentSet = new Set(componentsWithoutExtensions)
  cleanedConfig.components = Array.from(componentSet)

  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")

  await fs.writeFile(targetPath, JSON.stringify(cleanedConfig, null, 2), "utf8")
  config = { ...cleanedConfig, resolvedPaths }
  updateSpinner.succeed()
  return config
}
