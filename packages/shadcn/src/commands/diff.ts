import { existsSync, promises as fs } from "fs"
import path from "path"
import {
  fetchTree,
  getItemTargetPath,
  getRegistryBaseColor,
  getShadcnRegistryIndex,
} from "@/src/registry/api"
import { registryIndexSchema } from "@/src/schema"
import { getSupportedFontMarkers } from "@/src/utils/font-markers"
import { Config, getConfig } from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { transform } from "@/src/utils/transformers"
import { transformCleanup } from "@/src/utils/transformers/transform-cleanup"
import { transformCssVars } from "@/src/utils/transformers/transform-css-vars"
import { transformFont } from "@/src/utils/transformers/transform-font"
import { transformIcons } from "@/src/utils/transformers/transform-icons"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { transformMenu } from "@/src/utils/transformers/transform-menu"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { transformRtl } from "@/src/utils/transformers/transform-rtl"
import { transformTwPrefixes } from "@/src/utils/transformers/transform-tw-prefix"
import { Command } from "commander"
import { diffLines, type Change } from "diff"
import { z } from "zod"

const updateOptionsSchema = z.object({
  component: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
})

export const diff = new Command()
  .name("diff")
  .description("[DEPRECATED] Use `add [component] --diff` instead.")
  .argument("[component]", "the component name")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
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
        // Check if we're in a monorepo root.
        if (await isMonorepoRoot(cwd)) {
          const targets = await getMonorepoTargets(cwd)
          if (targets.length > 0) {
            formatMonorepoMessage("diff [component]", targets)
            process.exit(1)
          }
        }

        logger.warn(
          `Configuration is missing. Please run ${highlighter.success(
            `init`
          )} to create a components.json file.`
        )
        process.exit(1)
      }

      const registryIndex = await getShadcnRegistryIndex()

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
  const supportedFontMarkers = getSupportedFontMarkers(payload)

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

      const registryContent = await transform(
        {
          filename: file.path,
          raw: file.content,
          config,
          baseColor,
          supportedFontMarkers,
        },
        [
          transformImport,
          transformRsc,
          transformCssVars,
          transformTwPrefixes,
          transformIcons,
          transformMenu,
          transformRtl,
          transformFont,
          transformCleanup,
        ]
      )

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
