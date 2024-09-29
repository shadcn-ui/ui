import { promises as fs } from "fs"
import path from "path"
import { type Config } from "@/src/utils/get-config"

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
