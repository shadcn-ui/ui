import { promises as fs } from "fs"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import { getRegistryBaseColors, getRegistryStyles } from "@/src/registry/api"
import { BUILTIN_REGISTRIES } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { isUrl } from "@/src/registry/utils"
import { rawConfigSchema } from "@/src/schema"
import { getTemplateForFramework, templates } from "@/src/templates/index"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
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
import { logger } from "@/src/utils/logger"
import {
  DEFAULT_PRESETS,
  promptForPreset,
  resolveInitUrl,
  resolveRegistryBaseConfig,
} from "@/src/utils/presets"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import deepmerge from "deepmerge"
import fsExtra from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

export const initOptionsSchema = z.object({
  cwd: z.string(),
  name: z.string().optional(),
  preset: z.union([z.boolean(), z.string()]).optional(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  isNewProject: z.boolean().default(false),
  cssVariables: z.boolean().default(true),
  rtl: z.boolean().default(false),
  template: z.string().optional(),
  installStyleIndex: z.boolean().default(true),
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
  .option("-p, --preset [name]", "use a preset configuration")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option(
    "-d, --defaults",
    "use default configuration: --template=next --preset=base-nova",
    false
  )
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-n, --name <name>", "the name for the new project.")
  .option("-s, --silent", "mute output.", false)
  .option("--css-variables", "use css variables for theming.", true)
  .option("--no-css-variables", "do not use css variables for theming.")
  .option("--rtl", "enable RTL support.", false)
  .action(async (components, opts) => {
    let componentsJsonBackupPath: string | undefined

    try {
      const options = initOptionsSchema.parse({
        ...opts,
        cwd: path.resolve(opts.cwd),
      })
      const presets = Object.values(DEFAULT_PRESETS)
      const presetsByName = new Map(
        presets.map((preset) => [preset.name, preset])
      )

      if (options.defaults) {
        options.template = options.template || "next"
        const initUrl = resolveInitUrl({
          ...DEFAULT_PRESETS["base-nova"],
          rtl: options.rtl,
        })
        components = [initUrl, ...components]
      }

      if (options.template && !(options.template in templates)) {
        logger.error(
          `Invalid template: ${highlighter.info(
            options.template
          )}. Available templates: ${Object.keys(templates)
            .map((t) => highlighter.info(t))
            .join(", ")}.`
        )
        logger.break()
        process.exit(1)
      }

      if (typeof options.preset === "string" && !isUrl(options.preset)) {
        const knownPresetNames = presets.map((preset) => preset.name)

        if (!presetsByName.has(options.preset)) {
          logger.error(
            `Invalid preset: ${highlighter.info(
              options.preset
            )}. Available presets: ${knownPresetNames.join(", ")}`
          )
          logger.break()
          process.exit(1)
        }
      }

      const cwd = options.cwd
      if (
        fsExtra.existsSync(path.resolve(cwd, "components.json")) &&
        !options.force
      ) {
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

      if (
        options.preset === undefined &&
        components.length === 0 &&
        !options.defaults
      ) {
        // Determine template for the create URL.
        const hasPackageJson = fsExtra.existsSync(
          path.resolve(cwd, "package.json")
        )

        // Prompt for template only for new projects without -t flag.
        if (!options.template && !hasPackageJson) {
          const { template } = await prompts({
            type: "select",
            name: "template",
            message: "Select a template",
            choices: Object.entries(templates).map(([value, t]) => ({
              title: t.title,
              value,
            })),
          })

          if (!template) {
            process.exit(0)
          }

          options.template = template
        }

        // Try to infer template for existing projects.
        if (!options.template && hasPackageJson) {
          const projectInfo = await getProjectInfo(cwd)
          const detectedTemplate = getTemplateForFramework(
            projectInfo?.framework.name
          )
          if (detectedTemplate) {
            options.template = detectedTemplate
          }
        }

        // Show interactive preset list.
        options.preset = true
      }

      if (options.preset !== undefined) {
        const presetArg = options.preset === true ? true : options.preset

        if (presetArg === true) {
          const initUrl = await promptForPreset({
            rtl: options.rtl,
            template: options.template,
          })
          components = [initUrl, ...components]
        }

        if (typeof presetArg === "string") {
          let initUrl: string

          if (isUrl(presetArg)) {
            const url = new URL(presetArg)
            if (options.rtl) {
              url.searchParams.set("rtl", "true")
            }
            initUrl = url.toString()
          } else {
            const preset = presetsByName.get(presetArg)!
            initUrl = resolveInitUrl({
              ...preset,
              rtl: options.rtl || preset.rtl,
            })
          }

          components = [initUrl, ...components]
        }
      }

      const parsedOptions = initOptionsSchema.parse({
        components,
        ...options,
        cwd: options.cwd,
      })

      await loadEnvFiles(parsedOptions.cwd)

      // We need to check if we're initializing with a new style.
      // This will allow us to determine if we need to install the base style.
      if (components.length > 0) {
        // Back up existing components.json if it exists.
        // Since components.json might not be valid at this point,
        // temporarily rename it to allow preflight to run.
        const componentsJsonPath = path.resolve(
          parsedOptions.cwd,
          "components.json"
        )

        // Read existing registries before backing up.
        let existingRegistries
        if (fsExtra.existsSync(componentsJsonPath)) {
          try {
            const existingConfig = await fsExtra.readJson(componentsJsonPath)
            existingRegistries = existingConfig.registries
          } catch {
            // Ignore read errors.
          }

          componentsJsonBackupPath =
            createFileBackup(componentsJsonPath) ?? undefined
          if (!componentsJsonBackupPath) {
            logger.warn(
              `Could not back up ${highlighter.info("components.json")}.`
            )
          }
        }

        // Resolve registry:base config from the first component.
        const { registryBaseConfig, installStyleIndex } =
          await resolveRegistryBaseConfig(components[0], parsedOptions.cwd, {
            registries: existingRegistries,
          })

        if (!installStyleIndex) {
          parsedOptions.installStyleIndex = false
        }

        if (registryBaseConfig) {
          parsedOptions.registryBaseConfig = registryBaseConfig
        }
      }

      await runInit(parsedOptions)

      logger.log(
        `Project initialization completed.\nYou may now add components.`
      )

      // We need when running with custom cwd.
      deleteFileBackup(path.resolve(parsedOptions.cwd, "components.json"))
      logger.break()
    } catch (error) {
      if (componentsJsonBackupPath) {
        restoreFileBackup(
          componentsJsonBackupPath.replace(FILE_BACKUP_SUFFIX, "")
        )
      }
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
  let newProjectTemplate: keyof typeof templates | undefined
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

  const selectedTemplate = newProjectTemplate
    ? templates[newProjectTemplate]
    : undefined

  const components = [
    ...(options.installStyleIndex ? ["index"] : []),
    ...(options.components ?? []),
  ]

  if (selectedTemplate?.init) {
    const result = await selectedTemplate.init({
      projectPath: options.cwd,
      components,
      registryBaseConfig: options.registryBaseConfig,
      rtl: options.rtl ?? false,
      silent: options.silent,
    })

    // Run postInit for new projects (e.g. git init).
    await selectedTemplate.postInit({ projectPath: options.cwd })

    return result
  }

  // Standard init path for existing projects.
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

  if (!options.style) {
    process.exit(0)
  }

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
  let baseColor = "neutral"
  let cssVariables = defaultConfig.tailwind.cssVariables
  let iconLibrary = defaultConfig.iconLibrary ?? "lucide"

  if (!opts.defaults) {
    const [styles, tailwindVersion] = await Promise.all([
      getRegistryStyles(),
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
    ])

    style = options.style ?? style ?? "new-york"
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
