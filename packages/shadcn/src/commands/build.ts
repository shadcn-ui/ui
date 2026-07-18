import * as fs from "fs/promises"
import * as path from "path"
import { preFlightBuild } from "@/src/preflights/preflight-build"
import {
  createRegistryCatalog,
  createRegistryItem,
  readRegistryWithIncludes,
} from "@/src/registry/loader"
import { handleError } from "@/src/utils/handle-error"
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
  .description("build components for a shadcn registry")
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
  .action(async (registryFile: string, opts) => {
    try {
      const options = buildOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        registryFile,
        outputDir: opts.output,
      })

      const { resolvePaths } = await preFlightBuild(options)
      const registryResult = await readRegistryWithIncludes(
        resolvePaths.registryFile,
        {
          cwd: resolvePaths.cwd,
        }
      )
      const resolvedRegistry = registryResult.registry
      const registryRootDir = registryResult.usesInclude
        ? path.dirname(resolvePaths.registryFile)
        : resolvePaths.cwd
      const registryCatalog = createRegistryCatalog(
        registryResult,
        registryRootDir,
        resolvePaths.cwd
      )

      const buildSpinner = spinner("Building registry...")
      for (const registryItem of resolvedRegistry.items) {
        buildSpinner.start(`Building ${registryItem.name}...`)

        const registryItemForBuild = await createRegistryItem(
          registryItem,
          registryResult,
          registryRootDir,
          resolvePaths.cwd
        )

        // Write the registry item to the output directory.
        await fs.writeFile(
          path.resolve(
            resolvePaths.outputDir,
            `${registryItemForBuild.name}.json`
          ),
          JSON.stringify(registryItemForBuild, null, 2)
        )
      }

      if (registryResult.usesInclude) {
        await fs.writeFile(
          path.resolve(resolvePaths.outputDir, "registry.json"),
          JSON.stringify(registryCatalog, null, 2)
        )
      } else {
        // Copy registry.json to the output directory.
        await fs.copyFile(
          resolvePaths.registryFile,
          path.resolve(resolvePaths.outputDir, "registry.json")
        )
      }

      buildSpinner.succeed("Building registry.")
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
