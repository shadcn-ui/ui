import path from "path"
import {
  isPresetBase,
  PRESET_BASES,
  type PresetBase,
} from "@/src/preset/preset"
import { getShadcnRegistryIndex } from "@/src/registry/api"
import { SHADCN_URL } from "@/src/registry/constants"
import { getBase, getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"

const SHADCN_BASE_URL = "https://ui.shadcn.com"

export const docs = new Command()
  .name("docs")
  .description("get docs, api references and usage examples for components")
  .argument("<components...>", "component names")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option(
    "-b, --base <base>",
    "the base to use: base, radix, or aria. defaults to project base."
  )
  .option("--json", "output as JSON.", false)
  .action(async (components, opts) => {
    try {
      const cwd = path.resolve(opts.cwd)
      const config = await getConfig(cwd)
      const base = resolveDocsBase(opts.base, config?.style)

      const index = await getShadcnRegistryIndex()

      if (!index) {
        logger.error("Failed to fetch the registry index.")
        process.exit(1)
      }

      const results: {
        component: string
        base: PresetBase
        links: Record<string, string>
      }[] = []

      for (const component of components) {
        const item = index.find((entry) => entry.name === component)

        if (!item) {
          logger.error(
            `Component ${highlighter.info(
              component
            )} not found in the shadcn registry.`
          )
          process.exit(1)
        }

        const links = (
          item.meta?.links as Record<string, Record<string, string>>
        )?.[base]

        if (!links || Object.keys(links).length === 0) {
          logger.warn(
            `No documentation links available for ${highlighter.info(
              component
            )}.`
          )
          continue
        }

        results.push({
          component,
          base,
          links: normalizeLinks(links),
        })
      }

      if (opts.json) {
        console.log(JSON.stringify({ base, results }, null, 2))
        return
      }

      // Compute max key length across all results for consistent alignment.
      const maxKeyLength = Math.max(
        ...results.flatMap((r) => Object.keys(r.links).map((k) => k.length))
      )

      for (const { component, links } of results) {
        logger.log(highlighter.info(component))
        for (const [key, value] of Object.entries(links)) {
          logger.log(`  - ${key.padEnd(maxKeyLength + 2)}${value}`)
        }
        logger.break()
      }
    } catch (error) {
      handleError(error)
    }
  })

export function resolveDocsBase(base: unknown, style: string | undefined) {
  const resolvedBase = base ?? getBase(style)

  if (!isPresetBase(resolvedBase)) {
    throw new Error(
      `Invalid base: ${String(resolvedBase)}. Expected one of: ${PRESET_BASES.join(
        ", "
      )}.`
    )
  }

  return resolvedBase
}

function normalizeLinks(links: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(links).map(([key, value]) => [
      key,
      value.startsWith(SHADCN_BASE_URL)
        ? `${SHADCN_URL}${value.slice(SHADCN_BASE_URL.length)}`
        : value,
    ])
  )
}
