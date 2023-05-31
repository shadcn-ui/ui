import { promises as fs } from "fs"
import path from "path"
import { logger } from "@/src/utils/logger"
import { resolveImport } from "@/src/utils/resolve-import"
import chalk from "chalk"
import { cosmiconfig } from "cosmiconfig"
import ora from "ora"
import prompts from "prompts"
import { loadConfig } from "tsconfig-paths"
import * as z from "zod"

export const DEFAULT_UI = "@/components/ui"
export const DEFAULT_UTILS = "@/lib/utils.ts"
export const DEFAULT_STYLES = "app/globals.css"
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.js"

// TODO: Figure out if we want to support all cosmiconfig formats.
// A simple components.json file would be nice.
const explorer = cosmiconfig("components", {
  searchPlaces: ["components.json"],
})

const rawConfigSchema = z
  .object({
    importPaths: z.object({
      styles: z.string().default(DEFAULT_STYLES),
      "utils:cn": z.string().default(DEFAULT_UTILS),
      "components:ui": z.string().default(DEFAULT_UI),
    }),
    tailwindConfig: z.string().default(DEFAULT_TAILWIND_CONFIG),
  })
  .strict()

export type RawConfig = z.infer<typeof rawConfigSchema>

const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    styles: z.string(),
    "utils:cn": z.string(),
    "components:ui": z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>

export async function getConfig(cwd: string) {
  const config = await getRawConfig(cwd)

  if (!config) {
    return null
  }

  return await resolveConfigPaths(cwd, config)
}

export async function resolveConfigPaths(cwd: string, config: RawConfig) {
  // Read tsconfig.json.
  const tsConfig = await loadConfig(cwd)

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load tsconfig.json. ${tsConfig.message ?? ""}`.trim()
    )
  }

  return configSchema.parse({
    ...config,
    tailwindConfig: path.resolve(cwd, config.tailwindConfig),
    resolvedPaths: {
      styles: await resolveImport(config.importPaths.styles, tsConfig),
      "utils:cn": await resolveImport(config.importPaths["utils:cn"], tsConfig),
      "components:ui": await resolveImport(
        config.importPaths["components:ui"],
        tsConfig
      ),
    },
  })
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  try {
    const configResult = await explorer.search(cwd)

    if (!configResult) {
      return null
    }

    return rawConfigSchema.parse(configResult.config)
  } catch (error) {
    throw new Error(`Invald configuration found in ${cwd}/components.json.`)
  }
}

export async function promptForConfig(cwd: string) {
  const highlight = (text: string) => chalk.cyan(text)

  const options = await prompts([
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight("tailwind.config.js")} located?`,
      initial: DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: "text",
      name: "styles",
      message: `Configure the import path for ${highlight("styles")}`,
      initial: DEFAULT_STYLES,
    },
    {
      type: "text",
      name: "ui",
      message: `Configure the import path for ${highlight("ui components")}`,
      initial: DEFAULT_UI,
    },
    {
      type: "text",
      name: "cn",
      message: `Configure the import path for ${highlight("cn")} util?`,
      initial: DEFAULT_UTILS,
    },
  ])

  const config = rawConfigSchema.parse({
    tailwindConfig: options.tailwindConfig,
    importPaths: {
      styles: options.styles,
      "utils:cn": options.cn,
      "components:ui": options.ui,
    },
  })

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
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}
