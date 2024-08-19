import { logger } from "@/src/utils/logger"
import { cyan } from "kleur/colors"
import { z } from "zod"

export function handleError(error: unknown) {
  logger.error(
    `Something went wrong. Please check the error below for more details.`
  )
  logger.error(`If the problem persists, please open an issue on GitHub.`)
  logger.error("")
  if (typeof error === "string") {
    logger.error(error)
    logger.error("\n")
    process.exit(1)
  }

  if (error instanceof z.ZodError) {
    logger.error("Validation failed:")
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${cyan(key)}: ${value}`)
    }
    logger.error("\n")
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    logger.error("\n")
    process.exit(1)
  }

  logger.error("\n")
  process.exit(1)
}
