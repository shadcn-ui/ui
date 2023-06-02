import { cosmiconfig } from "cosmiconfig"
import * as z from "zod"

export const COMPONENTS_DIR = "./shadcn/ui/"
export const UTILS_LOCATION = "@/shadcn/lib/utils"
export const COMPONENT_ALIAS = "@/shadcn/ui/"

/**
 * this is the name of the key we are looking for, the following are the intended values to look for:
 * - shadcn-ui property in package.json
 * - .shadcn-uirc file in JSON or YAML format
 * - .shadcn-uirc.json, .shadcn-uirc.yaml, .shadcn-uirc.yml, .shadcn-uirc.js, or .shadcn-uirc.cjs file
 * - shadcn-uirc, shadcn-uirc.json, shadcn-uirc.yaml, shadcn-uirc.yml, shadcn-uirc.js or shadcn-uirc.cjs file inside a .config subdirectory
 * - shadcn-ui.config.js or shadcn-ui.config.cjs CommonJS module exporting an object
 */
const explorer = cosmiconfig("shadcn-ui")

const configSchema = z.object({
  componentsDirInstallation: z.string(),
  askForDir: z.boolean(),
  utilsLocation: z.string(),
  componentDirAlias: z.string(),
})

export type Config = z.infer<typeof configSchema>

export async function getCliConfig(): Promise<Config> {
  const defaultConfig: Config = {
    componentsDirInstallation: COMPONENTS_DIR,
    askForDir: true,
    utilsLocation: UTILS_LOCATION,
    componentDirAlias: COMPONENT_ALIAS,
  }

  const userDefinedConfig = await getConfigFromEverywhere()

  return {
    ...defaultConfig,
    ...userDefinedConfig,
    askForDir: !userDefinedConfig.componentsDirInstallation,
  }
}

export async function getConfigFromEverywhere() {
  try {
    const configResult = await explorer.search()

    if (!configResult) {
      // we should always return an object so we can then merge with
      // the base config
      return {}
    }

    const { config } = configResult

    const parsedConfig = configSchema.partial().parse(config)
    return parsedConfig
  } catch (e) {
    // lets just show the error to the user to aware about the issue, but lets not handle it.
    console.log(e)
    return {}
  }
}
