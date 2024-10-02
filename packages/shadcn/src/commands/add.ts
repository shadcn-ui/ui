import path from "path"
import { runInit } from "@/src/commands/init"
import { preFlightAdd } from "@/src/preflights/preflight-add"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import * as ERRORS from "@/src/utils/errors"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { getRegistryIndex } from "@/src/utils/registry"
import { updateAppIndex } from "@/src/utils/update-app-index"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  silent: z.boolean(),
  srcDir: z.boolean().optional(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .option("-s, --silent", "mute output.", false)
  .option(
    "--src-dir",
    "use the src directory when creating a new project.",
    false
  )
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
        ...opts,
      })

      // Confirm if user is installing themes.
      // For now, we assume a theme is prefixed with "theme-".
      const isTheme = options.components?.some((component) =>
        component.includes("theme-")
      )
      if (!options.yes && isTheme) {
        logger.break()
        const { confirm } = await prompts({
          type: "confirm",
          name: "confirm",
          message: highlighter.warn(
            "You are about to install a new theme. \nExisting CSS variables will be overwritten. Continue?"
          ),
        })
        if (!confirm) {
          logger.break()
          logger.log("Theme installation cancelled.")
          logger.break()
          process.exit(1)
        }
      }

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options)
      }

      let { errors, config } = await preFlightAdd(options)

      // No components.json file. Prompt the user to run init.
      if (errors[ERRORS.MISSING_CONFIG]) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `You need to create a ${highlighter.info(
            "components.json"
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

      let shouldUpdateAppIndex = false
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

        shouldUpdateAppIndex =
          options.components?.length === 1 &&
          !!options.components[0].match(/\/chat\/b\//)
      }

      if (!config) {
        throw new Error(
          `Failed to read config at ${highlighter.info(options.cwd)}.`
        )
      }

      await addComponents(options.components, config, options)

      // If we're adding a single component and it's from the v0 registry,
      // let's update the app/page.tsx file to import the component.
      if (shouldUpdateAppIndex) {
        await updateAppIndex(options.components[0], config)
      }
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>
) {
  const registryIndex = await getRegistryIndex()
  if (!registryIndex) {
    logger.break()
    handleError(new Error("Failed to fetch registry index."))
    return []
  }

  if (options.all) {
    return registryIndex.map((entry) => entry.name)
  }

  if (options.components?.length) {
    return options.components
  }

  const { components } = await prompts({
    type: "multiselect",
    name: "components",
    message: "Which components would you like to add?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: registryIndex
      .filter((entry) => entry.type === "registry:ui")
      .map((entry) => ({
        title: entry.name,
        value: entry.name,
        selected: options.all ? true : options.components?.includes(entry.name),
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
