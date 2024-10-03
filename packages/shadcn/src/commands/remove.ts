import { runInit } from "@/src/commands/init"
import { preFlightRemove } from "@/src/preflights/preflight-remove"
import { createProject } from "@/src/utils/create-project"
import * as ERRORS from "@/src/utils/errors"
import { type InstalledField } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { removeComponents } from "@/src/utils/remove-component"

import "@/src/utils/updaters/update-component-json"
import { removeComponentsSafely } from "@/src/utils/remove-safely"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"
import { resetComponentsJson } from "@/src/utils/updaters/update-component-json"

export const removeOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  recursive: z.boolean(),
  silent: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  srcDir: z.boolean().optional(),
  updateConfig: z.boolean().optional(),
})

export const remove = new Command()
  .name("remove")
  .description("removes a component from your project")
  .argument("[components...]", "the components to remove")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-r, --recursive", "remove component and all its dependencies", false)
  .option("-o, --overwrite", "overwrite existing files while creating .", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --silent", "mute output.", false)
  .option("-a, --all", "remove all installed components", false)

  .option(
    "--src-dir",
    "use the src directory when creating a new project.",
    false
  )
  .option(
    "--update-config",
    "update Configuration file and adds all pre installed components to components field",
    false
  )
  .action(async (components, opts) => {
    try {
      const options = removeOptionsSchema.parse({
        components,
        ...opts,
      })

      let { errors, config } = await preFlightRemove(options.cwd)

      // No component.json file. Prompt the user to run init.
      if (errors[ERRORS.MISSING_CONFIG]) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `You need to create a ${highlighter.info(
            "component.json"
          )} file to add components. Proceed?`,
          initial: true,
        })

        if (!proceed) {
          logger.break()
          process.exit(1)
        }

        config = await runInit({
          cwd: options.cwd,
          yes: true,
          force: true,
          defaults: false,
          skipPreflight: false,
          silent: true,
          isNewProject: false,
          srcDir: options.srcDir,
        })
      }

      if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
        const { projectPath } = await createProject({
          cwd: options.cwd,
          force: options.overwrite,
          srcDir: options.srcDir,
        })
        if (!projectPath) {
          logger.break()
          process.exit(1)
        }
        options.cwd = projectPath

        config = await runInit({
          cwd: options.cwd,
          yes: true,
          force: true,
          defaults: false,
          skipPreflight: true,
          silent: true,
          isNewProject: true,
          srcDir: options.srcDir,
        })
      }

      if (!config) {
        throw new Error(
          `Failed to read config at ${highlighter.info(options.cwd)}.`
        )
      }

      if (options.updateConfig) {
        let updatedConfig = await resetComponentsJson(config, options)
        if (updatedConfig) {
          config = updatedConfig
        }
      }
      if (options.all) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `are sure you want to ${highlighter.warn(
            "remove all"
          )} installed components`,
          initial: true,
        })

        if (!proceed) {
          logger.break()
          process.exit(1)
        }
      }
      if (!options.components?.length || options.all) {
        options.components = await promptForInstalledComponents(
          options,
          config.installed
        )
      }
      if (!options.recursive && !options.yes) {
        let choices = [
          {
            action: "yes",
            description:
              "do not remove recursively (no need for network connection)",
          },
          {
            action: "no",
            description: `remove recursively (requires network connection) ${highlighter.success(
              "recommended"
            )}`,
          },
          { action: "exit", description: "don't do anything" },
        ]
        const { proceed } = await prompts({
          type: "select",
          name: "proceed",
          message: `Only ${highlighter.warn(
            "remove "
          )} selected components,do not remove their dependencies  `,
          choices: choices.map((choice) => ({
            title: choice.action,
            value: choice.action,
            description: choice.description,
          })),
        })
        if (proceed === "exit") {
          logger.info("exiting...")
          process.exit(1)
        }
        if (proceed === "yes") {
          await removeComponentsSafely(
            options.components,
            config,
            options.silent
          )
          logger.break()
          process.exit(1)
        }
      }
      await removeComponents(options.components, config, options)
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

// show list of installed components
async function promptForInstalledComponents(
  options: z.infer<typeof removeOptionsSchema>,
  installed: InstalledField
) {
  if (!installed.ui || !installed.ui.length) {
    logger.warn("Nothing to remove from ui. Exiting.")
    logger.info("")
    process.exit(1)
  }

  const { components } = await prompts({
    type: "multiselect",
    name: "components",
    message: "Which components would you like to remove?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: installed.ui.map((entry: string) => ({
      title: entry,
      value: entry,
      selected: options.all ? true : options.components?.includes(entry),
    })),
  })
  if (!components?.length) {
    logger.warn("No components selected. Exiting.")
    logger.info("")
    process.exit(1)
  }

  const result = z.array(z.string()).safeParse(components)
  if (!result.success) {
    logger.error("")
    handleError(new Error("Something went wrong. Please try again."))
    return []
  }
  return result.data
}
