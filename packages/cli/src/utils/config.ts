import os from "os"
import path from "path"
import fs from "fs-extra"
import { z } from "zod"

// $HOME/.config/shadcn-ui/config.json
const CONFIG_PATH = path.join(
  os.homedir(),
  ".config",
  "shadcn-ui",
  "config.json"
)

const configSchema = z.object({
  projects: z.record(z.string(), z.string()),
})

type Config = z.infer<typeof configSchema>

// initialize the config
// create the config file if it doesn't exist
/**
 * ---
 * Initialize the config. Ensure that the config file exists and has the corret content
 */
export const init = async () => {
  await fs.ensureFile(CONFIG_PATH)

  const content = await fs.readFile(CONFIG_PATH, "utf-8")

  if (!!content) return
  await fs.writeJson(CONFIG_PATH, { projects: {} }, { spaces: 2 })
}

/**
 * ---
 * Get the config object
 */
export const get = async (): Promise<Config> => {
  const json = await fs.readJson(CONFIG_PATH)
  return configSchema.parse(json)
}

/**
 * ---
 * Upsert a project preference
 *
 * @param project - The current working dir
 * @param value - The path where to store the components
 */
export const upsertProject = async (project: string, value: string) => {
  const config = await get()

  config.projects[project] = value

  await fs.writeJSON(CONFIG_PATH, config, { spaces: 2 })
}
