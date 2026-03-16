import { promises as fs } from "fs"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import { decodePreset, isPresetCode } from "@/src/preset/preset"
import {
  DEFAULT_PRESETS,
  promptForBase,
  promptForPreset,
  resolveInitUrl,
  resolveRegistryBaseConfig,
} from "@/src/preset/presets"
import { getRegistryBaseColors, getRegistryStyles } from "@/src/registry/api"
import { BUILTIN_REGISTRIES, SHADCN_URL } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { registryConfigSchema } from "@/src/registry/schema"
import { isUrl } from "@/src/registry/utils"
import { rawConfigSchema } from "@/src/schema"
import {
  getTemplateForFramework,
  resolveTemplate,
  templates,
} from "@/src/templates/index"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import { loadEnvFiles } from "@/src/utils/env-loader"
import * as ERRORS from "@/src/utils/errors"
import {
  createFileBackup,
  deleteFileBackup,
  FILE_BACKUP_SUFFIX,
  restoreFileBackup,
} from "@/src/utils/file-helper"
import {
  DEFAULT_COMPONENTS,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UTILS,
  explorer,
  getConfig,
  getWorkspaceConfig,
  resolveConfigPaths,
  type Config,
} from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import {
  getProjectComponents,
  getProjectConfig,
  getProjectInfo,
  getProjectTailwindVersionFromConfig,
} from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
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
  reinstall: z.boolean().optional(),
  silent: z.boolean(),
  isNewProject: z.boolean().default(false),
  cssVariables: z.boolean().default(true),
  rtl: z.boolean().optional(),
  base: z.enum(["radix", "base"]).optional(),
  template: z.string().optional(),
  monorepo: z.boolean().optional(),
  existingConfig: z.record(z.unknown()).optional(),
  installStyleIndex: z.boolean().default(true),
  registryBaseConfig: rawConfigSchema.deepPartial().optional(),
  menuColor: z
    .enum([
      "default",
      "inverted",
      "default-translucent",
      "inverted-translucent",
    ])
    .optional(),
  menuAccent: z.enum(["subtle", "bold"]).optional(),
  iconLibrary: z.string().optional(),
})

