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

export const rawConfigSchema = z
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

export const configSchema = rawConfigSchema.extend({
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
