import path from "path"
import * as ERRORS from "@/src/utils/errors"
import { getConfig } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"

export async function preFlightRemove(cwd: string) {
  const errors: Record<string, boolean> = {}

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(cwd) ||
    !fs.existsSync(path.resolve(cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      config: null,
    }
  }

  // Check for existing components.json file.
  if (!fs.existsSync(path.resolve(cwd, "components.json"))) {
    errors[ERRORS.MISSING_CONFIG] = true
    return {
      errors,
      config: null,
    }
  }

  try {
    const config = await getConfig(cwd)

    return {
      errors,
      config: config!,
    }
  } catch (error) {
    logger.break()
    logger.error(
      `An invalid ${highlighter.info(
        "components.json"
      )} file was found at ${highlighter.info(
        cwd
      )}.\nBefore you can remove components, you must create a valid ${highlighter.info(
        "components.json"
      )} file by running the ${highlighter.info("init")} command.`
    )
    logger.error(
      `Learn more at ${highlighter.info(
        "https://ui.shadcn.com/docs/components-json"
      )}.`
    )
    logger.break()
    process.exit(1)
  }
}

// or we can pass called argument in preflight add to make this function
// resuable with the default value of add and we can use ...
//  export async function preFlightAddRemove(cwd: string,called:"add","remove"="add") {
