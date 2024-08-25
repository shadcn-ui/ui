import path from "path"
import { addOptionsSchema } from "@/src/commands/add"
import * as ERRORS from "@/src/utils/errors"
import { getConfig } from "@/src/utils/get-config"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"
import { cyan } from "kleur/colors"
import ora from "ora"
import { z } from "zod"

export async function preFlightAdd(options: z.infer<typeof addOptionsSchema>) {
  const errors: Record<string, boolean> = {}

  let projectSpinner
  if (options.verbose) {
    logger.info("")
    projectSpinner = ora(`Preflight checks.`).start()
  }

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(options.cwd) ||
    !fs.existsSync(path.resolve(options.cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
  }

  // Check for existing components.json file.
  if (!fs.existsSync(path.resolve(options.cwd, "components.json"))) {
    errors[ERRORS.MISSING_CONFIG] = true
  }

  const config = await getConfig(options.cwd)
  if (!config) {
    errors[ERRORS.FAILED_CONFIG_READ] = true
  }

  if (Object.keys(errors).length > 0) {
    projectSpinner?.fail()

    logger.info("")
    if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      logger.error(`The path ${cyan(options.cwd)} does not exist or is empty.`)
    }

    if (errors[ERRORS.MISSING_CONFIG]) {
      logger.error(
        `A ${cyan("components.json")} file was not found at ${cyan(
          options.cwd
        )}.\nBefore you can add components, you must create a ${cyan(
          "components.json"
        )} file by running the ${cyan("init")} command.`
      )
      logger.error(
        `Learn more at ${cyan("https://ui.shadcn.com/docs/components-json")}.`
      )
    } else if (errors[ERRORS.FAILED_CONFIG_READ]) {
      logger.error(`Failed to read the ${cyan("components.json")} file.`)
    }

    logger.info("")
    process.exit(1)
  }

  projectSpinner?.succeed()

  return {
    errors,
    config: config!,
  }
}
