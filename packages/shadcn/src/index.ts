#!/usr/bin/env node
import { add } from "@/src/commands/add"
import { build } from "@/src/commands/build"
import { diff } from "@/src/commands/diff"
import { info } from "@/src/commands/info"
import { init } from "@/src/commands/init"
import { migrate } from "@/src/commands/migrate"
import { build as registryBuild } from "@/src/commands/registry/build"
import { mcp as registryMcp } from "@/src/commands/registry/mcp"
import { Command } from "commander"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("shadcn")
    .description("add components and dependencies to your project")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program
    .addCommand(init)
    .addCommand(add)
    .addCommand(diff)
    .addCommand(migrate)
    .addCommand(info)
    .addCommand(build)

  // Registry commands
  program.addCommand(registryBuild).addCommand(registryMcp)

  program.parse()
}

main()

export * from "./registry/api"
