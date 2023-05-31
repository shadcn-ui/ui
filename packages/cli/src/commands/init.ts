import { existsSync, promises as fs } from "fs"
import path from "path"
import { Config, getConfig, promptForConfig } from "@/src/utils/get-config"
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
  path: z.string(),
  yes: z.boolean(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option(
    "-p, --path <path>",
    "the path to your project. defaults to the current directory.",
    process.cwd()
  )
  .option("-y, --yes", "skip confirmation prompt.", false)
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message:
            "Running this command will install dependencies and overwrite your existing files. Proceed?",
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      const targetDirectory = path.resolve(options.path)

      // Ensure target directory exists.
      if (!existsSync(targetDirectory)) {
        logger.error(
          `The path ${targetDirectory} does not exist. Please try again.`
        )
        process.exit(1)
      }

      // Read config.
      let config = await getConfig(targetDirectory)
      let promptedForConfig = false
      if (!config) {
        promptedForConfig = true
        config = await promptForConfig(targetDirectory)
      }

      if (!promptedForConfig) {
        logger.info("")
      }

      await runInit(targetDirectory, config)

      logger.info("")
      logger.info(
        `${chalk.green("Success!")} Project initialization completed.`
      )
      logger.info("")
    } catch (error) {
      handleError(error)
    }
  })

export async function runInit(targetDir: string, config: Config) {
  const spinner = ora(`Initializing project...`)?.start()

  // Ensure the components directory exists.
  if (!existsSync(config.components)) {
    await fs.mkdir(config.components, { recursive: true })
  }

  // Ensure the ui components directory exits.
  if (!existsSync(config.ui)) {
    await fs.mkdir(config.ui, { recursive: true })
  }

  // Write utils file.
  const utilsDir = path.dirname(config.utils)
  if (!existsSync(utilsDir)) {
    await fs.mkdir(utilsDir, { recursive: true })
  }
  await fs.writeFile(config.utils, templates.UTILS, "utf8")

  // Write styles file.
  const stylesDir = path.dirname(config.styles)
  if (!existsSync(stylesDir)) {
    await fs.mkdir(stylesDir, { recursive: true })
  }
  await fs.writeFile(config.styles, templates.STYLES_WITH_VARIABLES, "utf8")

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
