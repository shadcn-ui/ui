import * as fs from "fs/promises"
import * as path from "path"
import { preFlightRegistryBuild } from "@/src/preflights/preflight-registry"
import { registryItemSchema, registrySchema } from "@/src/registry"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import { z } from "zod"

export const buildOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
  outputDir: z.string(),
})

export const build = new Command()
  .name("build")
  .description("DEPRECATED: use `registry:build` instead")
  .argument("[registry]", "path to registry.json file", "./registry.json")
  .option(
    "-o, --output <path>",
    "destination directory for json files",
    "./public/r"
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(() => {
    logger.warn(
      "The `shadcn build` command is deprecated. Use `shadcn registry:build` instead."
    )
    logger.break()
  })
