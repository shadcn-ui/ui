import { promises as fs } from "fs"
import path from "path"
import {
  DEFAULT_COMPONENTS,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UTILS,
  getConfig,
  rawConfigSchema,
  resolveConfigPaths,
  type Config,
} from "@/src/utils/get-config"
import { getProjectConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { preFlight } from "@/src/utils/preflight"
import {
  getRegistryBaseColors,
  getRegistryStyles,
  registryResolveItemsTree,
} from "@/src/utils/registry"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import { updateDestinations } from "@/src/utils/updaters/update-destinations"
import { updateTailwindConfig } from "@/src/utils/updaters/update-tailwind-config"
import { updateTailwindCss } from "@/src/utils/updaters/update-tailwind-css"
import { Command } from "commander"
import { cyan, green } from "kleur/colors"
import ora from "ora"
import prompts from "prompts"
import { z } from "zod"

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
})

type InitOptions = z.infer<typeof initOptionsSchema>

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-d, --defaults,", "use default configuration.", false)
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)
      const cwd = path.resolve(options.cwd)

      logger.info("")
      const { errors } = await preFlight(cwd, options)

      if (Object.keys(errors).length > 0) {
        logger.error(
          `Something went wrong during the preflight check. Please check the output above for more details.`
        )
        logger.error("")
        process.exit(1)
      }

      const projectConfig = await getProjectConfig(cwd)
      const config = projectConfig
        ? // If we can determine the project config, prompt for minimal config.
          await promptForMinimalConfig(projectConfig, options)
        : // Otherwise, prompt for full config.
          await promptForConfig(await getConfig(cwd))

      if (!opts.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Write configuration to ${cyan(
            "components.json"
          )}. Proceed?`,
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      // Write to file.
      if (!opts.force && !opts.defaults) {
        logger.info("")
      }
      const spinner = ora(`Writing components.json.`).start()
      const targetPath = path.resolve(cwd, "components.json")
      await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
      spinner.succeed()

      const fullConfig = await resolveConfigPaths(cwd, config)

      await runInit(fullConfig)

      logger.info("")
      logger.info(
        `${green(
          "Success!"
        )} Project initialization completed.\nYou may now add components.`
      )
      logger.info("")
    } catch (error) {
      logger.error("")
      handleError(error)
    }
  })

export async function promptForConfig(defaultConfig: Config | null = null) {
  const [styles, baseColors] = await Promise.all([
    getRegistryStyles(),
    getRegistryBaseColors(),
  ])

  logger.info("")
  const options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${cyan("TypeScript")} (recommended)?`,
      initial: defaultConfig?.tsx ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "select",
      name: "style",
      message: `Which ${cyan("style")} would you like to use?`,
      choices: styles.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: "select",
      name: "tailwindBaseColor",
      message: `Which color would you like to use as the ${cyan(
        "base color"
      )}?`,
      choices: baseColors.map((color) => ({
        title: color.label,
        value: color.name,
      })),
    },
    {
      type: "text",
      name: "tailwindCss",
      message: `Where is your ${cyan("global CSS")} file?`,
      initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    },
    {
      type: "toggle",
      name: "tailwindCssVariables",
      message: `Would you like to use ${cyan("CSS variables")} for theming?`,
      initial: defaultConfig?.tailwind.cssVariables ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "text",
      name: "tailwindPrefix",
      message: `Are you using a custom ${cyan(
        "tailwind prefix eg. tw-"
      )}? (Leave blank if not)`,
      initial: "",
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${cyan("tailwind.config.js")} located?`,
      initial: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${cyan("components")}:`,
      initial: defaultConfig?.aliases["components"] ?? DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${cyan("utils")}:`,
      initial: defaultConfig?.aliases["utils"] ?? DEFAULT_UTILS,
    },
    {
      type: "toggle",
      name: "rsc",
      message: `Are you using ${cyan("React Server Components")}?`,
      initial: defaultConfig?.rsc ?? true,
      active: "yes",
      inactive: "no",
    },
  ])

  return rawConfigSchema.parse({
    $schema: "https://ui.shadcn.com/schema.json",
    style: options.style,
    tailwind: {
      config: options.tailwindConfig,
      css: options.tailwindCss,
      baseColor: options.tailwindBaseColor,
      cssVariables: options.tailwindCssVariables,
      prefix: options.tailwindPrefix,
    },
    rsc: options.rsc,
    tsx: options.typescript,
    aliases: {
      utils: options.utils,
      components: options.components,
    },
  })
}

export async function promptForMinimalConfig(
  defaultConfig: Config,
  opts: InitOptions
) {
  let style = defaultConfig.style
  let baseColor = defaultConfig.tailwind.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!opts.defaults) {
    const [styles, baseColors] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
    ])

    logger.info("")
    const options = await prompts([
      {
        type: "select",
        name: "style",
        message: `Which ${cyan("style")} would you like to use?`,
        choices: styles.map((style) => ({
          title: style.label,
          value: style.name,
        })),
        initial: styles.findIndex((s) => s.name === style),
      },
      {
        type: "select",
        name: "tailwindBaseColor",
        message: `Which color would you like to use as the ${cyan(
          "base color"
        )}?`,
        choices: baseColors.map((color) => ({
          title: color.label,
          value: color.name,
        })),
      },
      {
        type: "toggle",
        name: "tailwindCssVariables",
        message: `Would you like to use ${cyan("CSS variables")} for theming?`,
        initial: defaultConfig?.tailwind.cssVariables,
        active: "yes",
        inactive: "no",
      },
    ])

    style = options.style
    baseColor = options.tailwindBaseColor
    cssVariables = options.tailwindCssVariables
  }

  return rawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    tailwind: {
      ...defaultConfig?.tailwind,
      baseColor,
      cssVariables,
    },
    rsc: defaultConfig?.rsc,
    tsx: defaultConfig?.tsx,
    aliases: defaultConfig?.aliases,
  })
}

export async function runInit(config: Config) {
  await updateDestinations(config)

  const initializersSpinner = ora(`Initializing project.`)?.start()
  const tree = await registryResolveItemsTree(["index"], config)

  if (!tree) {
    initializersSpinner?.fail()
    logger.error(`Something went wrong during the initialization process.`)
    process.exit(1)
  }

  await updateTailwindConfig(tree.tailwind?.config, config)
  await updateTailwindCss(tree.cssVars, config)
  initializersSpinner?.succeed()

  const dependenciesSpinner = ora(`Installing dependencies.`)?.start()
  // await updateRegistryDependencies(tree.registryDependencies, config)
  await updateDependencies(tree.dependencies, config)
  dependenciesSpinner?.succeed()
}
