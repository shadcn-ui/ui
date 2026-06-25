import path from "path"
import { clearRegistryContext } from "@/src/registry/context"
import { getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { removeComponents } from "@/src/utils/remove-components"
import { Command } from "commander"
import { z } from "zod"

export const removeOptionsSchema = z.object({
  components: z.array(z.string()),
  cwd: z.string(),
  force: z.boolean(),
  dryRun: z.boolean(),
  silent: z.boolean(),
})

export const remove = new Command()
  .name("remove")
  .description("remove a component from your project")
  .argument("[components...]", "names or url of components to remove")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option(
    "-f, --force",
    "delete files that appear to be project infrastructure (e.g. globals.css, lib/utils.ts).",
    false
  )
  .option("--dry-run", "preview deletions without touching the filesystem.", false)
  .option("-s, --silent", "mute output.", false)
  .action(async (components, opts) => {
    try {
      const options = removeOptionsSchema.parse({
        components,
        ...opts,
        cwd: path.resolve(opts.cwd),
      })

      if (options.components.length === 0) {
        logger.error("Please specify components to remove.")
        process.exit(1)
      }

      const config = await getConfig(options.cwd)
      if (!config) {
        logger.error(
          `Configuration not found at ${highlighter.info(
            options.cwd
          )}. Run \`shadcn init\` first.`
        )
        process.exit(1)
      }

      await removeComponents(options.components, config, {
        force: options.force,
        dryRun: options.dryRun,
        silent: options.silent,
      })
    } catch (error) {
      logger.break()
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
