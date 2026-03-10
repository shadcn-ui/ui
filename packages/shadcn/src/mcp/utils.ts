import { existsSync } from "fs"
import fs from "fs/promises"
import { homedir } from "os"
import path from "path"
import { collectInfo } from "@/src/commands/info"
import { getRegistriesConfig } from "@/src/registry/api"
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
