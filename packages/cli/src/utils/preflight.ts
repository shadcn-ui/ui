import path from "path"
import * as ERRORS from "@/src/utils/errors"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import chalk from "chalk"
import fs from "fs-extra"
import ora from "ora"

export async function preFlight(cwd: string) {
  const errors: Record<string, boolean> = {}

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  const projectSpinner = ora(`Running preflight checks...`).start()
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
        `A components.json file already exists at ${chalk.cyan(
          cwd
        )}.\nTo start over, remove the components.json file and try again.`
      )
    }

    logger.info("")
    process.exit(1)
  }

  projectSpinner?.succeed("Running preflight checks.")

  const projectInfo = await getProjectInfo(cwd)

  const frameworkSpinner = ora(`Checking for framework...`).start()
  if (!projectInfo?.framework) {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true
    frameworkSpinner?.fail()
    logger.info("")
    logger.error(
      `We couldn't detect a supported framework at ${chalk.cyan(cwd)}.\n` +
        `Visit ${chalk.cyan(
          "https://ui.shadcn.com/docs/installation/manual"
        )} to manually create a components.json file.\n`
    )
    logger.info("")
    process.exit(1)
  } else {
    frameworkSpinner?.succeed("Checking for framework.")
  }

  const tailwindSpinner = ora(`Checking for Tailwind CSS...`).start()
  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    errors[ERRORS.TAILWIND_NOT_CONFIGURED] = true
    tailwindSpinner?.fail()
  } else {
    tailwindSpinner?.succeed("Checking for Tailwind CSS.")
  }

  const tsConfigSpinner = ora(`Checking for import alias...`).start()
  if (!projectInfo?.aliasPrefix) {
    errors[ERRORS.IMPORT_ALIAS_MISSING] = true
    tsConfigSpinner?.fail()
  } else {
    tsConfigSpinner?.succeed("Checking for import alias.")
  }

  if (Object.keys(errors).length > 0) {
    logger.info("")

    if (errors[ERRORS.TAILWIND_NOT_CONFIGURED]) {
      const framework =
        projectInfo?.framework &&
        ["next-app", "next-pages"].includes(projectInfo?.framework)
          ? "nextjs"
          : projectInfo?.framework
      const tailwindInstallationUrl = framework
        ? `https://tailwindcss.com/docs/guides/${framework}`
        : "https://tailwindcss.com/docs/installation/framework-guides"
      logger.error(
        "Tailwind CSS is not configured. Install Tailwind CSS then run init again.\n" +
          `Visit ${chalk.cyan(tailwindInstallationUrl)} to get started.\n`
      )
    }

    if (errors[ERRORS.IMPORT_ALIAS_MISSING]) {
      const framework =
        projectInfo?.framework &&
        ["next-app", "next-pages"].includes(projectInfo?.framework)
          ? "next"
          : projectInfo?.framework
      logger.error(
        `No import alias found in your tsconfig.json file. \nVisit ${chalk.cyan(
          `https://ui.shadcn.com/docs/installation/${framework}`
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
