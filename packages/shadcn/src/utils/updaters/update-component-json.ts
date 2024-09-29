import { promises as fs } from "fs"
import path from "path"
import { type Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import prompts from "prompts"

export async function updateComponentJson(
  components: string[],
  config: Config,
  caller: "add" | "remove" = "add"
) {
  // Prevent the function from running if "index" is in the components array
  if (components.includes("index")) {
    return
  }

  const { resolvedPaths, ...cleanedConfig } = config

  cleanedConfig.components = cleanedConfig.components || []

  // Convert components in config to a Set for efficient manipulation
  const componentSet = new Set(cleanedConfig.components)

  if (caller === "remove") {
    components.forEach((component) => componentSet.delete(component))
  } else {
    components.forEach((component) => componentSet.add(component))
  }

  // Convert the Set back to an array and update the config
  cleanedConfig.components = Array.from(componentSet)

  // Write the updated config to components.json
  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(cleanedConfig, null, 2), "utf8")
}

// to make things functional with older projects
export async function updateComponentsJsonLegacy(config: Config) {
  if (config.components.length) {
    return
  }

  if (!config?.components || !config?.components.length) {
    let uiPath = path.relative(process.cwd(), config?.resolvedPaths.ui)
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `No components found in ${highlighter.info(
        "component.json"
      )} file to add installed components from ${highlighter.info(
        uiPath
      )}. Proceed?`,
      initial: true,
    })
    if (!proceed) {
      logger.break()
      process.exit(1)
    }
  }
  const { resolvedPaths, ...cleanedConfig } = config

  cleanedConfig.components = cleanedConfig.components || []

  // Read component dir and add name of each file to
  // components field in components.json file
  const foundComponents = await fs.readdir(config.resolvedPaths.ui)
  // Remove file extensions from the filenames
  const componentsWithoutExtensions = foundComponents.map((file) =>
    file.replace(path.extname(file), "")
  )

  const componentSet = new Set(componentsWithoutExtensions)

  cleanedConfig.components.push(...Array.from(componentSet))

  // Write the updated config to components.json
  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(cleanedConfig, null, 2), "utf8")
  config = { ...cleanedConfig, resolvedPaths }
  return config
}
