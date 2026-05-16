import { add } from "@/src/commands/registry/add"
import { Command } from "commander"

export const registry = new Command()
  .name("registry")
  .description("manage registries")
  .addCommand(add)
