#!/usr/bin/env node
import { add } from "@/src/commands/add"
import { apply } from "@/src/commands/apply"
import { build } from "@/src/commands/build"
import { diff } from "@/src/commands/diff"
import { docs } from "@/src/commands/docs"
import { info } from "@/src/commands/info"
import { init } from "@/src/commands/init"
import { mcp } from "@/src/commands/mcp"
import { migrate } from "@/src/commands/migrate"
import { preset } from "@/src/commands/preset"
import { registry } from "@/src/commands/registry"
import { search } from "@/src/commands/search"
import { view } from "@/src/commands/view"
import { Command } from "commander"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("shadcn")
    .description("build your component library")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program
    .addCommand(init)
    .addCommand(apply)
    .addCommand(add)
    .addCommand(diff)
    .addCommand(docs)
    .addCommand(view)
    .addCommand(search)
    .addCommand(migrate)
    .addCommand(info)
    .addCommand(build)
    .addCommand(mcp)
    .addCommand(preset)
    .addCommand(registry)

  program.parse()
}

main()

export * from "./registry/api"
