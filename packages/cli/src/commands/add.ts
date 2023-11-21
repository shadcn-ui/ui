import { existsSync, promises as fs } from "fs"
import path from "path"
import { getConfig } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  fetchTree,
  getItemTargetPath,
  getRegistryBaseColor,
  getRegistryBaseColors,
  getRegistryIndex,
  resolveTree,
} from "@/src/utils/registry"
import { transform } from "@/src/utils/transformers"
import chalk from "chalk"
import { Command } from "commander"
import { execa } from "execa"
import ora from "ora"
import prompts from "prompts"
import * as z from "zod"

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      })

      const cwd = path.resolve(options.cwd)

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      const config = await getConfig(cwd)
      if (!config) {
        logger.warn(
          `Configuration is missing. Please run ${chalk.green(
            `init`
          )} to create a components.json file.`
        )
        process.exit(1)
      }

      const registryIndex = await getRegistryIndex()

      let selectedComponents = options.all
        ? registryIndex.map((entry) => entry.name)
        : options.components
      if (!options.components?.length && !options.all) {
        const { components } = await prompts({
          type: "multiselect",
          name: "components",
          message: "Which components would you like to add?",
          hint: "Space to select. A to toggle all. Enter to submit.",
          instructions: false,
          choices: registryIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
            selected: options.all
              ? true
              : options.components?.includes(entry.name),
          })),
        })
        selectedComponents = components
      }

      if (!selectedComponents?.length) {
        logger.warn("No components selected. Exiting.")
        process.exit(0)
      }

      const tree = await resolveTree(registryIndex, selectedComponents)
      const payload = await fetchTree(config.style, tree)
      const baseColors = await getRegistryBaseColors()
      const colors = baseColors.map((color) => color.name)
      let baseColor
      if (colors.includes(config.tailwind.baseColor)) {
        baseColor = await getRegistryBaseColor(config.tailwind.baseColor)
      } else {
        if (config.tailwind.cssVariables) {
          throw new Error("Custom color doesn't support cssVariables")
        }
        const custom = config.tailwind.baseColor
        baseColor = {
          inlineColors: {
            light: {
              background: "white",
              foreground: `${custom}-950`,
              muted: `${custom}-100`,
              "muted-foreground": `${custom}-500`,
              popover: "white",
              "popover-foreground": `${custom}-950`,
              border: `${custom}-200`,
              input: `${custom}-200`,
              card: "white",
              "card-foreground": `${custom}-950`,
              primary: `${custom}-900`,
              "primary-foreground": `${custom}-50`,
              secondary: `${custom}-100`,
              "secondary-foreground": `${custom}-900`,
              accent: `${custom}-100`,
              "accent-foreground": `${custom}-900`,
              destructive: "red-500",
              "destructive-foreground": `${custom}-50`,
              ring: `${custom}-400`,
            },
            dark: {
              background: `${custom}-950`,
              foreground: `${custom}-50`,
              muted: `${custom}-800`,
              "muted-foreground": `${custom}-400`,
              popover: `${custom}-950`,
              "popover-foreground": `${custom}-50`,
              border: `${custom}-800`,
              input: `${custom}-800`,
              card: `${custom}-950`,
              "card-foreground": `${custom}-50`,
              primary: `${custom}-50`,
              "primary-foreground": `${custom}-900`,
              secondary: `${custom}-800`,
              "secondary-foreground": `${custom}-50`,
              accent: `${custom}-800`,
              "accent-foreground": `${custom}-50`,
              destructive: "red-900",
              "destructive-foreground": "red-50",
              ring: `${custom}-800`,
            },
          },
          //does not support cssVars
          cssVars: {
            light: {
              background: "0 0% 100%",
              foreground: "222.2 84% 4.9%",
              muted: "210 40% 96.1%",
              "muted-foreground": "215.4 16.3% 46.9%",
              popover: "0 0% 100%",
              "popover-foreground": "222.2 84% 4.9%",
              border: "214.3 31.8% 91.4%",
              input: "214.3 31.8% 91.4%",
              card: "0 0% 100%",
              "card-foreground": "222.2 84% 4.9%",
              primary: "222.2 47.4% 11.2%",
              "primary-foreground": "210 40% 98%",
              secondary: "210 40% 96.1%",
              "secondary-foreground": "222.2 47.4% 11.2%",
              accent: "210 40% 96.1%",
              "accent-foreground": "222.2 47.4% 11.2%",
              destructive: "0 84.2% 60.2%",
              "destructive-foreground": "210 40% 98%",
              ring: "215 20.2% 65.1%",
            },
            dark: {
              background: "222.2 84% 4.9%",
              foreground: "210 40% 98%",
              muted: "217.2 32.6% 17.5%",
              "muted-foreground": "215 20.2% 65.1%",
              popover: "222.2 84% 4.9%",
              "popover-foreground": "210 40% 98%",
              border: "217.2 32.6% 17.5%",
              input: "217.2 32.6% 17.5%",
              card: "222.2 84% 4.9%",
              "card-foreground": "210 40% 98%",
              primary: "210 40% 98%",
              "primary-foreground": "222.2 47.4% 11.2%",
              secondary: "217.2 32.6% 17.5%",
              "secondary-foreground": "210 40% 98%",
              accent: "217.2 32.6% 17.5%",
              "accent-foreground": "210 40% 98%",
              destructive: "0 62.8% 30.6%",
              "destructive-foreground": "0 85.7% 97.3%",
              ring: "217.2 32.6% 17.5%",
            },
          },
          inlineColorsTemplate:
            "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
          cssVarsTemplate:
            "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n \n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;\n \n    --muted: 210 40% 96.1%;\n    --muted-foreground: 215.4 16.3% 46.9%;\n \n    --popover: 0 0% 100%;\n    --popover-foreground: 222.2 84% 4.9%;\n \n    --card: 0 0% 100%;\n    --card-foreground: 222.2 84% 4.9%;\n \n    --border: 214.3 31.8% 91.4%;\n    --input: 214.3 31.8% 91.4%;\n \n    --primary: 222.2 47.4% 11.2%;\n    --primary-foreground: 210 40% 98%;\n \n    --secondary: 210 40% 96.1%;\n    --secondary-foreground: 222.2 47.4% 11.2%;\n \n    --accent: 210 40% 96.1%;\n    --accent-foreground: 222.2 47.4% 11.2%;\n \n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 210 40% 98%;\n \n    --ring: 215 20.2% 65.1%;\n \n    --radius: 0.5rem;\n  }\n \n  .dark {\n    --background: 222.2 84% 4.9%;\n    --foreground: 210 40% 98%;\n \n    --muted: 217.2 32.6% 17.5%;\n    --muted-foreground: 215 20.2% 65.1%;\n \n    --popover: 222.2 84% 4.9%;\n    --popover-foreground: 210 40% 98%;\n \n    --card: 222.2 84% 4.9%;\n    --card-foreground: 210 40% 98%;\n \n    --border: 217.2 32.6% 17.5%;\n    --input: 217.2 32.6% 17.5%;\n \n    --primary: 210 40% 98%;\n    --primary-foreground: 222.2 47.4% 11.2%;\n \n    --secondary: 217.2 32.6% 17.5%;\n    --secondary-foreground: 210 40% 98%;\n \n    --accent: 217.2 32.6% 17.5%;\n    --accent-foreground: 210 40% 98%;\n \n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 0 85.7% 97.3%;\n \n    --ring: 217.2 32.6% 17.5%;\n  }\n}\n \n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}",
        }
      }

      if (!payload.length) {
        logger.warn("Selected components not found. Exiting.")
        process.exit(0)
      }

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Ready to install components and dependencies. Proceed?`,
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      const spinner = ora(`Installing components...`).start()
      for (const item of payload) {
        spinner.text = `Installing ${item.name}...`
        const targetDir = await getItemTargetPath(
          config,
          item,
          options.path ? path.resolve(cwd, options.path) : undefined
        )

        if (!targetDir) {
          continue
        }

        if (!existsSync(targetDir)) {
          await fs.mkdir(targetDir, { recursive: true })
        }

        const existingComponent = item.files.filter((file) =>
          existsSync(path.resolve(targetDir, file.name))
        )

        if (existingComponent.length && !options.overwrite) {
          if (selectedComponents.includes(item.name)) {
            spinner.stop()
            const { overwrite } = await prompts({
              type: "confirm",
              name: "overwrite",
              message: `Component ${item.name} already exists. Would you like to overwrite?`,
              initial: false,
            })

            if (!overwrite) {
              logger.info(
                `Skipped ${item.name}. To overwrite, run with the ${chalk.green(
                  "--overwrite"
                )} flag.`
              )
              continue
            }

            spinner.start(`Installing ${item.name}...`)
          } else {
            continue
          }
        }

        for (const file of item.files) {
          let filePath = path.resolve(targetDir, file.name)

          // Run transformers.
          const content = await transform({
            filename: file.name,
            raw: file.content,
            config,
            baseColor,
          })

          if (!config.tsx) {
            filePath = filePath.replace(/\.tsx$/, ".jsx")
            filePath = filePath.replace(/\.ts$/, ".js")
          }

          await fs.writeFile(filePath, content)
        }

        // Install dependencies.
        if (item.dependencies?.length) {
          const packageManager = await getPackageManager(cwd)
          await execa(
            packageManager,
            [
              packageManager === "npm" ? "install" : "add",
              ...item.dependencies,
            ],
            {
              cwd,
            }
          )
        }
      }
      spinner.succeed(`Done.`)
    } catch (error) {
      handleError(error)
    }
  })
