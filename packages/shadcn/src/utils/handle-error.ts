import { RegistryError } from "@/src/registry/errors"
import {
  getPackageManagerFromUserAgent,
  getPackageRunnerCommand,
} from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { z } from "zod"

import packageJson from "../../package.json"

export function handleError(error: unknown) {
  logger.break()
  logger.error(
    `Something went wrong. Please check the error below for more details.`
  )
  logger.error(`If the problem persists, please open an issue on GitHub.`)
  logger.error("")
  if (typeof error === "string") {
    logger.error(error)
    exitWithPreviousVersionSuggestion()
  }

  if (error instanceof RegistryError) {
    if (error.message) {
      logger.error(error.cause ? "Error:" : "Message:")
      logger.error(error.message)
    }

    if (error.cause) {
      logger.error("\nMessage:")
      logger.error(error.cause)
    }

    if (error.suggestion) {
      logger.error("\nSuggestion:")
      logger.error(error.suggestion)
    }
    exitWithPreviousVersionSuggestion()
  }

  if (error instanceof z.ZodError) {
    logger.error("Validation failed:")
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${highlighter.info(key)}: ${value}`)
    }
    exitWithPreviousVersionSuggestion()
  }

  if (error instanceof Error) {
    logger.error(error.message)
    exitWithPreviousVersionSuggestion()
  }

  exitWithPreviousVersionSuggestion()
}

export function getPreviousMinorVersion(version: string) {
  const match = version.match(/^(\d+)\.(\d+)\.\d+/)

  if (!match) {
    return null
  }

  const major = Number.parseInt(match[1], 10)
  const minor = Number.parseInt(match[2], 10)

  if (minor === 0) {
    return null
  }

  return `${major}.${minor - 1}.0`
}

export function getPreviousMinorCommand(
  version = packageJson.version,
  args = process.argv.slice(2)
) {
  const previousMinorVersion = getPreviousMinorVersion(version)

  if (!previousMinorVersion) {
    return null
  }

  const runner = getPackageRunnerCommand(getPackageManagerFromUserAgent())

  return [...runner.split(" "), `shadcn@${previousMinorVersion}`, ...args]
    .map(quoteShellArg)
    .join(" ")
}

function exitWithPreviousVersionSuggestion() {
  const command = getPreviousMinorCommand()

  if (command) {
    logger.error("")
    logger.error("You can also try a previous version to see if that works:")
    logger.error(command)
  }

  logger.break()
  process.exit(1)
}

function quoteShellArg(value: string) {
  if (/^[a-zA-Z0-9_./:@%+=,-]+$/.test(value)) {
    return value
  }

  return `'${value.replace(/'/g, "'\\''")}'`
}
