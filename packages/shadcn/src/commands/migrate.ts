import path from "path"
import { migrateIcons } from "@/src/migrations/migrate-icons"
import { migrateRadix } from "@/src/migrations/migrate-radix"
import { preFlightMigrate } from "@/src/preflights/preflight-migrate"
import * as ERRORS from "@/src/utils/errors"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"
import { z } from "zod"

export const migrations = [
  {
    name: "icons",
    description: "migrate your ui components to a different icon library.",
  },
  {
    name: "radix",
    description: "migrate to radix-ui.",
  },
] as const

export const migrateOptionsSchema = z.object({
  cwd: z.string(),
  list: z.boolean(),
  yes: z.boolean(),
  migration: z
    .string()
    .refine(
      (value) =>
        value && migrations.some((migration) => migration.name === value),
      {
        message:
          "You must specify a valid migration. Run `shadcn migrate --list` to see available migrations.",
      }
    )
    .optional(),
})

export const migrate = new Command()
  .name("migrate")
  .description("run a migration.")
  .argument("[migration]", "the migration to run.")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-l, --list", "list all migrations.", false)
  .option("-y, --yes", "skip confirmation prompt.", false)
  .action(async (migration, opts) => {
    try {
      const options = migrateOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        migration,
        list: opts.list,
        yes: opts.yes,
      })

      if (options.list || !options.migration) {
        logger.info("Available migrations:")
        for (const migration of migrations) {
          logger.info(`- ${migration.name}: ${migration.description}`)
        }
        return
      }

      if (!options.migration) {
        throw new Error(
          "You must specify a migration. Run `shadcn migrate --list` to see available migrations."
        )
      }

      let { errors, config } = await preFlightMigrate(options)

      if (
        errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] ||
        errors[ERRORS.MISSING_CONFIG]
      ) {
        throw new Error(
          "No `components.json` file found. Ensure you are at the root of your project."
        )
      }

      if (!config) {
        throw new Error(
          "Something went wrong reading your `components.json` file. Please ensure you have a valid `components.json` file."
        )
      }

      if (options.migration === "icons") {
        await migrateIcons(config)
      }

      if (options.migration === "radix") {
        await migrateRadix(config, { yes: options.yes })
      }
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
