import { existsSync } from "fs"
import fs from "fs/promises"
import { homedir } from "os"
import path from "path"
import { collectInfo } from "@/src/commands/info"
import type { DryRunResult } from "@/src/utils/dry-run"
import { getRegistriesConfig } from "@/src/registry/api"
import { structuredPatch } from "diff"
import { registryItemSchema, searchResultsSchema } from "@/src/schema"
import { getBase, getConfig } from "@/src/utils/get-config"
import {
  getProjectComponents,
  getProjectInfo,
} from "@/src/utils/get-project-info"
import { z } from "zod"

export { getBase, getConfig, getProjectComponents, getProjectInfo }

const SHADCN_CLI_COMMAND = "shadcn@latest"

const SKILLS_SEARCH_PATHS = [
  ".claude/skills",
  ".cursor/skills",
  ".copilot/skills",
  ".codex/skills",
  ".junie/skills", // Junie
  ".config/agents/skills", // Kimi CLI
  ".config/opencode/skills", // OpenCode
  "skills",
]

export const SKILLS_TOPICS = [
  "styling",
  "forms",
  "icons",
  "composition",
  "base-vs-radix",
  "cli",
  "customization",
  "mcp",
] as const

export type SkillsTopic = (typeof SKILLS_TOPICS)[number]

const TOPIC_TO_FILE: Record<SkillsTopic, string> = {
  styling: "rules/styling.md",
  forms: "rules/forms.md",
  icons: "rules/icons.md",
  composition: "rules/composition.md",
  "base-vs-radix": "rules/base-vs-radix.md",
  cli: "cli.md",
  customization: "customization.md",
  mcp: "mcp.md",
}

export async function findSkillsDirectory(
  cwd: string
): Promise<string | null> {
  const searchRoots = [cwd, homedir()]
  for (const root of searchRoots) {
    for (const searchPath of SKILLS_SEARCH_PATHS) {
      const fullPath = path.join(root, searchPath, "shadcn")
      if (existsSync(fullPath)) return fullPath
    }
  }
  return null
}

export async function readSkillsContent(
  skillsDir: string,
  topics?: SkillsTopic[]
): Promise<string> {
  if (!topics || topics.length === 0) {
    const defaultFile = path.join(skillsDir, "SKILL.md")
    if (existsSync(defaultFile)) {
      return fs.readFile(defaultFile, "utf-8")
    }
    return ""
  }

  const sections: string[] = []
  for (const topic of topics) {
    const file = TOPIC_TO_FILE[topic]
    if (!file) continue

    const fullPath = path.join(skillsDir, file)
    if (existsSync(fullPath)) {
      const content = await fs.readFile(fullPath, "utf-8")
      sections.push(`# ${topic}\n\n${content}`)
    }
  }
  return sections.join("\n\n---\n\n")
}

export async function npxShadcn(command: string) {
  const packageRunner = await getPackageRunner(process.cwd())
  return `${packageRunner} ${SHADCN_CLI_COMMAND} ${command}`
}

export async function getMcpConfig(cwd = process.cwd()) {
  const config = await getRegistriesConfig(cwd, {
    useCache: false,
  })

  return {
    registries: config.registries,
  }
}

export function formatSearchResultsWithPagination(
  results: z.infer<typeof searchResultsSchema>,
  options?: {
    query?: string
    registries?: string[]
  }
) {
  const { query, registries } = options || {}

  const formattedItems = results.items.map((item) => {
    const parts: string[] = [`- ${item.name}`]

    if (item.type) {
      parts.push(`(${item.type})`)
    }

    if (item.description) {
      parts.push(`- ${item.description}`)
    }

    if (item.registry) {
      parts.push(`[${item.registry}]`)
    }

    parts.push(
      `\n  Add command: \`${npxShadcn(`add ${item.addCommandArgument}`)}\``
    )

    return parts.join(" ")
  })

  let header = `Found ${results.pagination.total} items`
  if (query) {
    header += ` matching "${query}"`
  }
  if (registries && registries.length > 0) {
    header += ` in registries ${registries.join(", ")}`
  }
  header += ":"

  const showingRange = `Showing items ${results.pagination.offset + 1
    }-${Math.min(
      results.pagination.offset + results.pagination.limit,
      results.pagination.total
    )} of ${results.pagination.total}:`

  let output = `${header}\n\n${showingRange}\n\n${formattedItems.join("\n\n")}`

  if (results.pagination.hasMore) {
    output += `\n\nMore items available. Use offset: ${results.pagination.offset + results.pagination.limit
      } to see the next page.`
  }

  return output
}

