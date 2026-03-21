import { promises as fs } from "fs"
import path from "path"
import { server } from "@/src/mcp"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { getConfig } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { Command } from "commander"
import deepmerge from "deepmerge"
import { execa } from "execa"
import fsExtra from "fs-extra"
import prompts from "prompts"
import z from "zod"

const SHADCN_MCP_VERSION = "latest"

const CLIENTS = [
  {
    name: "claude",
    label: "Claude Code",
    configPath: ".mcp.json",
    config: {
      mcpServers: {
        shadcn: {
          command: "npx",
          args: [`shadcn@${SHADCN_MCP_VERSION}`, "mcp"],
        },
      },
    },
  },
  {
    name: "cursor",
    label: "Cursor",
    configPath: ".cursor/mcp.json",
    config: {
      mcpServers: {
        shadcn: {
          command: "npx",
          args: [`shadcn@${SHADCN_MCP_VERSION}`, "mcp"],
        },
      },
    },
  },
  {
    name: "vscode",
    label: "VS Code",
    configPath: ".vscode/mcp.json",
    config: {
      servers: {
        shadcn: {
          command: "npx",
          args: [`shadcn@${SHADCN_MCP_VERSION}`, "mcp"],
        },
      },
    },
  },
  {
    name: "codex",
    label: "Codex",
    configPath: ".codex/config.toml",
    config: `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@${SHADCN_MCP_VERSION}", "mcp"]
`,
  },
] as const

const DEPENDENCIES = [`shadcn@${SHADCN_MCP_VERSION}`]

export const mcp = new Command()
  .name("mcp")
  .description("MCP server and configuration commands")
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

const mcpInitOptionsSchema = z.object({
  client: z.enum(["claude", "cursor", "vscode", "codex"]),
  cwd: z.string(),
})

mcp
  .command("init")
  .description("Initialize MCP configuration for your client")
  .option(
    "--client <client>",
    `MCP client (${CLIENTS.map((c) => c.name).join(", ")})`
  )
  .action(async (opts, command) => {
    try {
      // Get the cwd from parent command.
      const parentOpts = command.parent?.opts() || {}
      const cwd = parentOpts.cwd || process.cwd()

      let client = opts.client

      if (!client) {
        const response = await prompts({
          type: "select",
          name: "client",
          message: "Which MCP client are you using?",
          choices: CLIENTS.map((c) => ({
            title: c.label,
            value: c.name,
          })),
        })

        if (!response.client) {
          logger.break()
          process.exit(1)
        }

        client = response.client
      }

      const options = mcpInitOptionsSchema.parse({
        client,
        cwd,
      })

      const config = await getConfig(options.cwd)

      if (options.client === "codex") {
        if (config) {
          await updateDependencies([], DEPENDENCIES, config, {
            silent: false,
          })
        } else {
          const packageManager = await getPackageManager(options.cwd)
          const installCommand = packageManager === "npm" ? "install" : "add"
          const devFlag = packageManager === "npm" ? "--save-dev" : "-D"

          const installSpinner = spinner("Installing dependencies...").start()
          await execa(
            packageManager,
            [installCommand, devFlag, ...DEPENDENCIES],
            {
              cwd: options.cwd,
            }
          )
          installSpinner.succeed("Installing dependencies.")
        }

        logger.break()
        logger.log("To configure the shadcn MCP server in Codex:")
        logger.break()
        logger.log(
          `1. Open or create the file ${highlighter.info(
            "~/.codex/config.toml"
          )}`
        )
        logger.log("2. Add the following configuration:")
        logger.log()
        logger.info(`[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@${SHADCN_MCP_VERSION}", "mcp"]`)
        logger.break()
        logger.info("3. Restart Codex to load the MCP server")
        logger.break()
        process.exit(0)
      }

      const configSpinner = spinner("Configuring MCP server...").start()
      const configPath = await runMcpInit(options)
      configSpinner.succeed("Configuring MCP server.")

      if (config) {
        await updateDependencies([], DEPENDENCIES, config, {
          silent: false,
        })
      } else {
        const packageManager = await getPackageManager(options.cwd)
        const installCommand = packageManager === "npm" ? "install" : "add"
        const devFlag = packageManager === "npm" ? "--save-dev" : "-D"

        const installSpinner = spinner("Installing dependencies...").start()
        await execa(
          packageManager,
          [installCommand, devFlag, ...DEPENDENCIES],
          {
            cwd: options.cwd,
          }
        )
        installSpinner.succeed("Installing dependencies.")
      }

      logger.break()
      logger.success(`Configuration saved to ${configPath}.`)
      logger.break()
    } catch (error) {
      handleError(error)
    }
  })

const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

async function runMcpInit(options: z.infer<typeof mcpInitOptionsSchema>) {
  const { client, cwd } = options

  const clientInfo = CLIENTS.find((c) => c.name === client)
  if (!clientInfo) {
    throw new Error(
      `Unknown client: ${client}. Available clients: ${CLIENTS.map(
        (c) => c.name
      ).join(", ")}`
    )
  }

  const configPath = path.join(cwd, clientInfo.configPath)
  const dir = path.dirname(configPath)
  await fsExtra.ensureDir(dir)

  // Handle JSON format.
  let existingConfig = {}
  try {
    const content = await fs.readFile(configPath, "utf-8")
    existingConfig = JSON.parse(content)
  } catch {}

  const mergedConfig = deepmerge(
    existingConfig,
    clientInfo.config as Record<string, unknown>,
    { arrayMerge: overwriteMerge }
  )

  await fs.writeFile(
    configPath,
    JSON.stringify(mergedConfig, null, 2) + "\n",
    "utf-8"
  )

  return clientInfo.configPath
}
