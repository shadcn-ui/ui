import { McpServer, type CallToolResult } from "@modelcontextprotocol/server"
import { getRegistryItems, searchRegistries } from "@shadcn/registry"
import { withRegistryContext } from "@shadcn/registry/internal/registry/context"
import { RegistryError } from "@shadcn/registry/internal/registry/errors"
import {
  resolveSearchRegistries,
  SEARCHABLE_TYPES,
} from "@shadcn/registry/internal/registry/search"
import dedent from "dedent"
// The MCP SDK needs zod >= 4.2 to convert tool schemas to JSON Schema. The
// rest of the CLI is on zod 3, so tool input schemas use this alias.
import { z } from "zod-v4"

import {
  findUnknownTypesMessage,
  formatItemExamples,
  formatRegistryItems,
  formatSearchResultsWithPagination,
  formatSkippedRegistries,
  getMcpConfig,
  npxShadcn,
} from "./utils"

export const server = new McpServer(
  {
    name: "shadcn",
    version: "1.0.0",
  },
  {
    capabilities: {
      logging: {},
      // The tool set is fixed, so this server never sends
      // notifications/tools/list_changed. Declare that before registerTool
      // can default the capability to true.
      tools: { listChanged: false },
    },
  }
)

// GitHub authentication notices must reach the MCP client before the first
// authenticated request. Stdout carries the protocol, so the console is not a
// usable surface here.
async function onGitHubAuthNotice(message: string) {
  try {
    await server.sendLoggingMessage({
      level: "info",
      data: message,
    })
  } catch {
    console.error(message)
  }
}

/**
 * Run a tool callback inside the registry context, so GitHub auth notices
 * reach the client, and turn any thrown error into an `isError` tool result.
 */
function registryTool<Args extends unknown[]>(
  callback: (...args: Args) => Promise<CallToolResult>
): (...args: Args) => Promise<CallToolResult> {
  return (...args) =>
    withRegistryContext(
      async () => {
        try {
          return await callback(...args)
        } catch (error) {
          return formatToolError(error)
        }
      },
      { onGitHubAuthNotice }
    )
}

function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] }
}

function errorResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true }
}

function formatToolError(error: unknown): CallToolResult {
  if (error instanceof RegistryError) {
    let errorMessage = error.message

    if (error.suggestion) {
      errorMessage += `\n\n💡 ${error.suggestion}`
    }

    if (error.context) {
      errorMessage += `\n\nContext: ${JSON.stringify(error.context, null, 2)}`
    }

    return errorResult(dedent`Error (${error.code}): ${errorMessage}`)
  }

  const errorMessage = error instanceof Error ? error.message : String(error)
  return errorResult(dedent`Error: ${errorMessage}`)
}

const NO_REGISTRIES_MESSAGE = dedent`No registries are configured. Add registries to components.json (use get_project_registries to inspect) or pass them explicitly.`

const listRegistriesField = z
  .array(z.string())
  .optional()
  .describe(
    "Array of registry names to list (e.g., ['@shadcn', '@acme']). Omit to list from every registry configured in components.json."
  )

const searchRegistriesField = z
  .array(z.string())
  .optional()
  .describe(
    "Array of registry names to search (e.g., ['@shadcn', '@acme']). Omit to search every registry configured in components.json."
  )

const typesField = z
  .array(z.string())
  .optional()
  .describe(`Filter by item type. One of: ${SEARCHABLE_TYPES.join(", ")}.`)

const limitField = z
  .number()
  .optional()
  .describe(
    "Maximum number of items to return (defaults to 100; use 0 for no limit)"
  )

const offsetField = z
  .number()
  .optional()
  .describe("Number of items to skip for pagination")

server.registerTool(
  "get_project_registries",
  {
    description:
      "Get configured registry names from components.json - Returns error if no components.json exists (use init_project to create one)",
    inputSchema: z.object({}),
  },
  registryTool(async () => {
    const config = await getMcpConfig(process.cwd())

    if (!config?.registries) {
      return textResult(dedent`No components.json found or no registries configured.

        To fix this:
        1. Use the \`init\` command to create a components.json file
        2. Or manually create components.json with a registries section`)
    }

    return textResult(dedent`The following registries are configured in the current project:

      ${Object.keys(config.registries)
        .map((registry) => `- ${registry}`)
        .join("\n")}

      You can view the items in a registry by running:
      \`${await npxShadcn("view @name-of-registry")}\`

      For example: \`${await npxShadcn(
        "view @shadcn"
      )}\` or \`${await npxShadcn(
        "view @shadcn @acme"
      )}\` to view multiple registries.
      `)
  })
)

server.registerTool(
  "list_items_in_registries",
  {
    description:
      "List items from registries (requires components.json - use init_project if missing)",
    inputSchema: z.object({
      registries: listRegistriesField,
      types: typesField,
      limit: limitField,
      offset: offsetField,
    }),
  },
  registryTool(async (args) => {
    const unknownTypesMessage = findUnknownTypesMessage(args.types)
    if (unknownTypesMessage) {
      return errorResult(unknownTypesMessage)
    }

    const config = await getMcpConfig(process.cwd())

    const listAll = !args.registries?.length
    const registries = resolveSearchRegistries(args.registries ?? [], config)

    if (registries.length === 0) {
      return textResult(NO_REGISTRIES_MESSAGE)
    }

    const results = await searchRegistries(registries, {
      types: args.types,
      limit: args.limit ?? 100,
      offset: args.offset,
      config,
      useCache: false,
      continueOnError: listAll,
    })

    const skippedNote = formatSkippedRegistries(results)

    if (results.items.length === 0) {
      return textResult(
        dedent`No items found in registries ${registries.join(
          ", "
        )}.${skippedNote}`
      )
    }

    return textResult(
      formatSearchResultsWithPagination(results, { registries }) + skippedNote
    )
  })
)