export function formatRegistryItems(
  items: z.infer<typeof registryItemSchema>[]
) {
  return items.map((item) => {
    const parts: string[] = [
      `## ${item.name}`,
      item.description ? `\n${item.description}\n` : "",
      item.type ? `**Type:** ${item.type}` : "",
      item.files && item.files.length > 0
        ? `**Files:** ${item.files.length} file(s)`
        : "",
      item.dependencies && item.dependencies.length > 0
        ? `**Dependencies:** ${item.dependencies.join(", ")}`
        : "",
      item.devDependencies && item.devDependencies.length > 0
        ? `**Dev Dependencies:** ${item.devDependencies.join(", ")}`
        : "",
    ]
    return parts.filter(Boolean).join("\n")
  })
}

export function formatItemExamples(
  items: z.infer<typeof registryItemSchema>[],
  query: string
) {
  const sections = items.map((item) => {
    const parts: string[] = [
      `## Example: ${item.name}`,
      item.description ? `\n${item.description}\n` : "",
    ]

    if (item.files?.length) {
      item.files.forEach((file) => {
        if (file.content) {
          parts.push(`### Code (${file.path}):\n`)
          parts.push("```tsx")
          parts.push(file.content)
          parts.push("```")
        }
      })
    }

    return parts.filter(Boolean).join("\n")
  })

  const header = `# Usage Examples\n\nFound ${items.length} example${items.length > 1 ? "s" : ""
    } matching "${query}":\n`

  return header + sections.join("\n\n---\n\n")
}

export function formatComponentDocs(
  results: Array<{
    component: string
    base: string
    links: Record<string, string>
  }>,
  notFound: string[] = []
): string {
  const lines: string[] = []

  if (notFound.length > 0) {
    lines.push(
      `Components not found in registry: ${notFound.join(", ")}\n`
    )
  }

  if (results.length === 0) {
    lines.push("No documentation links found for the requested components.")
    return lines.join("\n")
  }

  for (const { component, base, links } of results) {
    lines.push(`## ${component} (base: ${base})`)
    for (const [key, url] of Object.entries(links)) {
      lines.push(`- ${key}: ${url}`)
    }
    lines.push("")
  }

  return lines.join("\n").trimEnd()
}

