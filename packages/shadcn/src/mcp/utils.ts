import { getRegistriesConfig } from "@/src/registry/api"
import { registryItemSchema, searchResultsSchema } from "@/src/schema"
import { getPackageRunner } from "@/src/utils/get-package-manager"
import { z } from "zod"

const SHADCN_CLI_COMMAND = "shadcn@latest"

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

  const showingRange = `Showing items ${
    results.pagination.offset + 1
  }-${Math.min(
    results.pagination.offset + results.pagination.limit,
    results.pagination.total
  )} of ${results.pagination.total}:`

  let output = `${header}\n\n${showingRange}\n\n${formattedItems.join("\n\n")}`

  if (results.pagination.hasMore) {
    output += `\n\nMore items available. Use offset: ${
      results.pagination.offset + results.pagination.limit
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

  const header = `# Usage Examples\n\nFound ${items.length} example${
    items.length > 1 ? "s" : ""
  } matching "${query}":\n`

  return header + sections.join("\n\n---\n\n")
}
