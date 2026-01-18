#!/usr/bin/env node
import { add } from "@/src/commands/add"
import { build } from "@/src/commands/build"
import { create } from "@/src/commands/create"
import { diff } from "@/src/commands/diff"
import { info } from "@/src/commands/info"
import { init } from "@/src/commands/init"
import { mcp } from "@/src/commands/mcp"
import { migrate } from "@/src/commands/migrate"
import { registry } from "@/src/commands/registry"
import { build as registryBuild } from "@/src/commands/registry/build"
import { mcp as registryMcp } from "@/src/commands/registry/mcp"
import { search } from "@/src/commands/search"
import { view } from "@/src/commands/view"
import { Command } from "commander"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("shadcn")
    .description("add items from registries to your project")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program
    .addCommand(init)
    .addCommand(create)
    .addCommand(add)
    .addCommand(diff)
    .addCommand(view)
    .addCommand(search)
    .addCommand(migrate)
    .addCommand(info)
    .addCommand(build)
    .addCommand(mcp)
    .addCommand(registry)
  // Legacy registry commands.
  program.addCommand(registryBuild).addCommand(registryMcp)

  program.parse()
}

main()

export * from "./registry/api"
