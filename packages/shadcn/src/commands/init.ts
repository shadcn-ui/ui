import { promises as fs } from "fs"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import * as ERRORS from "@/src/utils/errors"
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
import { getProjectConfig, getProjectInfo } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import {
  REGISTRY_URL,
  getDefaultConfig,
  getRegistryBaseColors,
  getRegistryStyles,
} from "@/src/utils/registry"
import { spinner } from "@/src/utils/spinner"
import { updateTailwindContent } from "@/src/utils/updaters/update-tailwind-content"
import { Command } from "commander"
import deepmerge from "deepmerge"
import prompts from "prompts"
import { z } from "zod"

import { getDifferences } from "../utils/is-different"

export const initOptionsSchema = z.object({
  cwd: z.string(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  isNewProject: z.boolean(),
  srcDir: z.boolean().optional(),
  url: z.string().optional(),
  name: z.string().optional(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-d, --defaults,", "use default configuration.", false)
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --silent", "mute output.", false)
  .option(
    "--src-dir",
    "use the src directory when creating a new project.",
    false
  )
  .option("-u, --url <url>", "registry URL", REGISTRY_URL)
  .option("-n, --name <name>", "registry name")
  .action(async (components, opts) => {
    try {
      const options = initOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        isNewProject: false,
        components,
        ...opts,
      })

      await runInit(options)

      logger.log(
        `${highlighter.success(
          "Success!"
        )} Project initialization completed.\nYou may now add components.`
      )
      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

export async function runInit(
  options: z.infer<typeof initOptionsSchema> & {
    skipPreflight?: boolean
  }
) {
  let projectInfo
  if (!options.skipPreflight) {
    const preflight = await preFlightInit(options)
    if (preflight.errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      const { projectPath } = await createProject(options)
      if (!projectPath) {
        process.exit(1)
      }
      options.cwd = projectPath
      options.isNewProject = true
    }
    projectInfo = preflight.projectInfo
  } else {
    projectInfo = await getProjectInfo(options.cwd)
  }

  const res = await getProjectConfig(options.cwd, projectInfo)
  let projectConfig = res?.[0]
  const isNew = res?.[1]

  let config: Config
  if (projectConfig) {
    if (isNew || options.url === projectConfig.url) {
      projectConfig = await getDefaultConfig(projectConfig, options.url)
      // Updating top-level config
      config = await promptForMinimalConfig(projectConfig, options)
    } else {
      // Updating nested registry config
      config = await promptForNestedRegistryConfig(projectConfig, options)
    }
  } else {
    // New configuration
    config = await promptForConfig(await getConfig(options.cwd), options.url)
  }

  if (!options.yes) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to ${highlighter.info(
        "components.json"
      )}. Proceed?`,
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  if (config.url === REGISTRY_URL) {
    delete config.url
  }

  // Write components.json.
  const componentSpinner = spinner(`Writing components.json.`).start()
  const targetPath = path.resolve(options.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  componentSpinner.succeed()

  let registryConfig = config
  let registryName: string | undefined
  const id = options.name ?? options.url
  if (id) {
    const registry = config.registries?.[id]
    if (registry) {
      registryName = id
      registryConfig = deepmerge(config, registry) as any
    }
  }

  // Add components.
  const fullConfig = await resolveConfigPaths(options.cwd, registryConfig)
  const components = ["index", ...(options.components || [])]
  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
    silent: options.silent,
    registryName,
    isNewProject:
      options.isNewProject || projectInfo?.framework.name === "next-app",
  })

  // If a new project is using src dir, let's update the tailwind content config.
  // TODO: Handle this per framework.
  if (options.isNewProject && options.srcDir) {
    await updateTailwindContent(
      ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
      fullConfig,
      {
        silent: options.silent,
      }
    )
  }

  return fullConfig
}

async function promptForConfig(
  defaultConfig: Config | null = null,
  registryUrl?: string
) {
  const [styles, baseColors] = await Promise.all([
    getRegistryStyles(registryUrl),
    getRegistryBaseColors(),
  ])

  logger.info("")
  const options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${highlighter.info(
        "TypeScript"
      )} (recommended)?`,
      initial: defaultConfig?.tsx ?? true,
      active: "yes",
      inactive: "no",
    },
    ...(styles.length > 1
      ? [
          {
            type: "select",
            name: "style",
            message: `Which ${highlighter.info(
              "style"
            )} would you like to use?`,
            choices: styles.map((style) => ({
              title: style.label,
              value: style.name,
            })),
          },
        ]
      : ([] as any)),
    {
      type: "select",
      name: "tailwindBaseColor",
      message: `Which color would you like to use as the ${highlighter.info(
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
      message: `Where is your ${highlighter.info("global CSS")} file?`,
      initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    },
    {
      type: "toggle",
      name: "tailwindCssVariables",
      message: `Would you like to use ${highlighter.info(
        "CSS variables"
      )} for theming?`,
      initial: defaultConfig?.tailwind.cssVariables ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "text",
      name: "tailwindPrefix",
      message: `Are you using a custom ${highlighter.info(
        "tailwind prefix eg. tw-"
      )}? (Leave blank if not)`,
      initial: "",
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlighter.info(
        "tailwind.config.js"
      )} located?`,
      initial: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlighter.info(
        "components"
      )}:`,
      initial: defaultConfig?.aliases["components"] ?? DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlighter.info("utils")}:`,
      initial: defaultConfig?.aliases["utils"] ?? DEFAULT_UTILS,
    },
    {
      type: "toggle",
      name: "rsc",
      message: `Are you using ${highlighter.info("React Server Components")}?`,
      initial: defaultConfig?.rsc ?? true,
      active: "yes",
      inactive: "no",
    },
  ])

  return rawConfigSchema.parse({
    $schema: "https://ui.shadcn.com/schema.json",
    url: options.url,
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
      // TODO: fix this.
      lib: options.components.replace(/\/components$/, "lib"),
      hooks: options.components.replace(/\/components$/, "hooks"),
    },
  }) as Config
}

