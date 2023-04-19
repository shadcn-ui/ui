#!/usr/bin/env node
import { existsSync, promises as fs } from "fs"
import path from "path"
import { Command } from "commander"
import { execa } from "execa"
import ora from "ora"
import prompts from "prompts"

import { Component, getAvailableComponents } from "./utils/get-components"
import { getPackageInfo } from "./utils/get-package-info"
import { getPackageManager } from "./utils/get-package-manager"
import { getProjectInfo } from "./utils/get-project-info"
import { logger } from "./utils/logger"
import { STYLES, TAILWIND_CONFIG, UTILS } from "./utils/templates"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "lucide-react",
]

async function main() {
  const packageInfo = await getPackageInfo()
  const projectInfo = await getProjectInfo()
  const packageManager = getPackageManager()

  const program = new Command()
    .name("shadcn-ui")
    .description("Add shadcn-ui components to your project")
    .version(
      packageInfo.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program
    .command("init")
    .description("Configure your Next.js project.")
    .option("-y, --yes", "Skip confirmation prompt.")
    .action(async (options) => {
      logger.warn(
        "This command assumes a Next.js project with TypeScript and Tailwind CSS."
      )
      logger.warn(
        "If you don't have these, follow the manual steps at https://ui.shadcn.com/docs/installation."
      )
      logger.warn("")

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message:
            "Running this command will install dependencies and overwrite your existing tailwind.config.js. Proceed?",
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

      // Install dependencies.
      const dependenciesSpinner = ora(`Installing dependencies...`).start()
      await execa(packageManager, [
        packageManager === "npm" ? "install" : "add",
        ...PROJECT_DEPENDENCIES,
      ])
      dependenciesSpinner.succeed()

      // Ensure styles directory exists.
      if (!projectInfo?.appDir) {
        const stylesDir = projectInfo?.srcDir ? "./src/styles" : "./styles"
        if (!existsSync(path.resolve(stylesDir))) {
          await fs.mkdir(path.resolve(stylesDir), { recursive: true })
        }
      }

      // Update styles.css
      let stylesDestination = projectInfo?.srcDir
        ? "./src/styles/globals.css"
        : "./styles/globals.css"
      if (projectInfo?.appDir) {
        stylesDestination = projectInfo?.srcDir
          ? "./src/app/globals.css"
          : "./app/globals.css"
      }
      const stylesSpinner = ora(`Adding styles with CSS variables...`).start()
      await fs.writeFile(stylesDestination, STYLES, "utf8")
      stylesSpinner.succeed()

      // Ensure lib directory exists.
      const libDir = projectInfo?.srcDir ? "./src/lib" : "./lib"
      if (!existsSync(path.resolve(libDir))) {
        await fs.mkdir(path.resolve(libDir), { recursive: true })
      }

      // Create lib/utils.ts
      const utilsDestination = projectInfo?.srcDir
        ? "./src/lib/utils.ts"
        : "./lib/utils.ts"
      const utilsSpinner = ora(`Adding utils...`).start()
      await fs.writeFile(utilsDestination, UTILS, "utf8")
      utilsSpinner.succeed()

      const tailwindDestination = "./tailwind.config.js"
      const tailwindSpinner = ora(`Updating tailwind.config.js...`).start()
      await fs.writeFile(tailwindDestination, TAILWIND_CONFIG, "utf8")
      tailwindSpinner.succeed()
    })

  program
    .command("add")
    .description("add components to your project")
    .argument("[components...]", "name of components")
    .action(async (components: string[]) => {
      logger.warn(
        "Running the following command will overwrite existing files."
      )
      logger.warn(
        "Make sure you have committed your changes before proceeding."
      )
      logger.warn("")

      const availableComponents = await getAvailableComponents()

      if (!availableComponents?.length) {
        logger.error(
          "An error occurred while fetching components. Please try again."
        )
        process.exit(0)
      }

      let selectedComponents = availableComponents.filter((component) =>
        components.includes(component.component)
      )

      if (!selectedComponents?.length) {
        selectedComponents = await promptForComponents(availableComponents)
      }

      const dir = await promptForDestinationDir()

      if (!selectedComponents?.length) {
        logger.warn("No components selected. Nothing to install.")
        process.exit(0)
      }

      // Create componentPath directory if it doesn't exist.
      const destinationDir = path.resolve(dir)
      if (!existsSync(destinationDir)) {
        const spinner = ora(`Creating ${dir}...`).start()
        await fs.mkdir(destinationDir, { recursive: true })
        spinner.succeed()
      }

      logger.success(
        `Installing ${selectedComponents.length} component(s) and dependencies...`
      )
      for (const component of selectedComponents) {
        const componentSpinner = ora(`${component.name}...`).start()

        // Write the files.
        for (const file of component.files) {
          // Replace alias with the project's alias.
          if (projectInfo?.alias) {
            file.content = file.content.replace(/@\//g, projectInfo.alias)
          }

          const filePath = path.resolve(dir, file.name)
          await fs.writeFile(filePath, file.content)
        }

        // Install dependencies.
        if (component.dependencies?.length) {
          await execa(packageManager, [
            packageManager === "npm" ? "install" : "add",
            ...component.dependencies,
          ])
        }
        componentSpinner.succeed(component.name)
      }
    })

  program.parse()
}

async function promptForComponents(components: Component[]) {
  const { components: selectedComponents } = await prompts({
    type: "autocompleteMultiselect",
    name: "components",
    message: "Which component(s) would you like to add?",
    hint: "Space to select. A to select all. I to invert selection.",
    instructions: false,
    choices: components.map((component) => ({
      title: component.name,
      value: component,
    })),
  })

  return selectedComponents
}

async function promptForDestinationDir() {
  const { dir } = await prompts([
    {
      type: "text",
      name: "dir",
      message: "Where would you like to install the component(s)?",
      initial: "./components/ui",
    },
  ])

  return dir
}

main()
