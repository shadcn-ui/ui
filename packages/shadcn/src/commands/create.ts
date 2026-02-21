import path from "path"
import { getPreset, getPresets, getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { isUrl } from "@/src/registry/utils"
import { templates } from "@/src/templates/index"
import { addComponents } from "@/src/utils/add-components"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { resolveCreateUrl, resolveInitUrl } from "@/src/utils/presets"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { updateFiles } from "@/src/utils/updaters/update-files"
import { Command } from "commander"
import open from "open"
import prompts from "prompts"
import validateProjectName from "validate-npm-package-name"

import { initOptionsSchema, runInit } from "./init"

export const create = new Command()
  .name("create")
  .description("create a new project with shadcn/ui")
  .argument("[name]", "the name of your project")
  .option(
    "-t, --template <template>",
    "the template to use. e.g. next, next-monorepo, start or vite"
  )
  .option("-p, --preset [name]", "use a preset configuration")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("--rtl", "enable RTL support.", false)
  .action(async (name, opts) => {
    try {
      // If no preset provided, open create URL with template and rtl params.
      const hasNoPreset = !name && !opts.preset
      if (hasNoPreset) {
        const searchParams: {
          template?: string
          rtl?: boolean
          base?: string
        } = {}
        if (opts.template) {
          searchParams.template = opts.template
        }
        if (opts.rtl) {
          searchParams.rtl = true

          // Recommend base-ui in RTL.
          searchParams.base = "base"
        }
        const createUrl = resolveCreateUrl(
          Object.keys(searchParams).length > 0 ? searchParams : undefined
        )
        logger.log("Build your own shadcn/ui.")
        logger.log(
          `You will be taken to ${highlighter.info(
            createUrl
          )} to build your custom design system.`
        )
        logger.break()

        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: "Open in browser?",
          initial: true,
        })

        if (proceed) {
          await open(createUrl)
        }

        process.exit(0)
      }

      // Prompt for project name if not provided.
      let projectName = name
      if (!projectName) {
        const { enteredName } = await prompts({
          type: "text",
          name: "enteredName",
          message: "What is your project named?",
          initial: opts.template ? `${opts.template}-app` : "my-app",
          format: (value: string) => value.trim(),
          validate: (name) => {
            const validation = validateProjectName(
              path.basename(path.resolve(name))
            )
            if (validation.validForNewPackages) {
              return true
            }
            return "Invalid project name. Name should be lowercase, URL-friendly, and not start with a period or underscore."
          },
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
          choices: Object.entries(templates).map(([key, t]) => ({
            title: t.title,
            value: key,
          })),
        })

        if (!selectedTemplate) {
          process.exit(0)
        }

        template = selectedTemplate
      }

      // Handle preset selection.
      let initUrl: string
      const presetArg = opts.preset ?? true

      if (presetArg === true) {
        // Show interactive preset list.
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
          process.exit(0)
        }

        if (selectedPreset === "custom") {
          const createUrl = resolveCreateUrl({
            command: "create",
            ...(opts.rtl && { rtl: true }),
            ...(template && { template }),
          })
          logger.info(
            `\nOpening ${highlighter.info(createUrl)} in your browser...\n`
          )
          await open(createUrl)
          process.exit(0)
        }

        const preset = presets.find((p) => p.name === selectedPreset)
        if (!preset) {
          process.exit(0)
        }
        initUrl = resolveInitUrl({
          ...preset,
          rtl: opts.rtl || preset.rtl,
        })
      } else if (isUrl(presetArg)) {
        // Direct URL.
        const url = new URL(presetArg)
        if (opts.rtl) {
          url.searchParams.set("rtl", "true")
        }
        initUrl = url.toString()
      } else {
        // Preset name.
        const preset = await getPreset(presetArg)
        if (!preset) {
          const presets = await getPresets()
          const presetNames = presets.map((p) => p.name).join(", ")
          logger.error(
            `Preset "${presetArg}" not found. Available presets: ${presetNames}`
          )
          process.exit(1)
        }
        initUrl = resolveInitUrl({
          ...preset,
          rtl: opts.rtl || preset.rtl,
        })
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
        cssVariables: true,
        rtl: opts.rtl,
        template,
        installStyleIndex: false,
        registryBaseConfig,
        skipPreflight: false,
      })

      const config = await runInit(options)

      // Add component example.
      if (config) {
        const components = ["component-example"]
        if (opts.rtl) {
          components.push("direction")
        }
        await addComponents(components, config, {
          silent: true,
          overwrite: true,
        })

        const selectedTemplate = templates[template as keyof typeof templates]

        if (selectedTemplate?.files?.length) {
          await updateFiles(selectedTemplate.files, config, {
            overwrite: true,
            silent: true,
          })
        }
      }

      logger.log(
        `Project initialization completed.\nYou may now add components.`
      )
      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
