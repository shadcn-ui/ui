import path from "path"
import { buildOptionsSchema } from "@/src/commands/build"
import * as ERRORS from "@/src/utils/errors"
import { getConfig } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"
import { z } from "zod"

export async function preFlightRegistryBuild(
  options: z.infer<typeof buildOptionsSchema>
) {
  const errors: Record<string, boolean> = {}

  const resolvePaths = {
    cwd: options.cwd,
    registryFile: path.resolve(options.cwd, options.registryFile),
    outputDir: path.resolve(options.cwd, options.outputDir),
  }

  // Ensure registry file exists.
  if (!fs.existsSync(resolvePaths.registryFile)) {
    errors[ERRORS.BUILD_MISSING_REGISTRY_FILE] = true
    return {
      errors,
      resolvePaths: null,
      config: null,
    }
  }

  // Check for existing components.json file.
  if (!fs.existsSync(path.resolve(options.cwd, "components.json"))) {
    errors[ERRORS.MISSING_CONFIG] = true
    return {
      errors,
      resolvePaths: null,
      config: null,
    }
  }

  // Create output directory if it doesn't exist.
  await fs.mkdir(resolvePaths.outputDir, { recursive: true })

  try {
    const config = await getConfig(options.cwd)

    return {
      errors,
      config: config!,
      resolvePaths,
    }
  } catch (error) {
    logger.break()
    logger.error(
      `An invalid ${highlighter.info(
        "components.json"
      )} file was found at ${highlighter.info(
        options.cwd
      )}.\nBefore you can build the registry, you must create a valid ${highlighter.info(
        "components.json"
      )} file by running the ${highlighter.info("init")} command.`
    )
    logger.break()
    process.exit(1)
  }
}
