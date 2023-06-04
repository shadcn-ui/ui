import { existsSync, promises as fs } from "fs"
import path from "path"
import { getConfig } from "@/src/utils/get-config"
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
import ora from "ora"
import prompts from "prompts"
import * as z from "zod"

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  path: z.string().optional(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
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

      let selectedComponents = options.components
      if (!options.components?.length) {
        const { components } = await prompts({
          type: "autocompleteMultiselect",
          name: "components",
          message: "Which components would you like to add?",
          hint: "Space to select. Return to submit.",
          instructions: false,
          choices: registryIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
          })),
        })
        selectedComponents = components
      }

      if (!selectedComponents?.length) {
        process.exit(0)
      }

      const tree = await resolveTree(registryIndex, selectedComponents)
      const payload = await fetchTree(config.style, tree)

      logger.success(
        `Installing ${selectedComponents.length} components and dependencies...`
      )
      for (const item of payload) {
        const spinner = ora(`${item.name}...`).start()
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

        for (const file of item.files) {
          const filePath = path.resolve(targetDir, file.name)
          await fs.writeFile(filePath, file.content)
        }
        spinner.succeed(item.name)
      }
    } catch (error) {
      handleError(error)
    }
  })
