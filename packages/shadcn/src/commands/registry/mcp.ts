import { highlighter } from "@shadcn/registry/internal/highlighter"
import { logger } from "@shadcn/registry/internal/logger"
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
