import path from "path"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { searchRegistries } from "@/src/registry/search"
import { validateRegistryConfigForItems } from "@/src/registry/validator"
import { rawConfigSchema } from "@/src/schema"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { createConfig, getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { Command } from "commander"
import fsExtra from "fs-extra"
import { z } from "zod"

const searchOptionsSchema = z.object({
  cwd: z.string(),
  query: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

// TODO: We're duplicating logic for shadowConfig here.
// Revisit and properly abstract this.

export const search = new Command()
  .name("search")
  .alias("list")
  .description("search items from registries")
  .argument(
    "<registries...>",
    "the registry names or urls to search items from. Names must be prefixed with @."
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-q, --query <query>", "query string")
  .option(
    "-l, --limit <number>",
    "maximum number of items to display per registry",
    "100"
  )
  .option("-o, --offset <number>", "number of items to skip", "0")
  .action(async (registries: string[], opts) => {
    try {
      const options = searchOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        query: opts.query,
        limit: opts.limit ? parseInt(opts.limit, 10) : undefined,
        offset: opts.offset ? parseInt(opts.offset, 10) : undefined,
      })

      await loadEnvFiles(options.cwd)

      // Start with a shadow config to support partial components.json.
      // Use createConfig to get proper default paths
      const defaultConfig = createConfig({
        style: "new-york",
        resolvedPaths: {
          cwd: options.cwd,
        },
      })
      let shadowConfig = configWithDefaults(defaultConfig)

      // Check if there's a components.json file (partial or complete).
      const componentsJsonPath = path.resolve(options.cwd, "components.json")
      if (fsExtra.existsSync(componentsJsonPath)) {
        const existingConfig = await fsExtra.readJson(componentsJsonPath)
        const partialConfig = rawConfigSchema.partial().parse(existingConfig)
        shadowConfig = configWithDefaults({
          ...defaultConfig,
          ...partialConfig,
        })
      }

      // Try to get the full config, but fall back to shadow config if it fails.
      let config = shadowConfig
      try {
        const fullConfig = await getConfig(options.cwd)
        if (fullConfig) {
          config = configWithDefaults(fullConfig)
        }
      } catch {
        // Use shadow config if getConfig fails (partial components.json).
      }

      const { config: updatedConfig, newRegistries } =
        await ensureRegistriesInConfig(
          registries.map((registry) => `${registry}/registry`),
          config,
          {
            silent: true,
            writeFile: false,
          }
        )
      if (newRegistries.length > 0) {
        config.registries = updatedConfig.registries
      }

      // Validate registries early for better error messages.
      validateRegistryConfigForItems(registries, config)

      // Use searchRegistries for both search and non-search cases
      const results = await searchRegistries(registries as `@${string}`[], {
        query: options.query,
        limit: options.limit,
        offset: options.offset,
        config,
      })

      console.log(JSON.stringify(results, null, 2))
      process.exit(0)
    } catch (error) {
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
