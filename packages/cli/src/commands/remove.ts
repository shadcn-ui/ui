import { existsSync, promises as fs } from "fs"
import path from "path"
import { getConfig } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  fetchTree,
  getItemTargetPath,
  getRegistryIndex,
  resolveTree,
} from "@/src/utils/registry"
import chalk from "chalk"
import { Command } from "commander"
import { execa } from "execa"
import ora from "ora"
import prompts from "prompts"
import * as z from "zod"

const addOptionsSchema = z.object({
  components: z.array(z.string()),
  yes: z.boolean(),
  cwd: z.string().optional(),
  all: z.boolean(),
  path: z.string().optional(),
  dependencies: z.boolean(),
})

export function createRemoveCommand() {
  return new Command()
    .name("remove")
    .alias("rm")
    .description("remove a component from your project")
    .argument("[components...]", "the components to remove")
    .option("-y, --yes", "skip confirmation prompt.", false)
    .option("-d, --dependencies", "remove dependencies", false)
    .option(
      "-c, --cwd <cwd>",
      "the working directory. defaults to the current directory."
    )
    .option("-a, --all", "remove all components", false)
    .option("-p, --path <path>", "the path to remove the component.")
    .action(async (components, opts) => {
      try {
        const options = addOptionsSchema.parse({
          components,
          ...opts,
        })

        const cwd = path.resolve(options.cwd || process.cwd())

        if (!existsSync(cwd)) {
          logger.error(`The path ${cwd} does not exist. Please try again.`)
          return process.exit(1)
        }

        const config = await getConfig(cwd)
        if (!config) {
          logger.warn(
            `Configuration is missing. Please run ${chalk.green(
              `init`
            )} to create a components.json file.`
          )
          return process.exit(1)
        }

        const spinner = ora(`Searching installed components...`)
        spinner.start()
        const registryIndex = await getRegistryIndex()

        let selectedComponents = options.components.length
          ? options.components
          : registryIndex.map((entry) => entry.name)

        const tree = await resolveTree(
          registryIndex,
          registryIndex.map((entry) => entry.name)
        )
        const payload = await fetchTree(config.style, tree)

        let existingComponents: typeof payload = await payload.reduce(
          async (asyncAcc, item) => {
            const acc: typeof payload = await asyncAcc
            const targetDir = await getItemTargetPath(
              config,
              item,
              options.path ? path.resolve(cwd, options.path) : undefined
            )

            if (!targetDir) {
              return acc
            }

            const existingComponent = item.files.filter((file) =>
              existsSync(path.resolve(targetDir, file.name))
            )

            if (existingComponent.length) {
              acc.push(item)
            }

            return acc
          },
          Promise.resolve([]) as Promise<typeof payload>
        )

        if (!existingComponents.length) {
          logger.warn("No components found. Exiting.")
          return process.exit(1)
        }

        spinner.stop()

        if (!options.components?.length && !options.all) {
          const { components } = await prompts({
            type: "multiselect",
            name: "components",
            message: "Which components would you like to remove?",
            hint: "Space to select. A to toggle all. Enter to submit.",
            instructions: false,
            choices: registryIndex
              .filter((entry) =>
                existingComponents.map((item) => item.name).includes(entry.name)
              )
              .map((entry) => ({
                title: entry.name,
                value: entry.name,
                selected: options.all
                  ? true
                  : options.components?.includes(entry.name),
              })),
          })
          selectedComponents = components || []
        }

        if (!selectedComponents.length) {
          logger.warn("You didn't choose components to remove. Exiting.")
          return process.exit(0)
        }

        let removeDependencies = options.yes || options.dependencies
        if (!options.yes) {
          const { proceed } = await prompts({
            type: "confirm",
            name: "proceed",
            message: `Ready to remove components. Proceed?`,
            initial: true,
          })

          if (!proceed) {
            return process.exit(0)
          }

          if (!removeDependencies) {
            const { confirm } = await prompts({
              type: "confirm",
              name: "confirm",
              message: `would you like to remove dependencies of components?`,
              initial: true,
            })
            removeDependencies = confirm
          }
        }

        for (const component of selectedComponents) {
          spinner.start(`Removing ${component}...`)

          const item = existingComponents.find(
            (item) => item.name === component
          )

          if (!item) {
            continue
          }

          const targetDir = await getItemTargetPath(
            config,
            item,
            options.path ? path.resolve(cwd, options.path) : undefined
          )

          if (!targetDir) {
            continue
          }

          const dependentComponents = existingComponents.filter((_item) =>
            _item.registryDependencies?.includes(component)
          )

          if (dependentComponents.length) {
            let skipComponentRemove = false
            for (const dependent of dependentComponents) {
              if (!selectedComponents.includes(dependent.name)) {
                logger.warn(
                  `\nYou can't remove ${chalk.red(
                    `${component}`
                  )} because ${chalk.red(`${dependent.name}`)} depends on it.`
                )
                skipComponentRemove = true
                break
              }
            }

            if (skipComponentRemove) {
              continue
            }
          }

          for (const file of item.files) {
            let filePath = path.resolve(targetDir, file.name)

            if (!config.tsx) {
              filePath = filePath.replace(/\.tsx$/, ".jsx")
              filePath = filePath.replace(/\.ts$/, ".js")
            }

            await fs.rm(filePath)
          }

          // Remove this uninstalled component from existing components list
          existingComponents = existingComponents.filter(
            (item) => item.name !== component
          )

          // remove dependencies.
          if (item.dependencies?.length) {
            if (removeDependencies) {
              const usedDependencies = existingComponents.flatMap(
                (_item) => _item.dependencies
              )
              const dependenciesToRemove = item.dependencies.filter(
                (dependency) => !usedDependencies.includes(dependency)
              )

              if (dependenciesToRemove.length) {
                const packageManager = await getPackageManager(cwd)
                await execa(
                  packageManager,
                  [
                    packageManager === "npm" ? "uninstall" : "remove",
                    ...dependenciesToRemove,
                  ],
                  {
                    cwd,
                  }
                )
              }
            }
          }
        }

        spinner.succeed(`Done.`)
      } catch (error) {
        handleError(error)
      }
    })
}
