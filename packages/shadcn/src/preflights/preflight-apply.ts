import path from "path"
import { SHADCN_URL } from "@/src/registry/constants"
import * as ERRORS from "@/src/utils/errors"
import { getConfig } from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"

export async function preFlightApply(options: { cwd: string }) {
  const errors: Record<string, boolean> = {}

  if (
    !fs.existsSync(options.cwd) ||
    !fs.existsSync(path.resolve(options.cwd, "package.json"))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true
    return {
      errors,
      config: null,
    }
  }

  if (!fs.existsSync(path.resolve(options.cwd, "components.json"))) {
    if (await isMonorepoRoot(options.cwd)) {
      const targets = await getMonorepoTargets(options.cwd)
      if (targets.length > 0) {
        formatMonorepoMessage("apply --preset <preset>", targets, {
          cwdFlag: "-c",
        })
        process.exit(1)
      }
    }

    errors[ERRORS.MISSING_CONFIG] = true
    return {
      errors,
      config: null,
    }
  }

  try {
    const config = await getConfig(options.cwd)

    return {
      errors,
      config: config!,
    }
  } catch {
    logger.break()
    logger.error(
      `An invalid ${highlighter.info(
        "components.json"
      )} file was found at ${highlighter.info(
        options.cwd
      )}.\nBefore you can apply a preset, you must create a valid ${highlighter.info(
        "components.json"
      )} file by running the ${highlighter.info("init")} command.`
    )
    logger.error(
      `Learn more at ${highlighter.info(`${SHADCN_URL}/docs/components-json`)}.`
    )
    logger.break()
    process.exit(1)
  }
}
