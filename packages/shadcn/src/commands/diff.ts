import { existsSync, promises as fs } from "fs"
import path from "path"
import { Config, getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import {
  fetchTree,
  getItemTargetPath,
  getRegistryBaseColor,
  getRegistryIndex,
} from "@/src/utils/registry"
import { registryIndexSchema } from "@/src/utils/registry/schema"
import { transform } from "@/src/utils/transformers"
import { Command } from "commander"
import { diffLines, type Change } from "diff"
import { z } from "zod"

const updateOptionsSchema = z.object({
  component: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
  registry: z.string().optional(),
})

export const diff = new Command()
  .name("diff")
  .description("check for updates against the registry")
  .argument("[component]", "the component name")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("--registry <url>", "custom registry URL")
  .action(async (name, opts) => {
    try {
      const options = updateOptionsSchema.parse({
        component: name,
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
          `Configuration is missing. Please run ${highlighter.success(
            `init`
          )} to create a components.json file.`
        )
        process.exit(1)
      }

      const registryIndex = await getRegistryIndex(options.registry)

      if (!registryIndex) {
        handleError(new Error("Failed to fetch registry index."))
        process.exit(1)
      }

      if (!options.component) {
        const targetDir = config.resolvedPaths.components

        // Find all components that exist in the project.
        const projectComponents = registryIndex.filter((item) => {
          for (const file of item.files ?? []) {
            const filePath = path.resolve(
              targetDir,
              typeof file === "string" ? file : file.path
            )
            if (existsSync(filePath)) {
              return true
            }
          }

          return false
        })

        // Check for updates.
        const componentsWithUpdates = []
        for (const component of projectComponents) {
          const changes = await diffComponent(component, config)
          if (changes.length) {
            componentsWithUpdates.push({
              name: component.name,
              changes,
            })
          }
        }

        if (!componentsWithUpdates.length) {
          logger.info("No updates found.")
          process.exit(0)
        }

        logger.info("The following components have updates available:")
        for (const component of componentsWithUpdates) {
          logger.info(`- ${component.name}`)
          for (const change of component.changes) {
            logger.info(`  - ${change.filePath}`)
          }
        }
        logger.break()
        logger.info(
          `Run ${highlighter.success(`diff <component>`)} to see the changes.`
        )
        process.exit(0)
      }

      // Show diff for a single component.
      const component = registryIndex.find(
        (item) => item.name === options.component
      )

      if (!component) {
        logger.error(
          `The component ${highlighter.success(
            options.component
          )} does not exist.`
        )
        process.exit(1)
      }

      const changes = await diffComponent(component, config)

      if (!changes.length) {
        logger.info(`No updates found for ${options.component}.`)
        process.exit(0)
      }

      for (const change of changes) {
        logger.info(`- ${change.filePath}`)
        await printDiff(change.patch)
        logger.info("")
      }
    } catch (error) {
      handleError(error)
    }
  })

async function diffComponent(
  component: z.infer<typeof registryIndexSchema>[number],
  config: Config
) {
  const payload = await fetchTree(config.style, [component])
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  if (!payload) {
    return []
  }

  const changes = []

  for (const item of payload) {
    const targetDir = await getItemTargetPath(config, item)

    if (!targetDir) {
      continue
    }

    for (const file of item.files ?? []) {
      const filePath = path.resolve(
        targetDir,
        typeof file === "string" ? file : file.path
      )

      if (!existsSync(filePath)) {
        continue
      }

      const fileContent = await fs.readFile(filePath, "utf8")

      if (typeof file === "string" || !file.content) {
        continue
      }

      const registryContent = await transform({
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
      })

      const patch = diffLines(registryContent as string, fileContent)
      if (patch.length > 1) {
        changes.push({
          filePath,
          patch,
        })
      }
    }
  }

  return changes
}

async function printDiff(diff: Change[]) {
  diff.forEach((part) => {
    if (part) {
      if (part.added) {
        return process.stdout.write(highlighter.success(part.value))
      }
      if (part.removed) {
        return process.stdout.write(highlighter.error(part.value))
      }

      return process.stdout.write(part.value)
    }
  })
}
