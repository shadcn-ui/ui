import path from "path"
import { preFlightAdd } from "@/src/preflights/preflight-add"
import { addComponents } from "@/src/utils/add-components"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { getRegistryIndex } from "@/src/utils/registry"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  verbose: z.boolean(),
})

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument(
    "[components...]",
    "the components to add or a url to the component."
  )
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .option("-v, --verbose", "verbose output.", false)
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        components,
        cwd: path.resolve(opts.cwd),
        ...opts,
      })

      const { config } = await preFlightAdd(options)

      if (!options.components?.length) {
        logger.info("")
        options.components = await promptForRegistryComponents(options)
        logger.info("")
      }

      await addComponents(options.components, config, options)
    } catch (error) {
      handleError(error)
    }
  })

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>
) {
  const registryIndex = await getRegistryIndex()
  if (!registryIndex) {
    logger.error("")
    handleError(new Error("Failed to fetch registry index."))
    return []
  }

  if (options.all) {
    return registryIndex.map((entry) => entry.name)
  }

  if (options.components?.length) {
    return options.components
  }

  const { components } = await prompts({
    type: "multiselect",
    name: "components",
    message: "Which components would you like to add?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: registryIndex
      .filter((entry) => entry.type === "registry:ui")
      .map((entry) => ({
        title: entry.name,
        value: entry.name,
        selected: options.all ? true : options.components?.includes(entry.name),
      })),
  })

  if (!components?.length) {
    logger.warn("No components selected. Exiting.")
    logger.info("")
    process.exit(1)
  }

  const result = z.array(z.string()).safeParse(components)
  if (!result.success) {
    logger.error("")
    handleError(new Error("Something went wrong. Please try again."))
    return []
  }
  return result.data
}
