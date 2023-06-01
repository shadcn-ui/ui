import { existsSync } from "fs"
import path from "path"
import { getAvailableComponents } from "@/src/utils/get-components"
import { getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { resolveTree } from "@/src/utils/resolve-tree"
import chalk from "chalk"
import { Command } from "commander"
import prompts from "prompts"
import * as z from "zod"

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  yes: z.boolean(),
  path: z.string().optional(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option(
    "-p, --path <path>",
    "the path to add the component to. defaults to the components directory."
  )
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      })

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message:
            "Running this command will overwrite existing files. Proceed?",
          initial: true,
        })

        if (!proceed) {
          process.exit(0)
        }
      }

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
          )} create a components.json file.`
        )
        process.exit(1)
      }

      const allComponents = await getAvailableComponents()

      let selectedComponents = options.components
      if (!options.components?.length) {
        const { components } = await prompts({
          type: "autocompleteMultiselect",
          name: "components",
          message: "Which components would you like to add?",
          hint: "Space to select. Return to submit.",
          instructions: false,

          choices: allComponents.map(({ name }) => ({
            title: name,
            value: name,
          })),
        })
        selectedComponents = components
      }

      if (!selectedComponents?.length) {
        process.exit(0)
      }

      const resolvedComponents = await resolveTree(
        allComponents,
        selectedComponents
      )

      console.log({
        resolvedComponents,
      })

      logger.info("")
      logger.info(
        `${chalk.green("Success!")} Project initialization completed.`
      )
      logger.info("")
    } catch (error) {
      handleError(error)
    }
  })
