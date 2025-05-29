import { server } from "@/src/mcp"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { Command } from "commander"

export const mcp = new Command()
  .name("registry:mcp")
  .description("starts the registry MCP server [EXPERIMENTAL]")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async () => {
    try {
      const transport = new StdioServerTransport()
      await server.connect(transport)
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
