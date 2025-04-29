import * as fs from "fs/promises"
import * as path from "path"
import { preFlightRegistryBuild } from "@/src/preflights/preflight-registry"
import { registryItemSchema, registrySchema } from "@/src/registry"
import { recursivelyResolveFileImports } from "@/src/registry/utils"
import * as ERRORS from "@/src/utils/errors"
import { configSchema } from "@/src/utils/get-config"
import { ProjectInfo, getProjectInfo } from "@/src/utils/get-project-info"
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
  verbose: z.boolean().optional().default(false),
})

export const build = new Command()
  .name("registry:build")
  .description("builds the registry")
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
  .option("-v, --verbose", "verbose output")
  .action(async (registry: string, opts) => {
    await buildRegistry({
      cwd: path.resolve(opts.cwd),
      registryFile: registry,
      outputDir: opts.output,
      verbose: opts.verbose,
    })
  })

async function buildRegistry(opts: z.infer<typeof buildOptionsSchema>) {
  try {
    const options = buildOptionsSchema.parse(opts)

    const [{ errors, resolvePaths, config }, projectInfo] = await Promise.all([
      preFlightRegistryBuild(options),
      getProjectInfo(options.cwd),
    ])

    if (errors[ERRORS.MISSING_CONFIG] || !config || !projectInfo) {
      logger.error(
        `A ${highlighter.info(
          "components.json"
        )} file is required to build the registry. Run ${highlighter.info(
          "shadcn init"
        )} to create one.`
      )
      logger.break()
      process.exit(1)
    }

    if (errors[ERRORS.BUILD_MISSING_REGISTRY_FILE] || !resolvePaths) {
      logger.error(
        `We could not find a registry file at ${highlighter.info(
          path.resolve(options.cwd, options.registryFile)
        )}.`
      )
      logger.break()
      process.exit(1)
    }

    const content = await fs.readFile(resolvePaths.registryFile, "utf-8")
    const result = registrySchema.safeParse(JSON.parse(content))

    if (!result.success) {
      logger.error(
        `Invalid registry file found at ${highlighter.info(
          resolvePaths.registryFile
        )}.`
      )
      logger.break()
      process.exit(1)
    }

    const buildSpinner = spinner("Building registry...")

    // Recursively resolve the registry items.
    const resolvedRegistry = await resolveRegistryItems(
      result.data,
      config,
      projectInfo
    )

    // Loop through the registry items and remove duplicates files i.e same path.
    for (const registryItem of resolvedRegistry.items) {
      if (!registryItem.files) {
        continue
      }

      registryItem.files = registryItem.files.filter(
        (file, index, self) =>
          index === self.findIndex((t) => t.path === file.path)
      )
    }

    for (const registryItem of resolvedRegistry.items) {
      if (!registryItem.files) {
        continue
      }

      buildSpinner.start(`Building ${registryItem.name}...`)

      // Add the schema to the registry item.
      registryItem["$schema"] =
        "https://ui.shadcn.com/schema/registry-item.json"

      for (const file of registryItem.files) {
        file["content"] = await fs.readFile(
          path.resolve(resolvePaths.cwd, file.path),
          "utf-8"
        )
      }

      const result = registryItemSchema.safeParse(registryItem)
      if (!result.success) {
        logger.error(
          `Invalid registry item found for ${highlighter.info(
            registryItem.name
          )}.`
        )
        continue
      }

      // Write the registry item to the output directory.
      await fs.writeFile(
        path.resolve(resolvePaths.outputDir, `${result.data.name}.json`),
        JSON.stringify(result.data, null, 2)
      )
    }

    // Copy registry.json to the output directory.
    await fs.copyFile(
      resolvePaths.registryFile,
      path.resolve(resolvePaths.outputDir, "registry.json")
    )

    buildSpinner.succeed("Building registry.")

    if (options.verbose) {
      spinner(
        `They registry has ${highlighter.info(
          resolvedRegistry.items.length.toString()
        )} items:`
      ).succeed()
      for (const item of resolvedRegistry.items) {
        logger.log(`  - ${item.name} (${highlighter.info(item.type)})`)
        for (const file of item.files ?? []) {
          logger.log(`    - ${file.path}`)
        }
      }
    }
  } catch (error) {
    logger.break()
    handleError(error)
  }
}

// This reads the registry and recursively resolves the file imports.
async function resolveRegistryItems(
  registry: z.infer<typeof registrySchema>,
  config: z.infer<typeof configSchema>,
  projectInfo: ProjectInfo
): Promise<z.infer<typeof registrySchema>> {
  for (const item of registry.items) {
    if (!item.files?.length) {
      continue
    }

    const results = await recursivelyResolveFileImports(
      item.files[0].path,
      config,
      projectInfo
    )

    if (results.files) {
      item.files.push(...results.files)
    }

    if (results.dependencies) {
      item.dependencies = item.dependencies
        ? item.dependencies.concat(results.dependencies)
        : results.dependencies
    }
  }

  return registry
}