server.registerTool(
  "search_items_in_registries",
  {
    description:
      "Search for components in registries using fuzzy matching (requires components.json). After finding an item, use get_item_examples_from_registries to see usage examples.",
    inputSchema: z.object({
      registries: searchRegistriesField,
      query: z
        .string()
        .describe(
          "Search query string for fuzzy matching against item names and descriptions"
        ),
      types: typesField,
      limit: limitField,
      offset: offsetField,
    }),
  },
  registryTool(async (args) => {
    const unknownTypesMessage = findUnknownTypesMessage(args.types)
    if (unknownTypesMessage) {
      return errorResult(unknownTypesMessage)
    }

    const config = await getMcpConfig(process.cwd())

    // When registries are omitted, search every configured registry and
    // tolerate individual failures.
    const searchAll = !args.registries?.length
    const registries = resolveSearchRegistries(args.registries ?? [], config)

    if (registries.length === 0) {
      return textResult(NO_REGISTRIES_MESSAGE)
    }

    const results = await searchRegistries(registries, {
      query: args.query,
      types: args.types,
      limit: args.limit ?? 100,
      offset: args.offset,
      config,
      useCache: false,
      continueOnError: searchAll,
    })

    const skippedNote = formatSkippedRegistries(results)

    if (results.items.length === 0) {
      return textResult(
        dedent`No items found matching "${
          args.query
        }" in registries ${registries.join(
          ", "
        )}, Try searching with a different query or registry.${skippedNote}`
      )
    }

    return textResult(
      formatSearchResultsWithPagination(results, {
        query: args.query,
        registries,
      }) + skippedNote
    )
  })
)

server.registerTool(
  "view_items_in_registries",
  {
    description:
      "View detailed information about specific registry items including the name, description, type and files content. For usage examples, use get_item_examples_from_registries instead.",
    inputSchema: z.object({
      items: z
        .array(z.string())
        .describe(
          "Array of item names with registry prefix (e.g., ['@shadcn/button', '@shadcn/card'])"
        ),
    }),
  },
  registryTool(async (args) => {
    const registryItems = await getRegistryItems(args.items, {
      config: await getMcpConfig(process.cwd()),
      useCache: false,
    })

    if (registryItems?.length === 0) {
      return textResult(dedent`No items found for: ${args.items.join(", ")}

        Make sure the item names are correct and include the registry prefix (e.g., @shadcn/button).`)
    }

    const formattedItems = formatRegistryItems(registryItems)

    return textResult(dedent`Item Details:

      ${formattedItems.join("\n\n---\n\n")}`)
  })
)

server.registerTool(
  "get_item_examples_from_registries",
  {
    description:
      "Find usage examples and demos with their complete code. Search for patterns like 'accordion-demo', 'button example', 'card-demo', etc. Returns full implementation code with dependencies.",
    inputSchema: z.object({
      registries: searchRegistriesField,
      query: z
        .string()
        .describe(
          "Search query for examples (e.g., 'accordion-demo', 'button demo', 'card example', 'tooltip-demo', 'example-booking-form', 'example-hero'). Common patterns: '{item-name}-demo', '{item-name} example', 'example {item-name}'"
        ),
    }),
  },
  registryTool(async (args) => {
    const config = await getMcpConfig()

    const searchAll = !args.registries?.length
    const registries = resolveSearchRegistries(args.registries ?? [], config)

    if (registries.length === 0) {
      return textResult(NO_REGISTRIES_MESSAGE)
    }

    const results = await searchRegistries(registries, {
      query: args.query,
      config,
      useCache: false,
      continueOnError: searchAll,
    })

    if (results.items.length === 0) {
      return textResult(dedent`No examples found for query "${args.query}".

        Try searching with patterns like:
        - "accordion-demo" for accordion examples
        - "button demo" or "button example"
        - Component name followed by "-demo" or "example"

        You can also:
        1. Use search_items_in_registries to find all items matching your query
        2. View the main component with view_items_in_registries for inline usage documentation`)
    }

    const itemNames = results.items.map((item) => item.addCommandArgument)
    const fullItems = await getRegistryItems(itemNames, {
      config,
      useCache: false,
    })

    return textResult(formatItemExamples(fullItems, args.query))
  })
)

server.registerTool(
  "get_add_command_for_items",
  {
    description:
      "Get the shadcn CLI add command for specific items in a registry. This is useful for adding one or more components to your project.",
    inputSchema: z.object({
      items: z
        .array(z.string())
        .describe(
          "Array of items to get the add command for prefixed with the registry name (e.g., ['@shadcn/button', '@shadcn/card'])"
        ),
    }),
  },
  registryTool(async (args) =>
    textResult(await npxShadcn(`add ${args.items.join(" ")}`))
  )
)

server.registerTool(
  "get_audit_checklist",
  {
    description:
      "After creating new components or generating new code files, use this tool for a quick checklist to verify that everything is working as expected. Make sure to run the tool after all required steps have been completed.",
    inputSchema: z.object({}),
  },
  registryTool(async () =>
    textResult(dedent`## Component Audit Checklist

      After adding or generating components, check the following common issues:

      - [ ] Ensure imports are correct i.e named vs default imports
      - [ ] If using next/image, ensure images.remotePatterns next.config.js is configured correctly.
      - [ ] Ensure all dependencies are installed.
      - [ ] Check for linting errors or warnings
      - [ ] Check for TypeScript errors
      - [ ] Use the Playwright MCP if available.
      `)
  )
)
