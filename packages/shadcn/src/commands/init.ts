import { promises as fs } from "fs"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import {
  getRegistryBaseColors,
  getRegistryItems,
  getRegistryStyles,
} from "@/src/registry/api"
import { buildUrlAndHeadersForRegistryItem } from "@/src/registry/builder"
import { configWithDefaults } from "@/src/registry/config"
import { BASE_COLORS, BUILTIN_REGISTRIES } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { rawConfigSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { TEMPLATES, createProject } from "@/src/utils/create-project"
import { loadEnvFiles } from "@/src/utils/env-loader"
import * as ERRORS from "@/src/utils/errors"
import {
  FILE_BACKUP_SUFFIX,
  createFileBackup,
  deleteFileBackup,
  restoreFileBackup,
} from "@/src/utils/file-helper"
import {
  DEFAULT_COMPONENTS,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UTILS,
  createConfig,
  getConfig,
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
import { initMonorepoProject } from "@/src/utils/init-monorepo"
import { logger } from "@/src/utils/logger"
import {
  buildInitUrl,
  getShadcnCreateUrl,
  getShadcnInitUrl,
  handlePresetOption,
} from "@/src/utils/presets"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { spinner } from "@/src/utils/spinner"
import { updateTailwindContent } from "@/src/utils/updaters/update-tailwind-content"
import { Command } from "commander"
import deepmerge from "deepmerge"
import fsExtra from "fs-extra"
import open from "open"
import prompts from "prompts"
import { z } from "zod"

process.on("exit", (code) => {
  const filePath = path.resolve(process.cwd(), "components.json")

  // Delete backup if successful.
  if (code === 0) {
    return deleteFileBackup(filePath)
  }

  // Restore backup if error.
  return restoreFileBackup(filePath)
})

export const initOptionsSchema = z.object({
  cwd: z.string(),
  name: z.string().optional(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  isNewProject: z.boolean(),
  srcDir: z.boolean().optional(),
  cssVariables: z.boolean(),
  rtl: z.boolean().optional(),
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
        message:
          "Invalid template. Please use 'next', 'vite', 'start' or 'next-monorepo'.",
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
  installStyleIndex: z.boolean(),
  // Config from registry:base item to merge into components.json.
  registryBaseConfig: rawConfigSchema.deepPartial().optional(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .argument("[components...]", "names, url or local path to component")
  .option(
    "-t, --template <template>",
    "the template to use. (next, start, vite, next-monorepo)"
  )
  .option(
    "-b, --base-color <base-color>",
    "the base color to use. (neutral, gray, zinc, stone, slate)",
    undefined
  )
  .option("-p, --preset [name]", "use a preset configuration")
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
  .option("--no-base-style", "do not install the base shadcn style.")
  .option("--rtl", "enable RTL support.", false)
  .action(async (components, opts) => {
    try {
      // Apply defaults when --defaults flag is set.
      if (opts.defaults) {
        opts.template = opts.template || "next"
        opts.baseColor = opts.baseColor || "neutral"
      }

      // Validate template early.
      if (opts.template && !TEMPLATES[opts.template as keyof typeof TEMPLATES]) {
        logger.break()
        logger.error(
          `Invalid template: ${highlighter.info(
            opts.template
          )}. Use ${Object.keys(TEMPLATES)
            .map((t) => highlighter.info(t))
            .join(", ")}.`
        )
        logger.break()
        process.exit(1)
      }

      // Run early preflight check for existing components.json.
      const cwd = path.resolve(opts.cwd)
      if (
        fsExtra.existsSync(path.resolve(cwd, "components.json")) &&
        !opts.force
      ) {
        logger.break()
        logger.error(
          `A ${highlighter.info(
            "components.json"
          )} file already exists at ${highlighter.info(
            cwd
          )}.\nTo start over, remove the ${highlighter.info(
            "components.json"
          )} file and run ${highlighter.info("init")} again.`
        )
        logger.break()
        process.exit(1)
      }

      // Handle --preset option.
      if (opts.preset !== undefined) {
        const presetResult = await handlePresetOption(
          opts.preset === true ? true : opts.preset,
          opts.rtl ?? false,
          "init"
        )

        if (!presetResult) {
          process.exit(0)
        }

        let initUrl: string
        let baseColor: string

        if ("_isUrl" in presetResult) {
          const url = new URL(presetResult.url)
          if (opts.rtl) {
            url.searchParams.set("rtl", "true")
          }
          initUrl = url.toString()
          baseColor = url.searchParams.get("baseColor") ?? "neutral"
        } else {
          initUrl = buildInitUrl(presetResult, opts.rtl ?? false)
          baseColor = presetResult.baseColor
        }

        // Prepend the preset URL to the components list.
        components = [initUrl, ...components]

        // Set baseColor from preset if not explicitly provided.
        if (!opts.baseColor) {
          opts.baseColor = baseColor
        }
      }

      // Prompt for preset when no preset, no components, and no defaults.
      if (
        opts.preset === undefined &&
        components.length === 0 &&
        !opts.defaults
      ) {
        // Determine template for the create URL.
        const hasPackageJson = fsExtra.existsSync(
          path.resolve(cwd, "package.json")
        )

        if (!hasPackageJson) {
          // New project: prompt for template (skip if already set via -t flag).
          const { template } = await prompts({
            type: opts.template ? null : "select",
            name: "template",
            message: "Which template would you like to use?",
            choices: [
              { title: "Next.js", value: "next" },
              { title: "Next.js (Monorepo)", value: "next-monorepo" },
              { title: "Vite", value: "vite" },
              { title: "TanStack Start", value: "start" },
            ],
          })

          if (template) {
            opts.template = template
          }

          if (!opts.template) {
            process.exit(0)
          }
        }

        // For existing projects, detect framework for the create URL.
        if (hasPackageJson && !opts.template) {
          const frameworkTemplateMap: Record<string, string> = {
            "next-app": "next",
            "next-pages": "next",
            vite: "vite",
            "tanstack-start": "start",
          }
          const projectInfo = await getProjectInfo(cwd)
          if (projectInfo) {
            opts.template = frameworkTemplateMap[projectInfo.framework.name]
          }
        }

        // Build create URL with template param.
        const createUrl = getShadcnCreateUrl({
          command: "init",
          ...(opts.rtl && { rtl: "true" }),
          ...(opts.template && { template: opts.template }),
        })

        const { preset } = await prompts({
          type: "select",
          name: "preset",
          message: "Which preset would you like to use?",
          choices: [
            {
              title: "Build your own",
              description: "Build a custom preset on ui.shadcn.com",
              value: "create",
            },
            {
              title: "Radix UI",
              description: "Nova / Lucide / Geist",
              value: "radix",
            },
            {
              title: "Base UI",
              description: "Nova / Lucide / Geist",
              value: "base",
            },
          ],
        })

        if (!preset) {
          process.exit(0)
        }

        if (preset === "create") {
          logger.info(
            `\nOpening ${highlighter.info(createUrl)} in your browser...\n`
          )
          await open(createUrl)
          process.exit(0)
        }

        // User chose a default base (radix or base).
        const initUrl = buildInitUrl(
          {
            base: preset,
            style: "nova",
            baseColor: "neutral",
            theme: "neutral",
            iconLibrary: "lucide",
            font: "geist",
            rtl: opts.rtl ?? false,
            menuAccent: "subtle",
            menuColor: "default",
            radius: "default",
          },
          opts.rtl ?? false
        )
        components = [initUrl, ...components]
        opts.baseColor = "neutral"
      }

      const options = initOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        isNewProject: false,
        components,
        ...opts,
        installStyleIndex: opts.baseStyle,
      })

      await loadEnvFiles(options.cwd)

      // We need to check if we're initializing with a new style.
      // This will allow us to determine if we need to install the base style.
      // And if we should prompt the user for a base color.
      if (components.length > 0) {
        // We don't know the full config at this point.
        // So we'll use a shadow config to fetch the first item.
        let shadowConfig = configWithDefaults(
          createConfig({
            resolvedPaths: {
              cwd: options.cwd,
            },
          })
        )

        // Check if there's a components.json file.
        // If so, we'll merge with our shadow config.
        const componentsJsonPath = path.resolve(options.cwd, "components.json")
        if (fsExtra.existsSync(componentsJsonPath)) {
          const existingConfig = await fsExtra.readJson(componentsJsonPath)
          const config = rawConfigSchema.partial().parse(existingConfig)
          const baseConfig = createConfig({
            resolvedPaths: {
              cwd: options.cwd,
            },
          })
          shadowConfig = configWithDefaults({
            ...config,
            resolvedPaths: {
              ...baseConfig.resolvedPaths,
              cwd: options.cwd,
            },
          })

          // Since components.json might not be valid at this point.
          // Temporarily rename components.json to allow preflight to run.
          // We'll rename it back after preflight.
          createFileBackup(componentsJsonPath)
        }

        // Ensure all registries used in components are configured.
        const { config: updatedConfig } = await ensureRegistriesInConfig(
          components,
          shadowConfig,
          {
            silent: true,
            writeFile: false,
          }
        )
        shadowConfig = updatedConfig

        // This forces a shadowConfig validation early in the process.
        buildUrlAndHeadersForRegistryItem(components[0], shadowConfig)

        const [item] = await getRegistryItems([components[0]], {
          config: shadowConfig,
        })

        // Set options from registry:base.
        if (item?.type === "registry:base") {
          if (item.config) {
            // Merge config values into shadowConfig.
            shadowConfig = configWithDefaults(
              deepmerge(shadowConfig, item.config)
            )
            // Store config to be merged into components.json later.
            options.registryBaseConfig = item.config
          }
          options.installStyleIndex =
            item.extends === "none" ? false : options.installStyleIndex
        }

        if (item?.type === "registry:style") {
          // Set a default base color so we're not prompted.
          // The style will extend or override it.
          options.baseColor = "neutral"

          // If the style extends none, we don't want to install the base style.
          options.installStyleIndex =
            item.extends === "none" ? false : options.installStyleIndex
        }
      }

      // If --no-base-style, we don't want to prompt for a base color either.
      if (!options.installStyleIndex) {
        options.baseColor = "neutral"
      }

      await runInit(options)

      logger.log(
        `${highlighter.success(
          "Success!"
        )} Project initialization completed.\nYou may now add components.`
      )

      // We need when running with custom cwd.
      deleteFileBackup(path.resolve(options.cwd, "components.json"))
      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    } finally {
      clearRegistryContext()
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
      // Re-get project info for the newly created project.
      projectInfo = await getProjectInfo(options.cwd)
    } else {
      projectInfo = preflight.projectInfo
    }
  } else {
    projectInfo = await getProjectInfo(options.cwd)
  }

  if (newProjectTemplate === "next-monorepo") {
    // Prompt for base color if not set.
    if (!options.baseColor) {
      const baseColors = await getRegistryBaseColors()
      const { tailwindBaseColor } = await prompts({
        type: "select",
        name: "tailwindBaseColor",
        message: "Which color would you like to use as the base color?",
        choices: baseColors.map((color) => ({
          title: color.label,
          value: color.name,
        })),
      })
      options.baseColor = tailwindBaseColor
    }

    const components = [
      ...(options.installStyleIndex ? ["index"] : []),
      ...(options.components ?? []),
    ]

    return await initMonorepoProject({
      projectPath: options.cwd,
      components,
      installStyleIndex: options.installStyleIndex,
      baseColor: options.baseColor ?? "neutral",
      registryBaseConfig: options.registryBaseConfig,
      rtl: options.rtl ?? false,
      silent: options.silent,
    })
  }

  const projectConfig = await getProjectConfig(options.cwd, projectInfo)

  let config = projectConfig
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

  // Prepare the list of components to be added.
  const components = [
    // "index" is the default shadcn style.
    // Why index? Because when style is true, we read style from components.json and fetch that.
    // i.e new-york from components.json then fetch /styles/new-york/index.
    // TODO: Fix this so that we can extend any style i.e --style=new-york.
    ...(options.installStyleIndex ? ["index"] : []),
    ...(options.components ?? []),
  ]

  // Ensure registries are configured for the components we're about to add.
  const fullConfigForRegistry = await resolveConfigPaths(options.cwd, config)
  const { config: configWithRegistries } = await ensureRegistriesInConfig(
    components,
    fullConfigForRegistry,
    {
      silent: true,
    }
  )

  // Update config with any new registries found.
  if (configWithRegistries.registries) {
    config.registries = configWithRegistries.registries
  }

  const componentSpinner = spinner(`Writing components.json.`).start()
  const targetPath = path.resolve(options.cwd, "components.json")
  const backupPath = `${targetPath}${FILE_BACKUP_SUFFIX}`

  // Merge and keep registries at the end.
  const mergeConfig = (base: typeof config, override: object) => {
    const { registries, ...merged } = deepmerge(base, override)
    return { ...merged, registries } as typeof config
  }

  // Merge with backup config if it exists.
  if (fsExtra.existsSync(backupPath)) {
    const existingConfig = await fsExtra.readJson(backupPath)
    if (options.force) {
      // With --force, only preserve registries from existing config.
      if (existingConfig.registries) {
        config.registries = {
          ...existingConfig.registries,
          ...(config.registries || {}),
        }
      }
    } else {
      config = mergeConfig(existingConfig, config)
    }
  }

  // Merge config from registry:base item.
  if (options.registryBaseConfig) {
    config = mergeConfig(config, options.registryBaseConfig)
  }

  // Ensure rtl is set from CLI option (takes priority over registryBaseConfig).
  if (options.rtl !== undefined) {
    config.rtl = options.rtl
  }

  // Make sure to filter out built-in registries.
  // TODO: fix this in ensureRegistriesInConfig.
  config.registries = Object.fromEntries(
    Object.entries(config.registries || {}).filter(
      ([key]) => !Object.keys(BUILTIN_REGISTRIES).includes(key)
    )
  )

  // Write components.json.
  await fs.writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf8")
  componentSpinner.succeed()

  // Add components.
  const fullConfig = await resolveConfigPaths(options.cwd, config)
  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
    silent: options.silent,
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
  let iconLibrary = defaultConfig.iconLibrary ?? "lucide"

  if (!opts.defaults) {
    const [styles, baseColors, tailwindVersion] = await Promise.all([
      getRegistryStyles(),
      getRegistryBaseColors(),
      getProjectTailwindVersionFromConfig(defaultConfig),
    ])

    const options = await prompts([
      {
        // Skip style prompt if using Tailwind v4 or style is already set in config.
        type: tailwindVersion === "v4" || style ? null : "select",
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

    style = options.style ?? style ?? "new-york"
    baseColor = options.tailwindBaseColor ?? baseColor
  }

  // Always respect the explicit --css-variables / --no-css-variables flag.
  cssVariables = opts.cssVariables

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
    iconLibrary,
    rtl: opts.rtl ?? defaultConfig?.rtl ?? false,
    aliases: defaultConfig?.aliases,
  })
}
