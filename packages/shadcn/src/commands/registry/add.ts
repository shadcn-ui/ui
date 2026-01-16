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

// Detect registry-only arguments:
// - "@magicui" (lookup from index)
// - "@mycompany=https://..." (custom URL)
// But NOT "@magicui/button" (component).
export function isRegistryOnlyArg(arg: string) {
  if (!arg.startsWith("@")) return false
  if (arg.includes("=")) return true
  return !arg.includes("/")
}

// Parse registry argument into namespace and optional URL.
export function parseRegistryArg(arg: string): {
  namespace: string
  url?: string
} {
  if (arg.includes("=")) {
    const [namespace, ...rest] = arg.split("=")
    return { namespace, url: rest.join("=") }
  }
  return { namespace: arg }
}

export const addOptionsSchema = z.object({
  registries: z.array(z.string()).optional(),
  cwd: z.string(),
  silent: z.boolean(),
})

// Add registries to components.json.
async function addRegistriesToConfig(
  registryArgs: string[],
  cwd: string,
  options: { silent?: boolean }
) {
  // Check for components.json first.
  const configPath = path.resolve(cwd, "components.json")
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No ${highlighter.info("components.json")} found. Run ${highlighter.info(
        "shadcn init"
      )} first.`
    )
  }

  // Parse all registry args.
  const parsed = registryArgs.map(parseRegistryArg)

  // Fetch registries for those without custom URLs.
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

  // Resolve URLs and validate.
  const registriesToAdd: Record<string, string> = {}
  for (const { namespace, url } of parsed) {
    // Check for built-in registry.
    if (namespace in BUILTIN_REGISTRIES) {
      logger.warn(
        `${highlighter.info(
          namespace
        )} is a built-in registry and cannot be added.`
      )
      continue
    }

    if (url) {
      // Custom URL - validate it has {name} placeholder.
      if (!url.includes("{name}")) {
        throw new Error(
          `Invalid registry URL for ${highlighter.info(
            namespace
          )}. URL must include {name} placeholder.`
        )
      }
      registriesToAdd[namespace] = url
    } else {
      // Lookup from index.
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

  // Filter out already-added registries.
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
        `Skipped ${skipped.length} ${
          skipped.length === 1 ? "registry" : "registries"
        }: (already configured)`,
        { silent: options.silent }
      )?.info()
      for (const name of skipped) {
        logger.log(`  - ${name}`)
      }
    } else if (!options.silent) {
      logger.info("No new registries to add.")
    }
    return { addedRegistries: [] }
  }

  // Write updated config.
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
      `Added ${newRegistryNames.length} ${
        newRegistryNames.length === 1 ? "registry" : "registries"
      }:`,
      { silent: options.silent }
    )?.succeed()
    for (const name of newRegistryNames) {
      logger.log(`  - ${name}`)
    }

    if (skipped.length > 0) {
      spinner(
        `Skipped ${skipped.length} ${
          skipped.length === 1 ? "registry" : "registries"
        }: (already configured)`,
        { silent: options.silent }
      )?.info()
      for (const name of skipped) {
        logger.log(`  - ${name}`)
      }
    }
  }

  return { addedRegistries: Object.keys(newRegistries) }
}

// Show interactive picker when no args provided.
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

  // Sort alphabetically.
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
  .action(async (registries, opts) => {
    try {
      const options = addOptionsSchema.parse({
        registries,
        cwd: path.resolve(opts.cwd),
        ...opts,
      })

      let registryArgs = registries as string[]

      // If no registries provided, show interactive picker.
      if (!registryArgs.length) {
        registryArgs = await promptForRegistries({ silent: options.silent })
      }

      await addRegistriesToConfig(registryArgs, options.cwd, {
        silent: options.silent,
      })
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
