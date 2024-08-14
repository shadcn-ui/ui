import path from "path"
import * as ERRORS from "@/src/utils/errors"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import chalk from "chalk"
import fs from "fs-extra"
import ora from "ora"

export async function preFlight(cwd: string) {
  const errors: Record<string, boolean> = {}

  logger.info("")

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  const projectSpinner = ora(`Preflight checks.`).start()
  if (
    !fs.existsSync(cwd) ||
    !fs.existsSync(path.resolve(cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
  }

  // Check for existing components.json file.
  if (fs.existsSync(path.resolve(cwd, "components.json"))) {
    errors[ERRORS.EXISTING_CONFIG] = true
  }

  if (Object.keys(errors).length > 0) {
    projectSpinner?.fail()

    logger.info("")
    if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      logger.error(`The path ${chalk.cyan(cwd)} does not exist or is empty.`)
    }

    if (errors[ERRORS.EXISTING_CONFIG]) {
      logger.error(
        `A ${chalk.cyan("components.json")} file already exists at ${chalk.cyan(
          cwd
        )}.\nTo start over, remove the ${chalk.cyan(
          "components.json"
        )} file and run ${chalk.cyan("init")} again.`
      )
    }

    logger.info("")
    process.exit(1)
  }

  projectSpinner?.succeed()

  const projectInfo = await getProjectInfo(cwd)

  const frameworkSpinner = ora(`Verifying framework.`).start()
  if (projectInfo?.framework.name === "manual") {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true
    frameworkSpinner?.fail()
    logger.info("")
    logger.error(
      `We could not detect a supported framework at ${chalk.cyan(cwd)}.\n` +
        `Visit ${chalk.cyan(
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
    logger.info("")

    if (errors[ERRORS.TAILWIND_NOT_CONFIGURED]) {
      logger.error(
        "Tailwind CSS is not configured. Install Tailwind CSS then run init again.\n" +
          `Visit ${chalk.cyan(
            projectInfo?.framework.links.tailwind
          )} to get started.\n`
      )
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      logger.error(
        `No import alias found in your tsconfig.json file. \nVisit ${chalk.cyan(
          projectInfo?.framework.links.installation
        )} to learn how to set an import alias.`
      )
    }

    logger.info("")
    process.exit(1)
  }
  logger.info("")

  return {
    errors,
    projectInfo,
  }
}
