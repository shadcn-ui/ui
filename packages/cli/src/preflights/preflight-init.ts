import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import * as ERRORS from "@/src/utils/errors"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"
import ora from "ora"
import { z } from "zod"

export async function preFlightInit(
  options: z.infer<typeof initOptionsSchema>
) {
  logger.break()
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

  if (
    fs.existsSync(path.resolve(options.cwd, "components.json")) &&
    !options.force
  ) {
    errors[ERRORS.EXISTING_CONFIG] = true
  }

  if (Object.keys(errors).length > 0) {
    projectSpinner?.fail()

    logger.break()
    if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      logger.error(
        `The path ${highlighter.info(options.cwd)} does not exist or is empty.`
      )
    }

    if (errors[ERRORS.EXISTING_CONFIG]) {
      logger.error(
        `A ${highlighter.info(
          "components.json"
        )} file already exists at ${highlighter.info(
          options.cwd
        )}.\nTo start over, remove the ${highlighter.info(
          "components.json"
        )} file and run ${highlighter.info("init")} again.`
      )
    }

    logger.break()
    process.exit(1)
  }

  projectSpinner?.succeed()

  const frameworkSpinner = ora(`Verifying framework.`).start()
  const projectInfo = await getProjectInfo(options.cwd)
  if (!projectInfo || projectInfo?.framework.name === "manual") {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true
    frameworkSpinner?.fail()
    logger.break()
    if (projectInfo?.framework.links.installation) {
      logger.error(
        `We could not detect a supported framework at ${highlighter.info(
          options.cwd
        )}.\n` +
          `Visit ${highlighter.info(
            projectInfo?.framework.links.installation
          )} to manually configure your project.\nOnce configured, you can use the cli to add components.`
      )
    }
    logger.break()
    process.exit(1)
  }

  frameworkSpinner?.succeed(
    `Verifying framework. Found ${highlighter.info(
      projectInfo.framework.label
    )}.`
  )

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
      logger.break()
      logger.error(
        `Tailwind CSS is not configured. Install Tailwind CSS then run init again.`
      )
      if (projectInfo?.framework.links.tailwind) {
        logger.error(
          `Visit ${highlighter.info(
            projectInfo?.framework.links.tailwind
          )} to get started.`
        )
      }
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      logger.break()
      logger.error(`No import alias found in your tsconfig.json file.`)
      if (projectInfo?.framework.links.installation) {
        logger.error(
          `Visit ${highlighter.info(
            projectInfo?.framework.links.installation
          )} to learn how to set an import alias.`
        )
      }
    }

    logger.break()
    process.exit(1)
  }

  return {
    projectInfo,
  }
}
