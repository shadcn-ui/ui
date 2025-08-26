import { server } from "@/src/mcp"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { Command } from "commander"

export const mcp = new Command()
  .name("mcp")
  .description("starts the registry MCP server")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (options) => {
    try {
      await loadEnvFiles(options.cwd)
      const transport = new StdioServerTransport()
      await server.connect(transport)
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