export function formatProjectInfo(
  data: ReturnType<typeof collectInfo>
): string {
  const lines: string[] = []

  if (data.project) {
    lines.push("## Project")
    lines.push(
      `framework: ${data.project.framework} (${data.project.frameworkName})`
    )

    lines.push(`srcDirectory: ${data.project.srcDirectory ? "Yes" : "No"}`)
    lines.push(`rsc: ${data.project.rsc ? "Yes" : "No"}`)
    lines.push(`typescript: ${data.project.typescript ? "Yes" : "No"}`)

    if (data.project.frameworkVersion) {
      lines.push(`frameworkVersion: ${data.project.frameworkVersion}`)
    }

    if (data.project.tailwindVersion) {
      lines.push(`tailwindVersion: ${data.project.tailwindVersion}`)
    }

    if (data.project.tailwindConfig) {
      lines.push(`tailwindConfig: ${data.project.tailwindConfig}`)
    }

    if (data.project.tailwindCss) {
      lines.push(`tailwindCss: ${data.project.tailwindCss}`)
    }

    if (data.project.importAlias) {
      lines.push(`importAlias: ${data.project.importAlias}`)
    }
  } else {
    lines.push("## Project\nNo project info detected.")
  }

  if (data.config) {
    lines.push("\n## Configuration (components.json)")
    lines.push(`style: ${data.config.style}`)
    lines.push(`base: ${data.config.base}`)
    lines.push(`rsc: ${data.config.rsc ? "Yes" : "No"}`)
    lines.push(`typescript: ${data.config.typescript ? "Yes" : "No"}`)

    if (data.config.iconLibrary) {
      lines.push(`iconLibrary: ${data.config.iconLibrary}`)
    }

    lines.push(`rtl: ${data.config.rtl ? "Yes" : "No"}`)

    lines.push("\n### Aliases")
    lines.push(`components: ${data.config.aliases.components}`)
    lines.push(`utils: ${data.config.aliases.utils}`)

    if (data.config.aliases.ui) {
      lines.push(`ui: ${data.config.aliases.ui}`)
    }

    if (data.config.aliases.lib) {
      lines.push(`lib: ${data.config.aliases.lib}`)
    }

    if (data.config.aliases.hooks) {
      lines.push(`hooks: ${data.config.aliases.hooks}`)
    }

    const registries = Object.entries(data.config.registries)

    if (registries.length > 0) {
      lines.push("\n### Registries")
      for (const [name, url] of registries) {
        lines.push(`${name}: ${url}`)
      }
    }
  } else {
    lines.push("\n## Configuration\nNo components.json found.")
  }

  lines.push("\n## Installed Components")

  if (data.components.length > 0) {
    lines.push(data.components.join(", "))
  } else {
    lines.push("No components installed.")
  }

  lines.push("\n## Links")
  for (const [key, url] of Object.entries(data.links)) {
    lines.push(`${key}: ${url}`)
  }

  return lines.join("\n")
}

export function formatAddResult(
  result: DryRunResult,
  components: string[]
): string {
  const lines: string[] = []

  lines.push(`## Added: ${components.join(", ")}`)

  if (result.files.length > 0) {
    lines.push("\n### Files")
    for (const file of result.files) {
      lines.push(`- [${file.action}] ${file.path}`)
    }
  }

  if (result.dependencies.length > 0) {
    lines.push("\n### Dependencies installed")
    lines.push(result.dependencies.join(", "))
  }

  if (result.devDependencies.length > 0) {
    lines.push("\n### Dev dependencies installed")
    lines.push(result.devDependencies.join(", "))
  }

  if (result.css) {
    lines.push("\n### CSS")
    lines.push(`file: ${result.css.path} (${result.css.action})`)
    if (result.css.cssVarsCount > 0) {
      lines.push(`cssVars: ${result.css.cssVarsCount} variables`)
    }
  }

  if (result.envVars) {
    lines.push("\n### Environment Variables")
    lines.push(`file: ${result.envVars.path} (${result.envVars.action})`)
    for (const key of Object.keys(result.envVars.variables)) {
      lines.push(`- ${key}`)
    }
  }

  if (result.fonts.length > 0) {
    lines.push("\n### Fonts")
    for (const font of result.fonts) {
      lines.push(`- ${font.name} (${font.provider})`)
    }
  }

  if (result.docs) {
    lines.push("\n### Docs")
    lines.push(result.docs)
  }

  return lines.join("\n")
}

