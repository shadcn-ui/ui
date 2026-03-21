import { existsSync, promises as fs } from "fs"
import path from "path"
import { registryItemEnvVarsSchema } from "@/src/schema"
import {
  findExistingEnvFile,
  getNewEnvKeys,
  mergeEnvContent,
} from "@/src/utils/env-helpers"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { z } from "zod"

export async function updateEnvVars(
  envVars: z.infer<typeof registryItemEnvVarsSchema> | undefined,
  config: Config,
  options: {
    silent?: boolean
  }
) {
  if (!envVars || Object.keys(envVars).length === 0) {
    return {
      envVarsAdded: [],
      envFileUpdated: null,
      envFileCreated: null,
    }
  }

  options = {
    silent: false,
    ...options,
  }

  const envSpinner = spinner(`Adding environment variables.`, {
    silent: options.silent,
  })?.start()

  const projectRoot = config.resolvedPaths.cwd

  // Find existing env file or use .env.local as default.
  let envFilePath = path.join(projectRoot, ".env.local")
  const existingEnvFile = findExistingEnvFile(projectRoot)

  if (existingEnvFile) {
    envFilePath = existingEnvFile
  }

  const envFileExists = existsSync(envFilePath)
  const envFileName = path.basename(envFilePath)

  // Convert envVars object to env file format
  const newEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  let envVarsAdded: string[] = []
  let envFileUpdated: string | null = null
  let envFileCreated: string | null = null

  if (envFileExists) {
    const existingContent = await fs.readFile(envFilePath, "utf-8")
    const mergedContent = mergeEnvContent(existingContent, newEnvContent)
    envVarsAdded = getNewEnvKeys(existingContent, newEnvContent)

    if (envVarsAdded.length > 0) {
      await fs.writeFile(envFilePath, mergedContent, "utf-8")
      envFileUpdated = path.relative(projectRoot, envFilePath)

      envSpinner?.succeed(
        `Added the following variables to ${highlighter.info(envFileName)}:`
      )

      if (!options.silent) {
        for (const key of envVarsAdded) {
          logger.log(`  ${highlighter.success("+")} ${key}`)
        }
      }
    } else {
      envSpinner?.stop()
    }
  } else {
    // Create new env file
    await fs.writeFile(envFilePath, newEnvContent + "\n", "utf-8")
    envFileCreated = path.relative(projectRoot, envFilePath)
    envVarsAdded = Object.keys(envVars)

    envSpinner?.succeed(
      `Added the following variables to ${highlighter.info(envFileName)}:`
    )

    if (!options.silent) {
      for (const key of envVarsAdded) {
        logger.log(`  ${highlighter.success("+")} ${key}`)
      }
    }
  }

  if (!options.silent && envVarsAdded.length > 0) {
    logger.break()
  }

  return {
    envVarsAdded,
    envFileUpdated,
    envFileCreated,
  }
}
