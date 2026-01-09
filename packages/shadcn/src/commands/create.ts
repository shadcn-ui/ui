import path from "path"
import { getRegistryItems } from "@/src/registry/api"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import { addComponents } from "@/src/utils/add-components"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { updateFiles } from "@/src/utils/updaters/update-files"
import { Command } from "commander"
import dedent from "dedent"
import open from "open"
import prompts from "prompts"
import validateProjectName from "validate-npm-package-name"

import {
  buildInitUrl,
  handlePresetOption,
  initOptionsSchema,
  runInit,
} from "./init"

const SHADCN_URL = "https://ui.shadcn.com"

const CREATE_TEMPLATES = {
  next: "Next.js",
  vite: "Vite",
  start: "TanStack Start",
} as const

type Template = keyof typeof CREATE_TEMPLATES

export const create = new Command()
  .name("create")
  .description("create a new project with shadcn/ui")
  .argument("[name]", "the name of your project")
  .option(
    "-t, --template <template>",
    "the template to use. e.g. next, start or vite"
  )
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
      // If no arguments or options provided, show initial prompt.
      const hasNoArgs = !name && !opts.template && !opts.preset
      if (hasNoArgs) {
        const createUrl = getShadcnCreateUrl()
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

      const config = await runInit(options)

      // Add component example.
      if (config) {
        await addComponents(["component-example"], config, {
          baseStyle: false,
          silent: true,
          overwrite: true,
        })

        const templateFiles = getTemplateFiles(template as Template)
        if (templateFiles.length > 0) {
          await updateFiles(templateFiles, config, {
            overwrite: true,
            silent: true,
          })
        }
      }

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

function getTemplateFiles(template: Template) {
  switch (template) {
    case "vite":
      return [
        {
          type: "registry:file" as const,
          path: "src/App.tsx",
          target: "src/App.tsx",
          content: dedent`import { ComponentExample } from "@/components/component-example";

export function App() {
  return <ComponentExample />;
}

export default App;
`,
        },
      ]
    case "next":
      return [
        {
          type: "registry:page" as const,
          path: "app/page.tsx",
          target: "app/page.tsx",
          content: dedent`import { ComponentExample } from "@/components/component-example";

export default function Page() {
  return <ComponentExample />;
}
`,
        },
      ]
    case "start":
      return [
        {
          type: "registry:file" as const,
          path: "src/routes/index.tsx",
          target: "src/routes/index.tsx",
          content: dedent`import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <ComponentExample />
  );
}
`,
        },
      ]
    default:
      return []
  }
}

function getShadcnCreateUrl() {
  return `${SHADCN_URL}/create`
}
