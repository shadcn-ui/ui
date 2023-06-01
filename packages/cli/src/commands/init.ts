import { existsSync, promises as fs } from "fs"
import path from "path"
import {
  DEFAULT_STYLES,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_UI,
  DEFAULT_UTILS,
  getConfig,
  rawConfigSchema,
  resolveConfigPaths,
  type Config,
} from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import * as templates from "@/src/utils/templates"
import chalk from "chalk"
import { Command } from "commander"
import { execa } from "execa"
import ora from "ora"
import prompts from "prompts"
import * as z from "zod"

const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "lucide-react",
]

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message:
            "Running this command will overwrite existing files. Proceed?",
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      const cwd = path.resolve(options.cwd)

      // Ensure target directory exists.
      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      // Read config.
      let config = await getConfig(cwd)
      let promptedForConfig = false
      if (!config) {
        promptedForConfig = true
        config = await promptForConfig(cwd, config)
      }

      if (!promptedForConfig) {
        logger.info("")
      }

      await runInit(cwd, config)

      logger.info("")
      logger.info(
        `${chalk.green("Success!")} Project initialization completed.`
      )
      logger.info("")
    } catch (error) {
      handleError(error)
    }
  })

export async function promptForConfig(
  cwd: string,
  defaultConfig: Config | null = null
) {
  const highlight = (text: string) => chalk.cyan(text)

  const options = await prompts([
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight("tailwind.config.js")} located?`,
      initial: defaultConfig?.tailwindConfig ?? DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: "text",
      name: "styles",
      message: `Configure the import path for ${highlight("styles")}`,
      initial: defaultConfig?.importPaths.styles ?? DEFAULT_STYLES,
    },
    {
      type: "text",
      name: "ui",
      message: `Configure the import path for ${highlight("ui components")}`,
      initial: defaultConfig?.importPaths["components:ui"] ?? DEFAULT_UI,
    },
    {
      type: "text",
      name: "cn",
      message: `Configure the import path for ${highlight("cn")} util?`,
      initial: defaultConfig?.importPaths["utils:cn"] ?? DEFAULT_UTILS,
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

export async function runInit(targetDir: string, config: Config) {
  const spinner = ora(`Initializing project...`)?.start()

  // Ensure all resolved paths directories exist.
  for (const resolvedPath of Object.values(config.resolvedPaths)) {
    // Determine if the path is a file or directory.
    // TODO: is there a better way to do this?
    const dirname = path.extname(resolvedPath)
      ? path.dirname(resolvedPath)
      : resolvedPath
    if (!existsSync(dirname)) {
      await fs.mkdir(dirname, { recursive: true })
    }
  }

  // Write styles file.
  await fs.writeFile(
    config.resolvedPaths["styles"],
    templates.STYLES_WITH_VARIABLES,
    "utf8"
  )

  // Write cn file.
  await fs.writeFile(config.resolvedPaths["utils:cn"], templates.UTILS, "utf8")

  // Write tailwind config.
  await fs.writeFile(
    config.tailwindConfig,
    templates.TAILWIND_CONFIG_WITH_VARIABLES,
    "utf8"
  )

  spinner?.succeed()

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start()
  const packageManager = await getPackageManager(targetDir)
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...PROJECT_DEPENDENCIES],
    {
      cwd: targetDir,
    }
  )
  dependenciesSpinner?.succeed()
}
