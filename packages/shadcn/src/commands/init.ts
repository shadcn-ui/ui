import { promises as fs } from "fs"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import {
  BASE_COLORS,
  getRegistryBaseColors,
  getRegistryItem,
  getRegistryStyles,
  isUrl,
} from "@/src/registry/api"
import { addComponents } from "@/src/utils/add-components"
import { TEMPLATES, createProject } from "@/src/utils/create-project"
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
import {
  getProjectConfig,
  getProjectInfo,
  getProjectTailwindVersionFromConfig,
} from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateTailwindContent } from "@/src/utils/updaters/update-tailwind-content"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

export const initOptionsSchema = z.object({
  cwd: z.string(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  isNewProject: z.boolean(),
  srcDir: z.boolean().optional(),
  cssVariables: z.boolean(),
  template: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return TEMPLATES[val as keyof typeof TEMPLATES]
        }
        return true
      },
      {
        message: "Invalid template. Please use 'next' or 'next-monorepo'.",
      }
    ),
  baseColor: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return BASE_COLORS.find((color) => color.name === val)
        }

        return true
      },
      {
        message: `Invalid base color. Please use '${BASE_COLORS.map(
          (color) => color.name
        ).join("', '")}'`,
      }
    ),
  style: z.string(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option(
    "-t, --template <template>",
    "the template to use. (next, next-monorepo)"
  )
  .option(
    "-b, --base-color <base-color>",
    "the base color to use. (neutral, gray, zinc, stone, slate)",
    undefined
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
  .option(
    "--no-src-dir",
    "do not use the src directory when creating a new project."
  )
  .option("--css-variables", "use css variables for theming.", true)
  .option("--no-css-variables", "do not use css variables for theming.")
  .action(async (components, opts) => {
    try {
      const options = initOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        isNewProject: false,
        components,
        style: "index",
        ...opts,
      })

      // We need to check if we're initializing with a new style.
      // We fetch the payload of the first item.
      // This is okay since the request is cached and deduped.
      if (components.length > 0 && isUrl(components[0])) {
        const item = await getRegistryItem(components[0], "")

        // Skip base color if style.
        // We set a default and let the style override it.
        if (item?.type === "registry:style") {
          options.baseColor = "neutral"
          options.style = item.extends ?? "index"
        }
      }

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
  let newProjectTemplate
  if (!options.skipPreflight) {
    const preflight = await preFlightInit(options)
    if (preflight.errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
      const { projectPath, template } = await createProject(options)
      if (!projectPath) {
        process.exit(1)
      }
      options.cwd = projectPath
      options.isNewProject = true
      newProjectTemplate = template
    }
    projectInfo = preflight.projectInfo
  } else {
    projectInfo = await getProjectInfo(options.cwd)
  }

  if (newProjectTemplate === "next-monorepo") {
    options.cwd = path.resolve(options.cwd, "apps/web")
    return await getConfig(options.cwd)
  }

  const projectConfig = await getProjectConfig(options.cwd, projectInfo)
  const config = projectConfig
    ? await promptForMinimalConfig(projectConfig, options)
    : await promptForConfig(await getConfig(options.cwd))

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

  // Write components.json.
  const componentSpinner = spinner(`Writing components.json.`).start()
  const targetPath = path.resolve(options.cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  componentSpinner.succeed()

  // Add components.
  const fullConfig = await resolveConfigPaths(options.cwd, config)
  const components = [
    ...(options.style === "none" ? [] : [options.style]),
    ...(options.components ?? []),
  ]
  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
    silent: options.silent,
    style: options.style,
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

async function promptForConfig(defaultConfig: Config | null = null) {
  const [styles, baseColors] = await Promise.all([
    getRegistryStyles(),
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
    {
      type: "select",
      name: "style",
      message: `Which ${highlighter.info("style")} would you like to use?`,
      choices: styles.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
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
  })
}

async function promptForMinimalConfig(
  defaultConfig: Config,
  opts: z.infer<typeof initOptionsSchema>
) {
  let style = defaultConfig.style
  let baseColor = opts.baseColor
  let cssVariables = defaultConfig.tailwind.cssVariables

  if (!opts.defaults) {
    const [styles, baseColors, tailwindVersion] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
      getProjectTailwindVersionFromConfig(defaultConfig),
    ])

    const options = await prompts([
      {
        type: tailwindVersion === "v4" ? null : "select",
        name: "style",
        message: `Which ${highlighter.info("style")} would you like to use?`,
        choices: styles.map((style) => ({
          title:
            style.name === "new-york" ? "New York (Recommended)" : style.label,
          value: style.name,
        })),
        initial: 0,
      },
      {
        type: opts.baseColor ? null : "select",
        name: "tailwindBaseColor",
        message: `Which color would you like to use as the ${highlighter.info(
          "base color"
        )}?`,
        choices: baseColors.map((color) => ({
          title: color.label,
          value: color.name,
        })),
      },
    ])

    style = options.style ?? "new-york"
    baseColor = options.tailwindBaseColor ?? baseColor
    cssVariables = opts.cssVariables
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
    iconLibrary: defaultConfig?.iconLibrary,
  })
}
