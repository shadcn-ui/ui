import { runInit } from "@/src/commands/init"
import { preFlightRemove } from "@/src/preflights/preflight-remove"
import { createProject } from "@/src/utils/create-project"
import * as ERRORS from "@/src/utils/errors"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { removeComponents } from "@/src/utils/remove-component"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

import { type Config } from "../utils/get-config"

export const removeOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  recursive: z.boolean(),
  silent: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  srcDir: z.boolean().optional(),
})

export const remove = new Command()
  .name("remove")
  .description("removes a component from your project")
  .argument("[components...]", "the components to remove")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-r, --recursive", "remove component and all its dependencies", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
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
  .action(async (components, opts) => {
    try {
      const options = removeOptionsSchema.parse({
        components,
        ...opts,
      })

      let { errors, config } = await preFlightRemove(options.cwd)
      if (!config?.components.length) {
        logger.warn("No components intalled. Exiting.")
        logger.info("")
        process.exit(1)
      }
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
        if (!config) {
          throw new Error(
            `Failed to read config at ${highlighter.info(options.cwd)}.`
          )
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
      if (!options.components?.length) {
        options.components = await promptForInstalledComponents(options, config)
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
  config: Config
) {
  const { components } = await prompts({
    type: "multiselect",
    name: "components",
    message: "Which components would you like to remove?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: config.components.map((entry) => ({
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
