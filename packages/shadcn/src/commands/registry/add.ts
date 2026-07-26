import path from "path"
import { getRegistries } from "@/src/registry/api"
import { addRegistriesToConfig } from "@/src/registry/project-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

const addOptionsSchema = z.object({
  cwd: z.string(),
  silent: z.boolean(),
})

export const add = new Command()
  .name("add")
  .description("add registries to your project")
  .argument(
    "[registries...]",
    "registries (@namespace) or registry URLs (@namespace=url)"
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --silent", "mute output.", false)
  .action(async (registries: string[], opts) => {
    try {
      const options = addOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        silent: opts.silent,
      })
      const registryArguments =
        registries.length > 0
          ? registries
          : await promptForRegistries({ silent: options.silent })
      const result = await addRegistriesToConfig(registryArguments, {
        cwd: options.cwd,
      })
      if (result.addedRegistries.length > 0) {
        spinner("Updated components.json.", {
          silent: options.silent,
        }).succeed()
      }
      printResult(result, options)
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

function printResult(
  result: Awaited<ReturnType<typeof addRegistriesToConfig>>,
  options: { silent?: boolean }
) {
  if (options.silent) {
    return
  }

  if (result.addedRegistries.length > 0) {
    spinner(
      `Added ${pluralize(
        result.addedRegistries.length,
        "registry",
        "registries"
      )}:`
    )?.succeed()
    for (const namespace of result.addedRegistries) {
      logger.log(`  - ${namespace}`)
    }
  } else if (result.skippedRegistries.length === 0) {
    logger.info("No new registries to add.")
  }

  for (const skipped of result.skippedRegistries) {
    if (skipped.reason === "built-in") {
      logger.warn(
        `${highlighter.info(
          skipped.namespace
        )} is a built-in registry and cannot be added.`
      )
    }
  }

  const alreadyConfigured = result.skippedRegistries
    .filter((entry) => entry.reason === "already-configured")
    .map((entry) => entry.namespace)
  if (alreadyConfigured.length > 0) {
    spinner(
      `Skipped ${pluralize(
        alreadyConfigured.length,
        "registry",
        "registries"
      )}: (already configured)`
    )?.info()
    for (const namespace of alreadyConfigured) {
      logger.log(`  - ${namespace}`)
    }
  }
}

async function promptForRegistries(options: { silent?: boolean }) {
  const fetchSpinner = spinner("Fetching registries.", {
    silent: options.silent,
  }).start()
  const registries = await getRegistries()
  fetchSpinner.succeed()

  const sorted = [...registries].sort((a, b) => a.name.localeCompare(b.name))
  const { selected } = await prompts({
    type: "autocompleteMultiselect",
    name: "selected",
    message: "Which registries would you like to add?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: sorted.map((registry) => ({
      title: registry.name,
      description: registry.description,
      value: registry.name,
    })),
  })

  if (!selected?.length) {
    logger.warn("No registries selected. Exiting.")
    logger.info("")
    process.exit(1)
  }

  return selected as string[]
}
