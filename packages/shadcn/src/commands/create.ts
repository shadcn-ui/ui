import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { templates } from "@/src/templates/index"
import { addComponents } from "@/src/utils/add-components"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import {
  buildInitUrl,
  getShadcnCreateUrl,
  handlePresetOption,
} from "@/src/utils/presets"
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
        const searchParams: Record<string, string> = {}
        if (opts.template) {
          searchParams.template = opts.template
        }
        if (opts.rtl) {
          searchParams.rtl = "true"

          // Recommend base-ui in RTL.
          searchParams.base = "base"
        }
        const createUrl = getShadcnCreateUrl(
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
      const presetResult = await handlePresetOption(
        opts.preset ?? true,
        opts.rtl,
        "create"
      )

      if (!presetResult) {
        process.exit(0)
      }

      // Determine initUrl based on preset type.
      let initUrl: string

      if ("_isUrl" in presetResult) {
        // User provided a URL directly.
        const url = new URL(presetResult.url)
        if (opts.rtl) {
          url.searchParams.set("rtl", "true")
        }
        initUrl = url.toString()
      } else {
        // User selected a preset by name.
        initUrl = buildInitUrl(presetResult, opts.rtl)
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

        const selectedTemplate =
          templates[template as keyof typeof templates]

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