export function formatComponentDiff(
  result: DryRunResult,
  components: string[]
): string {
  const lines: string[] = []
  lines.push(`## Diff: ${components.join(", ")}`)

  const overwriteFiles = result.files.filter((f) => f.action === "overwrite")
  const createFiles = result.files.filter((f) => f.action === "create")
  const skipFiles = result.files.filter((f) => f.action === "skip")

  if (createFiles.length > 0) {
    lines.push("\n### New files (will be created)")
    for (const file of createFiles) {
      lines.push(`\n#### ${file.path}`)
      lines.push("```tsx")
      lines.push(file.content)
      lines.push("```")
    }
  }

  if (overwriteFiles.length > 0) {
    lines.push("\n### Changed files (current → incoming)")
    for (const file of overwriteFiles) {
      lines.push(`\n#### ${file.path}`)
      const patch = structuredPatch(
        file.path,
        file.path,
        file.existingContent!,
        file.content,
        "",
        "",
        { context: 3 }
      )
      for (const hunk of patch.hunks) {
        lines.push(
          `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`
        )
        for (const line of hunk.lines) {
          lines.push(line)
        }
      }
    }
  }

  if (skipFiles.length > 0) {
    lines.push("\n### Unchanged files (will be skipped)")
    for (const file of skipFiles) lines.push(`- ${file.path}`)
  }

  lines.push("\n---")
  lines.push(
    "Use `apply_component_diff` with `resolutions` to accept or skip each file."
  )
  const filesToResolve = result.files
    .filter((f) => f.action !== "skip")
    .map((f) => f.path)
    .join(", ")
  lines.push(`Files to resolve: ${filesToResolve}`)

  return lines.join("\n")
}

export function formatApplyResult(
  written: string[],
  skipped: string[],
  result: DryRunResult
): string {
  const lines: string[] = []

  lines.push("## Apply Result")

  if (written.length > 0) {
    lines.push("\n### Written files")
    for (const f of written) lines.push(`- ${f}`)
  }

  if (skipped.length > 0) {
    lines.push("\n### Skipped files")
    for (const f of skipped) lines.push(`- ${f}`)
  }

  if (result.dependencies.length > 0) {
    lines.push("\n### Dependencies installed")
    lines.push(result.dependencies.join(", "))
  }

  if (result.devDependencies.length > 0) {
    lines.push("\n### Dev dependencies installed")
    lines.push(result.devDependencies.join(", "))
  }

  if (result.css) {
    lines.push("\n### CSS")
    lines.push(`file: ${result.css.path} (${result.css.action})`)
    if (result.css.cssVarsCount > 0) {
      lines.push(`cssVars: ${result.css.cssVarsCount} variables`)
    }
  }

  if (result.envVars) {
    lines.push("\n### Environment Variables")
    lines.push(`file: ${result.envVars.path} (${result.envVars.action})`)
    for (const key of Object.keys(result.envVars.variables)) {
      lines.push(`- ${key}`)
    }
  }

  return lines.join("\n")
}

export function formatDryRunForMcp(
  result: DryRunResult,
  components: string[]
): string {
  const lines: string[] = []

  lines.push(`## Dry Run: shadcn add ${components.join(", ")}`)

  // Files
  if (result.files.length > 0) {
    lines.push("\n### Files")
    for (const file of result.files) {
      lines.push(`- [${file.action}] ${file.path}`)
    }
  } else {
    lines.push("\n### Files\nNo files to add.")
  }

  // Dependencies
  if (result.dependencies.length > 0) {
    lines.push("\n### Dependencies")
    lines.push(result.dependencies.join(", "))
  }

  if (result.devDependencies.length > 0) {
    lines.push("\n### Dev Dependencies")
    lines.push(result.devDependencies.join(", "))
  }

  // CSS
  if (result.css) {
    lines.push("\n### CSS")
    lines.push(`file: ${result.css.path} (${result.css.action})`)
    if (result.css.cssVarsCount > 0) {
      lines.push(`cssVars: ${result.css.cssVarsCount} variables`)
    }
  }

  // Env vars
  if (result.envVars) {
    lines.push("\n### Environment Variables")
    lines.push(`file: ${result.envVars.path} (${result.envVars.action})`)
    for (const key of Object.keys(result.envVars.variables)) {
      lines.push(`- ${key}`)
    }
  }

  // Fonts
  if (result.fonts.length > 0) {
    lines.push("\n### Fonts")
    for (const font of result.fonts) {
      lines.push(`- ${font.name} (${font.provider})`)
    }
  }

  // Docs
  if (result.docs) {
    lines.push("\n### Docs")
    lines.push(result.docs)
  }

  return lines.join("\n")
}
