import { existsSync } from "fs"
import path from "path"
import { SHADCN_URL } from "@/src/registry/constants"
import { getBase, getConfig } from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import {
  getProjectComponents,
  getProjectInfo,
  type ProjectInfo,
} from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/v4/registry/bases"

export const info = new Command()
  .name("info")
  .description("get information about your project")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("--json", "output as JSON.", false)
  .action(async (opts) => {
    try {
      const cwd = path.resolve(opts.cwd)

      // Check if we're in a monorepo root.
      if (
        !existsSync(path.resolve(cwd, "components.json")) &&
        (await isMonorepoRoot(cwd))
      ) {
        const targets = await getMonorepoTargets(cwd)
        if (targets.length > 0) {
          if (opts.json) {
            console.log(
              JSON.stringify(
                {
                  error: "monorepo_root",
                  message:
                    "You are running info from a monorepo root. Use the -c flag to specify a workspace.",
                  targets: targets.map((t) => t.name),
                },
                null,
                2
              )
            )
          } else {
            formatMonorepoMessage("info", targets)
          }
          process.exit(1)
        }
      }

      const projectInfo = await getProjectInfo(cwd)
      const config = await getConfig(cwd)
      const components = await getProjectComponents(cwd)
      const base = getBase(config?.style)
      const data = collectInfo(projectInfo, config, components, base)

      if (opts.json) {
        console.log(JSON.stringify(data, null, 2))
        return
      }

      printInfo(data)
    } catch (error) {
      handleError(error)
    }
  })

function getRegistries(
  registries: Record<string, string | { url: string }> | undefined
) {
  if (!registries) {
    return {}
  }

  const result: Record<string, string> = {}
  for (const [name, value] of Object.entries(registries)) {
    result[name] = typeof value === "string" ? value : value.url
  }
  return result
}

function collectInfo(
  projectInfo: ProjectInfo | null,
  config: Awaited<ReturnType<typeof getConfig>>,
  components: string[],
  base: string
) {
  return {
    project: projectInfo
      ? {
          framework: projectInfo.framework.label,
          frameworkName: projectInfo.framework.name,
          frameworkVersion: projectInfo.frameworkVersion ?? null,
          srcDirectory: projectInfo.isSrcDir,
          rsc: projectInfo.isRSC,
          typescript: projectInfo.isTsx,
          tailwindVersion: projectInfo.tailwindVersion ?? null,
          tailwindConfig: projectInfo.tailwindConfigFile ?? null,
          tailwindCss: projectInfo.tailwindCssFile ?? null,
          importAlias: projectInfo.aliasPrefix ?? null,
        }
      : null,
    config: config
      ? {
          style: config.style,
          base,
          rsc: config.rsc,
          typescript: config.tsx,
          iconLibrary: config.iconLibrary ?? null,
          rtl: config.rtl ?? false,
          menuColor: config.menuColor ?? null,
          menuAccent: config.menuAccent ?? null,
          aliases: {
            components: config.aliases.components,
            utils: config.aliases.utils,
            ui: config.aliases.ui ?? null,
            lib: config.aliases.lib ?? null,
            hooks: config.aliases.hooks ?? null,
          },
          resolvedPaths: {
            cwd: config.resolvedPaths.cwd,
            tailwindConfig: config.resolvedPaths.tailwindConfig || null,
            tailwindCss: config.resolvedPaths.tailwindCss || null,
            utils: config.resolvedPaths.utils,
            components: config.resolvedPaths.components,
            lib: config.resolvedPaths.lib,
            hooks: config.resolvedPaths.hooks,
            ui: config.resolvedPaths.ui,
          },
          registries: getRegistries(config.registries),
        }
      : null,
    components,
    links: {
      docs: `${SHADCN_URL}/docs`,
      components: `${SHADCN_URL}/docs/components/${base}/[component].md`,
      ui: `${GITHUB_RAW_BASE}/${base}/ui/[component].tsx`,
      examples: `${GITHUB_RAW_BASE}/${base}/examples/[component]-example.tsx`,
      schema: "https://ui.shadcn.com/schema.json",
    },
  }
}

function printInfo(data: ReturnType<typeof collectInfo>) {
  // Project.
  logger.log(highlighter.info("Project"))
  if (data.project) {
    printEntries({
      framework: `${data.project.framework} (${data.project.frameworkName})`,
      frameworkVersion: data.project.frameworkVersion ?? "-",
      srcDirectory: data.project.srcDirectory ? "Yes" : "No",
      rsc: data.project.rsc ? "Yes" : "No",
      typescript: data.project.typescript ? "Yes" : "No",
      tailwindVersion: data.project.tailwindVersion ?? "-",
      tailwindConfig: data.project.tailwindConfig ?? "-",
      tailwindCss: data.project.tailwindCss ?? "-",
      importAlias: data.project.importAlias ?? "-",
    })
  } else {
    logger.log("  No project info detected.")
  }

  // Config.
  logger.break()
  logger.log(highlighter.info("Configuration"))
  if (data.config) {
    printEntries({
      style: data.config.style,
      base: data.config.base,
      rsc: data.config.rsc ? "Yes" : "No",
      typescript: data.config.typescript ? "Yes" : "No",
      iconLibrary: data.config.iconLibrary ?? "-",
      rtl: data.config.rtl ? "Yes" : "No",
      menuColor: data.config.menuColor ?? "-",
      menuAccent: data.config.menuAccent ?? "-",
    })

    // Aliases.
    logger.break()
    logger.log(highlighter.info("Aliases"))
    printEntries({
      components: data.config.aliases.components,
      utils: data.config.aliases.utils,
      ui: data.config.aliases.ui ?? "-",
      lib: data.config.aliases.lib ?? "-",
      hooks: data.config.aliases.hooks ?? "-",
    })

    // Resolved paths.
    logger.break()
    logger.log(highlighter.info("Resolved Paths"))
    printEntries({
      cwd: data.config.resolvedPaths.cwd,
      tailwindConfig: data.config.resolvedPaths.tailwindConfig ?? "-",
      tailwindCss: data.config.resolvedPaths.tailwindCss ?? "-",
      utils: data.config.resolvedPaths.utils,
      components: data.config.resolvedPaths.components,
      lib: data.config.resolvedPaths.lib,
      hooks: data.config.resolvedPaths.hooks,
      ui: data.config.resolvedPaths.ui,
    })

    // Registries.
    if (Object.keys(data.config.registries).length > 0) {
      logger.break()
      logger.log("registries:")
      printEntries(data.config.registries)
    }
  } else {
    logger.log("  No components.json found.")
  }

  // Installed components.
  logger.break()
  logger.log(highlighter.info("Installed Components"))
  if (data.components.length > 0) {
    logger.log(`  ${data.components.join(", ")}`)
  } else {
    logger.log("  No components installed.")
  }

  // Links.
  logger.break()
  logger.log(highlighter.info("Links"))
  printEntries(data.links)

  logger.break()
}

function printEntries(entries: Record<string, string>) {
  const maxKeyLength = Math.max(...Object.keys(entries).map((k) => k.length))
  for (const [key, value] of Object.entries(entries)) {
    logger.log(`  ${key.padEnd(maxKeyLength + 2)}${value}`)
  }
}
