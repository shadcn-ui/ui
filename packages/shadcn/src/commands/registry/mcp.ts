import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"

export const mcp = new Command()
  .name("registry:mcp")
  .description("starts the registry MCP server [DEPRECATED]")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async () => {
    logger.warn(
      `The ${highlighter.info(
        "shadcn registry:mcp"
      )} command is deprecated. Use the ${highlighter.info(
        "shadcn mcp"
      )} command instead.`
    )
    logger.break()
  })
