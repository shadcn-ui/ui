import path from "path"
import { getPreset, getPresets, getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { isUrl } from "@/src/registry/utils"
import { Preset } from "@/src/schema"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { Command } from "commander"
import open from "open"
import prompts from "prompts"

import { initOptionsSchema, runInit } from "./init"

const CREATE_TEMPLATES = {
  next: "Next.js",
  vite: "Vite",
  start: "TanStack Start",
} as const

function getShadcnCreateUrl() {
  return `${process.env.REGISTRY_URL!.replace("/r", "")}/create`
}

function getShadcnInitUrl() {
  return `${process.env.REGISTRY_URL!.replace("/r", "")}/init`
}

export const create = new Command()
  .name("create")
  .description("create a new project with shadcn/ui")
  .argument("[name]", "the name of your project")
  .option("-t, --template <template>", "the template to use. e.g. next")
  .option("-p, --preset [name]", "use a preset configuration")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option(
    "--src-dir",
    "use the src directory when creating a new project.",
    false
  )
  .option(
    "--no-src-dir",
    "do not use the src directory when creating a new project."
  )
  .option("-y, --yes", "skip confirmation prompt.", true)
  .action(async (name, opts) => {
    try {
      // Prompt for project name if not provided.
      let projectName = name
      if (!projectName) {
        const { enteredName } = await prompts({
          type: "text",
          name: "enteredName",
          message: "What is your project named?",
          initial: "my-app",
          format: (value: string) => value.trim(),
          validate: (value: string) =>
            value.length > 128
              ? `Name should be less than 128 characters.`
              : true,
        })

        if (!enteredName) {
          process.exit(0)
        }

        projectName = enteredName
      }

      // Prompt for template if not provided.
      let template = opts.template
      if (!template) {
        const { selectedTemplate } = await prompts({
          type: "select",
          name: "selectedTemplate",
          message: `Which ${highlighter.info(
            "template"
          )} would you like to use?`,
          choices: Object.entries(CREATE_TEMPLATES).map(([key, value]) => ({
            title: value,
            value: key,
          })),
        })

        if (!selectedTemplate) {
          process.exit(0)
        }

        template = selectedTemplate
      }

      // Handle preset selection.
      const presetResult = await handlePresetOption(opts.preset ?? true)

      if (!presetResult) {
        process.exit(0)
      }

      // Determine initUrl and baseColor based on preset type.
      let initUrl: string
      let baseColor: string

      if ("_isUrl" in presetResult) {
        // User provided a URL directly.
        initUrl = presetResult.url
        const url = new URL(presetResult.url)
        baseColor = url.searchParams.get("baseColor") ?? "neutral"
      } else {
        // User selected a preset by name.
        initUrl = buildInitUrl(presetResult)
        baseColor = presetResult.baseColor
      }

      // Fetch the registry:base item to get its config.
      let shadowConfig = configWithDefaults({})
      const { config: updatedConfig } = await ensureRegistriesInConfig(
        [initUrl],
        shadowConfig,
        { silent: true }
      )
      shadowConfig = updatedConfig

      const [item] = await getRegistryItems([initUrl], {
        config: shadowConfig,
      })

      // Extract config from registry:base item.
      let registryBaseConfig = undefined
      if (item?.type === "registry:base" && item.config) {
        registryBaseConfig = item.config
      }

      const options = initOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        name: projectName,
        components: [initUrl],
        yes: opts.yes,
        defaults: false,
        force: false,
        silent: false,
        isNewProject: true,
        srcDir: opts.srcDir,
        cssVariables: true,
        template,
        baseColor,
        baseStyle: false,
        registryBaseConfig,
        skipPreflight: false,
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
    } finally {
      clearRegistryContext()
    }
  })

function buildInitUrl(preset: Preset) {
  const params = new URLSearchParams({
    base: preset.base,
    style: preset.style,
    baseColor: preset.baseColor,
    theme: preset.theme,
    iconLibrary: preset.iconLibrary,
    font: preset.font,
    menuAccent: preset.menuAccent,
    menuColor: preset.menuColor,
    radius: preset.radius,
  })

  return `${getShadcnInitUrl()}?${params.toString()}`
}

async function handlePresetOption(presetArg: string | boolean) {
  // If --preset is used without a name, show interactive list.
  if (presetArg === true) {
    const presets = await getPresets()

    const { selectedPreset } = await prompts({
      type: "select",
      name: "selectedPreset",
      message: `Which ${highlighter.info("preset")} would you like to use?`,
      choices: [
        ...presets.map((preset) => ({
          title: preset.title,
          description: preset.description,
          value: preset.name,
        })),
        {
          title: "Custom",
          description: "Build your own on https://ui.shadcn.com",
          value: "custom",
        },
      ],
    })

    if (!selectedPreset) {
      return null
    }

    if (selectedPreset === "custom") {
      const url = getShadcnCreateUrl()
      logger.info(`\nOpening ${highlighter.info(url)} in your browser...\n`)
      await open(url)
      return null
    }

    return presets.find((p) => p.name === selectedPreset) ?? null
  }

  // If --preset NAME or URL is provided.
  if (typeof presetArg === "string") {
    // Check if it's a URL.
    if (isUrl(presetArg)) {
      return { _isUrl: true, url: presetArg } as const
    }

    // Otherwise, fetch that preset by name.
    const preset = await getPreset(presetArg)

    if (!preset) {
      const presets = await getPresets()
      const presetNames = presets.map((p) => p.name).join(", ")
      logger.error(
        `Preset "${presetArg}" not found. Available presets: ${presetNames}`
      )
      process.exit(1)
    }

    return preset
  }

  return null
}
