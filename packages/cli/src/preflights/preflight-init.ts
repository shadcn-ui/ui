import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import * as ERRORS from "@/src/utils/errors"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"
import { cyan } from "kleur/colors"
import ora from "ora"
import { z } from "zod"

export async function preFlightInit(
  options: z.infer<typeof initOptionsSchema>
) {
  logger.info("")
  const errors: Record<string, boolean> = {}

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  const projectSpinner = ora(`Preflight checks.`).start()
  if (
    !fs.existsSync(options.cwd) ||
    !fs.existsSync(path.resolve(options.cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
  }

  // Check for existing components.json file.
  if (
    fs.existsSync(path.resolve(options.cwd, "components.json")) &&
    !options.force
  ) {
    errors[ERRORS.EXISTING_CONFIG] = true
  }

  if (Object.keys(errors).length > 0) {
    projectSpinner?.fail()

    logger.info("")
    if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      logger.error(`The path ${cyan(options.cwd)} does not exist or is empty.`)
    }

    if (errors[ERRORS.EXISTING_CONFIG]) {
      logger.error(
        `A ${cyan("components.json")} file already exists at ${cyan(
          options.cwd
        )}.\nTo start over, remove the ${cyan(
          "components.json"
        )} file and run ${cyan("init")} again.`
      )
    }

    logger.info("")
    process.exit(1)
  }

  projectSpinner?.succeed()

  const projectInfo = await getProjectInfo(options.cwd)

  const frameworkSpinner = ora(`Verifying framework.`).start()
  if (projectInfo?.framework.name === "manual") {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true
    frameworkSpinner?.fail()
    logger.info("")
    logger.error(
      `We could not detect a supported framework at ${cyan(options.cwd)}.\n` +
        `Visit ${cyan(
          projectInfo?.framework.links.installation
        )} to manually configure your project.\nOnce configured, you can use the cli to add components.`
    )
    logger.info("")
    process.exit(1)
  } else {
    frameworkSpinner?.succeed(
      `Verifying framework: ${projectInfo?.framework.label}.`
    )
  }

  const tailwindSpinner = ora(`Validating Tailwind CSS.`).start()
  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true
    tailwindSpinner?.fail()
  } else {
    tailwindSpinner?.succeed()
  }

  const tsConfigSpinner = ora(`Validating import alias.`).start()
  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true
    tsConfigSpinner?.fail()
  } else {
    tsConfigSpinner?.succeed()
  }

  if (Object.keys(errors).length > 0) {
    if (errors[ERRORS.TAILWIND_NOT_CONFIGURED]) {
      logger.info("")
      logger.error(
        `Tailwind CSS is not configured. Install Tailwind CSS then run init again.`
      )
      if (projectInfo?.framework.links.tailwind) {
        logger.error(
          `Visit ${cyan(projectInfo?.framework.links.tailwind)} to get started.`
        )
      }
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      logger.info("")
      logger.error(`No import alias found in your tsconfig.json file.`)
      if (projectInfo?.framework.links.installation) {
        logger.error(
          `Visit ${cyan(
            projectInfo?.framework.links.installation
          )} to learn how to set an import alias.`
        )
      }
    }

    logger.info("")
    process.exit(1)
  }

  return {
    projectInfo,
  }
}
