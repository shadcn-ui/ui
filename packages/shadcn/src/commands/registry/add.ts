import path from "path"
import { getRegistries } from "@/src/registry/api"
import { BUILTIN_REGISTRIES } from "@/src/registry/constants"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import fs from "fs-extra"
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

      const registryArgs =
        registries.length > 0
          ? registries
          : await promptForRegistries({ silent: options.silent })

      await addRegistriesToConfig(registryArgs, options.cwd, {
        silent: options.silent,
      })
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

export function parseRegistryArg(arg: string): {
  namespace: string
  url?: string
} {
  const [namespace, ...rest] = arg.split("=")
  const url = rest.length > 0 ? rest.join("=") : undefined

  if (!namespace.startsWith("@")) {
    throw new Error(
      `Invalid registry namespace: ${highlighter.info(namespace)}. ` +
        `Registry names must start with @ (e.g., @acme).`
    )
  }

  return { namespace, url }
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

async function addRegistriesToConfig(
  registryArgs: string[],
  cwd: string,
  options: { silent?: boolean }
) {
  const configPath = path.resolve(cwd, "components.json")
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No ${highlighter.info("components.json")} found. Run ${highlighter.info(
        "shadcn init"
      )} first.`
    )
  }

  const parsed = registryArgs.map(parseRegistryArg)
  const needsLookup = parsed.filter((p) => !p.url)
  let registriesIndex: { name: string; url: string }[] = []
  if (needsLookup.length > 0) {
    const fetchSpinner = spinner("Fetching registries.", {
      silent: options.silent,
    }).start()
    const registries = await getRegistries()
    if (!registries) {
      fetchSpinner.fail()
      throw new Error("Failed to fetch registries.")
    }
    fetchSpinner.succeed()
    registriesIndex = registries
  }

  const registriesToAdd: Record<string, string> = {}
  for (const { namespace, url } of parsed) {
    if (namespace in BUILTIN_REGISTRIES) {
      logger.warn(
        `${highlighter.info(
          namespace
        )} is a built-in registry and cannot be added.`
      )
      continue
    }

    if (url) {
      if (!url.includes("{name}")) {
        throw new Error(
          `Invalid registry URL for ${highlighter.info(
            namespace
          )}. URL must include {name} placeholder. Example: ${highlighter.info(
            `${namespace}=https://example.com/r/{name}.json`
          )}`
        )
      }
      registriesToAdd[namespace] = url
    } else {
      const registry = registriesIndex.find((r) => r.name === namespace)
      if (!registry) {
        throw new Error(
          `Registry ${highlighter.info(namespace)} not found. ` +
            `Provide a URL: ${highlighter.info(
              `${namespace}=https://.../{name}.json`
            )}`
        )
      }
      registriesToAdd[namespace] = registry.url
    }
  }

  if (Object.keys(registriesToAdd).length === 0) {
    return { addedRegistries: [] }
  }

  const existingConfig = await fs.readJson(configPath)
  const existingRegistries = existingConfig.registries || {}
  const newRegistries: Record<string, string> = {}
  const skipped: string[] = []
  for (const [ns, url] of Object.entries(registriesToAdd)) {
    if (existingRegistries[ns]) {
      skipped.push(ns)
    } else {
      newRegistries[ns] = url
    }
  }

  if (Object.keys(newRegistries).length === 0) {
    if (skipped.length > 0 && !options.silent) {
      spinner(
        `Skipped ${pluralize(
          skipped.length,
          "registry",
          "registries"
        )}: (already configured)`,
        { silent: options.silent }
      )?.info()
      for (const name of skipped) {
        logger.log(`  - ${name}`)
      }
    } else if (!options.silent) {
      logger.info("No new registries to add.")
    }
    return
  }

  const updatedConfig = {
    ...existingConfig,
    registries: {
      ...existingRegistries,
      ...newRegistries,
    },
  }

  const writeSpinner = spinner("Updating components.json.", {
    silent: options.silent,
  }).start()
  await fs.writeJson(configPath, updatedConfig, { spaces: 2 })
  writeSpinner.succeed()

  if (!options.silent) {
    const newRegistryNames = Object.keys(newRegistries)
    spinner(
      `Added ${pluralize(newRegistryNames.length, "registry", "registries")}:`,
      { silent: options.silent }
    )?.succeed()
    for (const name of newRegistryNames) {
      logger.log(`  - ${name}`)
    }

    if (skipped.length > 0) {
      spinner(
        `Skipped ${pluralize(
          skipped.length,
          "registry",
          "registries"
        )}: (already configured)`,
        { silent: options.silent }
      )?.info()
      for (const name of skipped) {
        logger.log(`  - ${name}`)
      }
    }
  }
}

async function promptForRegistries(options: { silent?: boolean }) {
  const fetchSpinner = spinner("Fetching registries.", {
    silent: options.silent,
  }).start()
  const registries = await getRegistries()
  if (!registries) {
    fetchSpinner.fail()
    throw new Error("Failed to fetch registries.")
  }
  fetchSpinner.succeed()

  const sorted = [...registries].sort((a, b) => a.name.localeCompare(b.name))

  const { selected } = await prompts({
    type: "autocompleteMultiselect",
    name: "selected",
    message: "Which registries would you like to add?",
    hint: "Space to select. A to toggle all. Enter to submit.",
    instructions: false,
    choices: sorted.map((r) => ({
      title: r.name,
      description: r.description,
      value: r.name,
    })),
  })

  if (!selected?.length) {
    logger.warn("No registries selected. Exiting.")
    logger.info("")
    process.exit(1)
  }

  return selected as string[]
}
