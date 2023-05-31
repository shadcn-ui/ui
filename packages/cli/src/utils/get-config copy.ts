import { promises as fs } from "fs"
import path from "path"
import { logger } from "@/src/utils/logger"
import chalk from "chalk"
import { cosmiconfig } from "cosmiconfig"
import ora from "ora"
import prompts from "prompts"
import * as z from "zod"

export const DEFAULT_COMPONENTS = "components"
export const DEFAULT_UI = "components/ui"
export const DEFAULT_UTILS = "lib/utils.ts"
export const DEFAULT_STYLES = "app/globals.css"
export const DEFAULT_IMPORT_ALIAS = "@"
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.js"

// TODO: Figure out if we want to support all cosmiconfig formats.
// A simple components.json file would be nice.
const explorer = cosmiconfig("components", {
  searchPlaces: ["components.json"],
})

const configSchema = z
  .object({
    components: z.string().default(DEFAULT_COMPONENTS),
    ui: z.string().default(DEFAULT_UI),
    utils: z.string().default(DEFAULT_UTILS),
    styles: z.string().default(DEFAULT_STYLES),
    tailwindConfig: z.string().default(DEFAULT_TAILWIND_CONFIG),
    importAlias: z.string().default(DEFAULT_IMPORT_ALIAS),
  })
  .strict()

export type Config = z.infer<typeof configSchema>

export async function getConfig(search: string) {
  const config = await getRawConfig(search)

  if (!config) {
    return null
  }

  return await resolveConfigPaths(search, config)
}

export async function resolveConfigPaths(targetDir: string, config: Config) {
  return {
    ...config,
    components: path.resolve(targetDir, config.components),
    ui: path.resolve(targetDir, config.ui),
    utils: path.resolve(targetDir, config.utils),
    tailwindConfig: path.resolve(targetDir, config.tailwindConfig),
    styles: path.resolve(targetDir, config.styles),
  }
}

export async function getRawConfig(targetDir: string) {
  try {
    const configResult = await explorer.search(targetDir)

    if (!configResult) {
      return null
    }

    return configSchema.parse(configResult.config)
  } catch (error) {
    throw new Error(
      `Invald configuration found in ${targetDir}/components.json.`
    )
  }
}

export async function promptForConfig(targetDir: string) {
  const highlight = (text: string) => chalk.cyan(text)

  const options = await prompts([
    {
      type: "text",
      name: "components",
      message: `Where would you like to install ${highlight("components")}?`,
      initial: DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "ui",
      message: `Where would you like to install ${highlight("UI components")}?`,
      initial: DEFAULT_UI,
    },
    {
      type: "text",
      name: "utils",
      message: `Where should we place ${highlight(
        "utility helpers"
      )} such as cn()?`,
      initial: DEFAULT_UTILS,
    },
    {
      type: "text",
      name: "styles",
      message: `Where should we place ${highlight("Tailwind CSS styles")}?`,
      initial: DEFAULT_STYLES,
    },
    {
      type: "text",
      name: "importAlias",
      message: `Which ${highlight("import alias")} would you like to use?`,
      initial: DEFAULT_IMPORT_ALIAS,
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight("tailwind.config.js")} located?`,
      initial: DEFAULT_TAILWIND_CONFIG,
    },
  ])

  const config = configSchema.parse(options)

  const { proceed } = await prompts({
    type: "confirm",
    name: "proceed",
    message: `Write configuration to ${highlight("components.json")}. Proceed?`,
    initial: true,
  })

  if (!proceed) {
    process.exit(0)
  }

  // Write to file.
  logger.info("")
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(targetDir, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return resolveConfigPaths(targetDir, config)
}
