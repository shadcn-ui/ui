import path from "path"
import { runInit } from "@/src/commands/init"
import { preFlightAdd } from "@/src/preflights/preflight-add"
import { getRegistryItems, getShadcnRegistryIndex } from "@/src/registry/api"
import { DEPRECATED_COMPONENTS } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { isUniversalRegistryItem } from "@/src/registry/utils"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import { loadEnvFiles } from "@/src/utils/env-loader"
import * as ERRORS from "@/src/utils/errors"
import { createConfig, getConfig } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
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
  cssVariables: z.boolean(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "names, url or local path to component")
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
  .option(
    "--no-src-dir",
    "do not use the src directory when creating a new project."
  )
  .option("--css-variables", "use css variables for theming.", true)
  .option("--no-css-variables", "do not use css variables for theming.")
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
        ...opts,
      })

      await loadEnvFiles(options.cwd)

      let initialConfig = await getConfig(options.cwd)
      if (!initialConfig) {
        initialConfig = createConfig({
          style: "new-york",
          resolvedPaths: {
            cwd: options.cwd,
          },
        })
      }

      let hasNewRegistries = false
      if (components.length > 0) {
        const { config: updatedConfig, newRegistries } =
          await ensureRegistriesInConfig(components, initialConfig, {
            silent: options.silent,
            writeFile: false,
          })
        initialConfig = updatedConfig
        hasNewRegistries = newRegistries.length > 0
      }

      if (components.length > 0) {
        const [registryItem] = await getRegistryItems([components[0]], {
          config: initialConfig,
        })
        const itemType = registryItem?.type

        if (isUniversalRegistryItem(registryItem)) {
          await addComponents(components, initialConfig, options)
          return
        }

        if (
          !options.yes &&
          (itemType === "registry:style" || itemType === "registry:theme")
        ) {
          logger.break()
          const { confirm } = await prompts({
            type: "confirm",
            name: "confirm",
            message: highlighter.warn(
              `You are about to install a new ${itemType.replace(
                "registry:",
                ""
              )}. \nExisting CSS variables and components will be overwritten. Continue?`
            ),
          })
          if (!confirm) {
            logger.break()
            logger.log(`Installation cancelled.`)
            logger.break()
            process.exit(1)
          }
        }
      }

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options)
      }

      const projectInfo = await getProjectInfo(options.cwd)
      if (projectInfo?.tailwindVersion === "v4") {
        const deprecatedComponents = DEPRECATED_COMPONENTS.filter((component) =>
          options.components?.includes(component.name)
        )

        if (deprecatedComponents?.length) {
          logger.break()
          deprecatedComponents.forEach((component) => {
            logger.warn(highlighter.warn(component.message))
          })
          logger.break()
          process.exit(1)
        }
      }

      let { errors, config } = await preFlightAdd(options)

      // No components.json file. Prompt the user to run init.
      let initHasRun = false
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
          silent: options.silent || !hasNewRegistries,
          isNewProject: false,
          srcDir: options.srcDir,
          cssVariables: options.cssVariables,
          baseStyle: true,
          components: options.components,
        })
        initHasRun = true
      }

      let shouldUpdateAppIndex = false

      if (errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
        const { projectPath, template } = await createProject({
          cwd: options.cwd,
          force: options.overwrite,
          srcDir: options.srcDir,
          components: options.components,
        })
        if (!projectPath) {
          logger.break()
          process.exit(1)
        }
        options.cwd = projectPath

        if (template === "next-monorepo") {
          options.cwd = path.resolve(options.cwd, "apps/web")
          config = await getConfig(options.cwd)
        } else {
          config = await runInit({
            cwd: options.cwd,
            yes: true,
            force: true,
            defaults: false,
            skipPreflight: true,
            silent: !hasNewRegistries && options.silent,
            isNewProject: true,
            srcDir: options.srcDir,
            cssVariables: options.cssVariables,
            baseStyle: true,
            components: options.components,
          })
          initHasRun = true

          shouldUpdateAppIndex =
            options.components?.length === 1 &&
            !!options.components[0].match(/\/chat\/b\//)
        }
      }

      if (!config) {
        throw new Error(
          `Failed to read config at ${highlighter.info(options.cwd)}.`
        )
      }

      const { config: updatedConfig } = await ensureRegistriesInConfig(
        options.components,
        config,
        {
          silent: options.silent || hasNewRegistries,
        }
      )
      config = updatedConfig

      if (!initHasRun) {
        await addComponents(options.components, config, options)
      }

      // If we're adding a single component and it's from the v0 registry,
      // let's update the app/page.tsx file to import the component.
      if (shouldUpdateAppIndex) {
        await updateAppIndex(options.components[0], config)
      }
    } catch (error) {
      logger.break()
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>
) {
  const registryIndex = await getShadcnRegistryIndex()
  if (!registryIndex) {
    logger.break()
    handleError(new Error("Failed to fetch registry index."))
    return []
  }

  if (options.all) {
    return registryIndex
      .map((entry) => entry.name)
      .filter(
        (component) => !DEPRECATED_COMPONENTS.some((c) => c.name === component)
      )
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
      .filter(
        (entry) =>
          entry.type === "registry:ui" &&
          !DEPRECATED_COMPONENTS.some(
            (component) => component.name === entry.name
          )
      )
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
