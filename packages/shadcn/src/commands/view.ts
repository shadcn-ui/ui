import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { validateRegistryConfigForItems } from "@/src/registry/validator"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { Command } from "commander"
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

      let config = await getConfig(options.cwd)
      config = configWithDefaults(config || undefined)

      validateRegistryConfigForItems(items, config)

      const payload = await getRegistryItems(items, config)
      console.log(JSON.stringify(payload, null, 2))
    } catch (error) {
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