async function promptForMinimalConfig(
  defaultConfig: Config,
  opts: z.infer<typeof initOptionsSchema>
) {
  let style = defaultConfig.style
  let baseColor = defaultConfig.tailwind.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!opts.defaults) {
    const [styles, baseColors] = await Promise.all([
      getRegistryStyles(opts.url),
      getRegistryBaseColors(),
    ])

    const options = await prompts([
      ...(styles.length > 1
        ? [
            {
              type: "select",
              name: "style",
              message: `Which ${highlighter.info(
                "style"
              )} would you like to use?`,
              initial: styles.findIndex((s) => s.name === style),
              choices: styles.map((style) => ({
                title: style.label,
                value: style.name,
              })),
            },
          ]
        : ([] as any)),
      {
        type: "select",
        name: "tailwindBaseColor",
        message: `Which color would you like to use as the ${highlighter.info(
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
        message: `Would you like to use ${highlighter.info(
          "CSS variables"
        )} for theming?`,
        initial: defaultConfig?.tailwind.cssVariables,
        active: "yes",
        inactive: "no",
      },
    ])

    style = options.style ?? style
    baseColor = options.tailwindBaseColor ?? baseColor
    cssVariables = options.tailwindCssVariables ?? cssVariables
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
    url: opts.url,
    registries: defaultConfig?.registries,
  }) as Config
}

async function promptForNestedRegistryConfig(
  defaultConfig: Config,
  opts: z.infer<typeof initOptionsSchema>
) {
  const nestedDefaultConfig = await getDefaultConfig(
    { ...defaultConfig },
    opts.url
  )

  let newConfig = await promptForMinimalConfig(nestedDefaultConfig, opts)

  const relevantFields = ["style", "tailwind", "rsc", "tsx", "aliases"]

  const defaultConfigSubset = Object.fromEntries(
    relevantFields.map((field) => [field, defaultConfig[field as keyof Config]])
  ) as any

  const newConfigSubset = Object.fromEntries(
    relevantFields.map((field) => [field, newConfig[field as keyof Config]])
  )

  const registryConfig: Config = getDifferences(
    newConfigSubset,
    defaultConfigSubset
  )

  registryConfig.url = opts.url

  const { resolvedPaths, ...topLevelConfig } = defaultConfig

  return {
    ...topLevelConfig,
    registries: {
      ...defaultConfig.registries,
      [opts.name ?? opts.url!]: registryConfig,
    },
  } as Config
}
