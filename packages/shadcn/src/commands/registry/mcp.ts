import path from "path"
import { server } from "@/src/mcp"
import { registrySchema } from "@/src/registry"
import { fetchRegistry } from "@/src/registry/api"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { Command } from "commander"
import { z } from "zod"

const mcpOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
})

export const mcp = new Command()
  .name("registry:mcp")
  .description("starts the registry MCP server")
  .argument(
    "[registry]",
    "absolute path to registry.json file",
    process.env.REGISTRY_URL
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (registryFile: string, opts) => {
    try {
      // const options = mcpOptionsSchema.parse({
      //   cwd: path.resolve(opts.cwd),
      //   registryFile,
      // })

      const transport = new StdioServerTransport()
      await server.connect(transport)
      logger.info("MCP Server running on stdio")
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