export const init = new Command()
  .name("init")
  .alias("create")
  .description("initialize your project and install dependencies")
  .argument("[components...]", "names, url or local path to component")
  .option(
    "-t, --template <template>",
    "the template to use. (next, start, vite, react-router, laravel, astro)"
  )
  .option("-b, --base <base>", "the component library to use. (radix, base)")
  .option("--monorepo", "scaffold a monorepo project.")
  .option("--no-monorepo", "skip the monorepo prompt.")
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
  .option("--rtl", "enable RTL support.")
  .option("--no-rtl", "disable RTL support.")
  .option("--reinstall", "re-install existing UI components.")
  .option("--no-reinstall", "do not re-install existing UI components.")
  .action(async (components, opts) => {
    let componentsJsonBackupPath: string | undefined
    let reinstallComponents: string[] = []

    // Restore components.json backup on unexpected exit (e.g. process.exit in preflight).
    const restoreBackupOnExit = () => {
      if (componentsJsonBackupPath) {
        restoreFileBackup(
          componentsJsonBackupPath.replace(FILE_BACKUP_SUFFIX, "")
        )
      }
    }
    process.on("exit", restoreBackupOnExit)

    try {
      const options = initOptionsSchema.parse({
        ...opts,
        reinstall: opts.reinstall,
        cwd: path.resolve(opts.cwd),
      })
      const presetsByName = new Map(Object.entries(DEFAULT_PRESETS))

      let presetBase: string | undefined

      if (options.defaults) {
        options.template = options.template || "next"
        options.base = options.base || "base"
        options.reinstall = options.reinstall ?? false
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

      if (
        typeof options.preset === "string" &&
        !isUrl(options.preset) &&
        !isPresetCode(options.preset)
      ) {
        const knownPresetNames = Array.from(presetsByName.keys())

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
      const hasExistingConfig = fsExtra.existsSync(
        path.resolve(cwd, "components.json")
      )

      // Check if we're in a monorepo root before proceeding.
      // Skip this check when --monorepo is set, since the template
      // handler knows how to initialize each workspace.
      if (
        !options.monorepo &&
        !hasExistingConfig &&
        (await isMonorepoRoot(cwd))
      ) {
        const projectInfo = await getProjectInfo(cwd)
        if (!projectInfo || projectInfo.framework.name === "manual") {
          const targets = await getMonorepoTargets(cwd)
          if (targets.length > 0) {
            formatMonorepoMessage("init", targets)
            process.exit(1)
          }
        }
      }

      if (hasExistingConfig && !options.force) {
        const { overwrite } = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `A ${highlighter.info(
            "components.json"
          )} file already exists. Would you like to overwrite it?`,
          initial: false,
        })

        if (!overwrite) {
          logger.info(
            `  To start over, remove the ${highlighter.info(
              "components.json"
            )} file and run ${highlighter.info("init")} again.`
          )
          logger.break()
          process.exit(1)
        }

        options.force = true
      }

      let existingConfig: Record<string, unknown> | undefined
      if (hasExistingConfig) {
        try {
          existingConfig = await fsExtra.readJson(
            path.resolve(cwd, "components.json")
          )
        } catch {
          // Ignore read errors.
        }

        // Pass existing config so preflight can use it (e.g. tailwind.css path in monorepos).
        if (existingConfig) {
          options.existingConfig = existingConfig
        }

        let shouldReinstall = options.reinstall

        if (shouldReinstall === undefined) {
          const { reinstall } = await prompts({
            type: "confirm",
            name: "reinstall",
            message: `Would you like to re-install existing UI components?`,
            initial: false,
          })
          shouldReinstall = reinstall
        }

        if (shouldReinstall) {
          reinstallComponents = await getProjectComponents(cwd)
          if (reinstallComponents.length) {
            logger.break()
            logger.log(
              "  The following components will be re-installed and overwritten:"
            )
            for (let i = 0; i < reinstallComponents.length; i += 8) {
              logger.log(
                `  - ${reinstallComponents.slice(i, i + 8).join(", ")}`
              )
            }
            logger.break()
          }
        }
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
              description: t.description,
              disabled: options.monorepo && value === "laravel",
            })),
          })

          if (!template) {
            process.exit(1)
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

        // Laravel cannot be scaffolded — exit early with instructions.
        if (options.template === "laravel" && !hasPackageJson) {
          logger.break()
          logger.log(
            `  Please create a new app with ${highlighter.info(
              "laravel new --react"
            )} first then run ${highlighter.info("shadcn init")}.`
          )
          logger.log(
            `  See ${highlighter.info(
              `${SHADCN_URL}/docs/installation/laravel`
            )} for more information.`
          )
          logger.break()
          process.exit(0)
        }

        // Prompt for monorepo if the template supports it (new projects only).
        if (
          options.monorepo === undefined &&
          !hasPackageJson &&
          options.template &&
          templates[options.template as keyof typeof templates]?.monorepo
        ) {
          const { monorepo } = await prompts({
            type: "confirm",
            name: "monorepo",
            message: "Would you like to set up a monorepo?",
            initial: false,
          })
          options.monorepo = monorepo
        }

        // Prompt for base if not provided.
        if (!options.base) {
          options.base = await promptForBase()
        }

        // Show interactive preset list.
        options.preset = true
      }

      if (options.preset !== undefined) {
        const presetArg = options.preset === true ? true : options.preset

        if (presetArg === true) {
          const result = await promptForPreset({
            rtl: options.rtl ?? false,
            template: options.template,
            base: options.base!,
          })
          components = [result.url, ...components]
          presetBase = result.base
        }

        if (typeof presetArg === "string") {
          let initUrl: string

          if (isUrl(presetArg)) {
            const url = new URL(presetArg)
            if (options.rtl) {
              url.searchParams.set("rtl", "true")
            } else if (options.rtl === false) {
              url.searchParams.delete("rtl")
            }
            if (url.pathname === "/init" && presetArg.startsWith(SHADCN_URL)) {
              url.searchParams.set("track", "1")
            }
            initUrl = url.toString()
            presetBase = url.searchParams.get("base") ?? undefined
          } else if (isPresetCode(presetArg)) {
            const decoded = decodePreset(presetArg)
            if (!decoded) {
              logger.error(
                `Invalid preset code: ${highlighter.info(presetArg)}`
              )
              logger.break()
              process.exit(1)
            }
            // Preset codes no longer carry base — use "radix" as placeholder.
            // The correct base is set in the URL after resolution below.
            initUrl = resolveInitUrl(
              {
                ...decoded,
                base: "radix",
                rtl: options.rtl ?? false,
              },
              { template: options.template }
            )
            presetBase = undefined
          } else {
            const preset = presetsByName.get(presetArg)
            if (!preset) {
              throw new Error(`Unknown preset: ${presetArg}`)
            }
            initUrl = resolveInitUrl(
              {
                ...preset,
                base: options.base ?? "radix",
                rtl: options.rtl ?? preset.rtl,
              },
              { template: options.template }
            )
            presetBase = undefined
          }

          components = [initUrl, ...components]
        }
      }

      // Resolve base: --base flag > preset/prompt/URL > existing config > prompt.
      let resolvedBase: string =
        options.base ??
        presetBase ??
        (existingConfig?.style
          ? (existingConfig.style as string).startsWith("base-")
            ? "base"
            : "radix"
          : "")

      if (!resolvedBase) {
        if (components.length > 0) {
          // When initializing from a registry item, default to radix.
          // The registry:base config will override this.
          resolvedBase = "radix"
        } else {
          const base = await promptForBase()
          resolvedBase = base
          options.base = base
        }
      }

      // Build the --defaults URL now that base is resolved.
      if (options.defaults && !components.some(isUrl)) {
        const initUrl = resolveInitUrl(
          {
            ...DEFAULT_PRESETS.nova,
            base: resolvedBase,
            rtl: options.rtl ?? false,
          },
          { template: options.template }
        )
        components = [initUrl, ...components]
      }

      // Ensure the init URL has the correct base.
      if (components.length > 0 && isUrl(components[0])) {
        const url = new URL(components[0])
        url.searchParams.set("base", resolvedBase)
        components[0] = url.toString()
      }

      // Confirm if the user is switching bases during reinit.
      if (existingConfig?.style) {
        const confirmedBase = await confirmBaseSwitch(
          existingConfig.style as string,
          resolvedBase
        )
        if (confirmedBase !== resolvedBase) {
          resolvedBase = confirmedBase
          if (components.length > 0 && isUrl(components[0])) {
            const url = new URL(components[0])
            url.searchParams.set("base", confirmedBase)
            components[0] = url.toString()
          }
        }
      }

      // Add re-install components after preset selection.
      if (reinstallComponents.length) {
        components = [...components, ...reinstallComponents]
      }

      options.components = components

      await loadEnvFiles(options.cwd)

      // We need to check if we're initializing with a new style.
      // This will allow us to determine if we need to install the base style.
      if (components.length > 0) {
        // Back up existing components.json if it exists.
        // Since components.json might not be valid at this point,
        // temporarily rename it to allow preflight to run.
        const componentsJsonPath = path.resolve(cwd, "components.json")

        if (hasExistingConfig) {
          componentsJsonBackupPath =
            createFileBackup(componentsJsonPath) ?? undefined
          if (!componentsJsonBackupPath) {
            logger.warn(
              `Could not back up ${highlighter.info("components.json")}.`
            )
          }
        }

        // Resolve registry:base config from the first component.
        const {
          registryBaseConfig,
          installStyleIndex,
          url: cleanUrl,
        } = await resolveRegistryBaseConfig(components[0], cwd, {
          registries: existingConfig?.registries as
            | z.infer<typeof registryConfigSchema>
            | undefined,
        })

        // Use the clean URL (track param stripped) for subsequent fetches.
        components[0] = cleanUrl

        if (!installStyleIndex) {
          options.installStyleIndex = false
        }

        if (registryBaseConfig) {
          options.registryBaseConfig = registryBaseConfig
        }
      }

      await runInit(options)

      logger.break()
      logger.log(
        `Project initialization completed.\nYou may now add components.`
      )

      // Success — remove the backup and exit listener.
      process.removeListener("exit", restoreBackupOnExit)
      deleteFileBackup(path.resolve(cwd, "components.json"))
      logger.break()
    } catch (error) {
      // Restore handled by exit listener, but also do it here for non-exit errors.
      process.removeListener("exit", restoreBackupOnExit)
      restoreBackupOnExit()
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

  // Resolve the effective template if --monorepo is set.
  const explicitTemplate = options.template as
    | keyof typeof templates
    | undefined
  const resolvedTemplateConfig = explicitTemplate
    ? resolveTemplate(templates[explicitTemplate], {
        monorepo: options.monorepo,
      })
    : undefined

  // When a monorepo template with an init handler is explicitly provided
  // and the project already exists, skip the standard preflight
  // — the template manages each workspace directly.
  const hasExplicitMonorepoInit =
    options.monorepo &&
    resolvedTemplateConfig?.init &&
    fsExtra.existsSync(path.resolve(options.cwd, "package.json"))

  if (hasExplicitMonorepoInit) {
    projectInfo = await getProjectInfo(options.cwd)
  } else if (!options.skipPreflight) {
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

  // Use the template from project creation if available,
  // or fall back to the explicit --template flag.
  const templateKey = newProjectTemplate ?? explicitTemplate
  const selectedTemplate = templateKey
    ? resolveTemplate(templates[templateKey], { monorepo: options.monorepo })
    : undefined

  const components = [
    ...(options.installStyleIndex ? ["index"] : []),
    ...(options.components ?? []),
    // Add button component for new template-based projects.
    ...(selectedTemplate ? ["button"] : []),
  ]

  if (selectedTemplate?.init) {
    const result = await selectedTemplate.init({
      projectPath: options.cwd,
      components,
      registryBaseConfig: options.registryBaseConfig,
      rtl: options.rtl ?? false,
      menuColor: options.menuColor,
      menuAccent: options.menuAccent,
      iconLibrary: options.iconLibrary,
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
      process.exit(1)
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

  // Propagate design settings to workspace components.json files.
  const fullConfig = await resolveConfigPaths(options.cwd, config)
  const workspaceConfig = await getWorkspaceConfig(fullConfig)
  if (workspaceConfig) {
    const designSettings: Record<string, unknown> = {}
    if (config.menuColor) designSettings.menuColor = config.menuColor
    if (config.menuAccent) designSettings.menuAccent = config.menuAccent
    if (config.rtl !== undefined) designSettings.rtl = config.rtl
    if (config.iconLibrary) designSettings.iconLibrary = config.iconLibrary

    if (Object.keys(designSettings).length > 0) {
      for (const key of Object.keys(workspaceConfig)) {
        const wsConfig = workspaceConfig[key]
        if (wsConfig.resolvedPaths.cwd === fullConfig.resolvedPaths.cwd) {
          continue
        }

        const wsConfigPath = path.resolve(
          wsConfig.resolvedPaths.cwd,
          "components.json"
        )
        if (fsExtra.existsSync(wsConfigPath)) {
          const wsRawConfig = await fsExtra.readJson(wsConfigPath)
          await fsExtra.writeJson(
            wsConfigPath,
            { ...wsRawConfig, ...designSettings },
            { spaces: 2 }
          )
        }
      }
    }
  }

  // Clear cosmiconfig cache so addComponents re-reads the updated workspace configs.
  explorer.clearCaches()

  // Add components.
  await addComponents(components, fullConfig, {
    // Init will always overwrite files.
    overwrite: true,
    // Reinstall should overwrite existing CSS variables.
    overwriteCssVars: options.reinstall || undefined,
    silent: options.silent,
    isNewProject:
      options.isNewProject || projectInfo?.framework.name === "next-app",
  })

  // Run postInit for new projects without a custom init (e.g. git init).
  if (selectedTemplate) {
    await selectedTemplate.postInit({ projectPath: options.cwd })
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

  if (!options.style) {
    process.exit(1)
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

async function confirmBaseSwitch(existingStyle: string, resolvedBase: string) {
  // Styles prefixed with "base-" use Base UI. Everything else is Radix.
  const oldBase = existingStyle.startsWith("base-") ? "base" : "radix"
  if (resolvedBase === oldBase) return resolvedBase

  logger.warn(
    `  You are switching from ${highlighter.info(
      oldBase
    )} to ${highlighter.info(resolvedBase)}.`
  )
  logger.warn(
    `  Components outside the ${highlighter.info(
      "ui"
    )} directory that depend on ${highlighter.info(
      oldBase
    )} primitives may need manual updates.`
  )
  logger.break()

  const { proceed } = await prompts({
    type: "confirm",
    name: "proceed",
    message: "Would you like to continue?",
    initial: false,
  })

  return proceed ? resolvedBase : oldBase
}
