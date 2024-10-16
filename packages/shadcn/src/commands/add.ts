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
import deepmerge from "deepmerge"
import { merge } from "diff"
import prompts from "prompts"
import { z } from "zod"

import { resolveConfigPaths, type Config } from "../utils/get-config"

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  silent: z.boolean(),
  srcDir: z.boolean().optional(),
  registry: z.string().optional(),
  list: z.boolean().optional(),
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
  .option("-r, --registry <registry>", "registry name or url")
  .option("-l, --list", "list all available registries", false)
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
          url: options.registry,
        })
      }

      const registryConfig = await getRegistryConfig(config as any, options)

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(
          options,
          registryConfig.url
        )
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
          url: options.registry,
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

      await addComponents(options.components, registryConfig, options)

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

async function getRegistryConfig(
  config: Config,
  opts: z.infer<typeof addOptionsSchema>
): Promise<Config> {
  const { registry } = opts

  if (
    opts.list &&
    config.registries &&
    Object.keys(config.registries).length > 0
  ) {
    const { selectedRegistry } = await prompts({
      type: "select",
      name: "selectedRegistry",
      message: "Select a registry:",
      choices: [
        { title: "default", value: "default" },
        ...Object.entries(config.registries).map(([name, reg]) => ({
          title: name,
          value: name,
        })),
      ],
    })

    if (selectedRegistry === "default") {
      return { ...config }
    } else {
      return await resolveConfigPaths(opts.cwd, deepmerge(config, config.registries[selectedRegistry]) as Config)
    }
  }

  // If a registry is specified
  if (registry) {
    // If it's a URL, use it directly
    if (registry.startsWith("http://") || registry.startsWith("https://")) {
      // Find registry by url
      if (config.registries) {
        const registryConfig = Object.values(config.registries)?.find(
          (reg) => reg.url === registry
        )
        if (registryConfig) {
          return await resolveConfigPaths(opts.cwd, deepmerge(config, registryConfig) as Config)
        }
      }

      return { ...config, url: registry }
    }

    // If it's a named registry in the config, use that
    if (config.registries?.[registry]) {
      return await resolveConfigPaths(opts.cwd, deepmerge(config, config.registries[registry]) as Config)
    }

    // If it's neither a URL nor a known registry name, warn the user and fallback to the default config
    logger.warn(
      `Registry "${registry}" not found in configuration. Using the default registry.`
    )
    return { ...config }
  }

  // If no registry is specified and no registries in config, use the default config
  return { ...config }
}

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>,
  registryUrl?: string
) {
  const registryIndex = await getRegistryIndex(registryUrl)
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
