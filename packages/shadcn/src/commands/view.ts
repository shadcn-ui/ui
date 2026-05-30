import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { validateRegistryConfigForItems } from "@/src/registry/validator"
import { rawConfigSchema } from "@/src/schema"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { Command } from "commander"
import fsExtra from "fs-extra"
import { z } from "zod"

const viewOptionsSchema = z.object({
  cwd: z.string(),
})

export const view = new Command()
  .name("view")
  .description("view items from the registry")
  .argument("<items...>", "the item names or URLs to view")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (items: string[], opts) => {
    try {
      const options = viewOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
      })

      await loadEnvFiles(options.cwd)

      // Start with a shadow config to support partial components.json.
      let shadowConfig = configWithDefaults({})

      // Check if there's a components.json file (partial or complete).
      const componentsJsonPath = path.resolve(options.cwd, "components.json")
      if (fsExtra.existsSync(componentsJsonPath)) {
        const existingConfig = await fsExtra.readJson(componentsJsonPath)
        const partialConfig = rawConfigSchema.partial().parse(existingConfig)
        shadowConfig = configWithDefaults(partialConfig)
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
        await ensureRegistriesInConfig(items, config, {
          silent: true,
          writeFile: false,
        })
      if (newRegistries.length > 0) {
        config.registries = updatedConfig.registries
      }

      // Validate registries early for better error messages.
      validateRegistryConfigForItems(items, config)

      const payload = await getRegistryItems(items, { config })
      console.log(JSON.stringify(payload, null, 2))
      process.exit(0)
    } catch (error) {
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
