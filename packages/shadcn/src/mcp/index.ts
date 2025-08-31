import { getRegistryItems, searchRegistries } from "@/src/registry"
import { RegistryError } from "@/src/registry/errors"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import dedent from "dedent"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

import {
  formatItemExamples,
  formatRegistryItems,
  formatSearchResultsWithPagination,
  getMcpConfig,
  npxShadcn,
} from "./utils"

export const server = new Server(
  {
    name: "shadcn",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_project_registries",
        description:
          "Get configured registry names from components.json - Returns error if no components.json exists (use init_project to create one)",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "list_items_in_registries",
        description:
          "List items from registries (requires components.json - use init_project if missing)",
        inputSchema: zodToJsonSchema(
          z.object({
            registries: z
              .array(z.string())
              .describe(
                "Array of registry names to search (e.g., ['@shadcn', '@acme'])"
              ),
            limit: z
              .number()
              .optional()
              .describe("Maximum number of items to return"),
            offset: z
              .number()
              .optional()
              .describe("Number of items to skip for pagination"),
          })
        ),
      },
      {
        name: "search_items_in_registries",
        description:
          "Search for components in registries using fuzzy matching (requires components.json). After finding an item, use get_item_examples_from_registries to see usage examples.",
        inputSchema: zodToJsonSchema(
          z.object({
            registries: z
              .array(z.string())
              .describe(
                "Array of registry names to search (e.g., ['@shadcn', '@acme'])"
              ),
            query: z
              .string()
              .describe(
                "Search query string for fuzzy matching against item names and descriptions"
              ),
            limit: z
              .number()
              .optional()
              .describe("Maximum number of items to return"),
            offset: z
              .number()
              .optional()
              .describe("Number of items to skip for pagination"),
          })
        ),
      },
      {
        name: "view_items_in_registries",
        description:
          "View detailed information about specific registry items including the name, description, type and files content. For usage examples, use get_item_examples_from_registries instead.",
        inputSchema: zodToJsonSchema(
          z.object({
            items: z
              .array(z.string())
              .describe(
                "Array of item names with registry prefix (e.g., ['@shadcn/button', '@shadcn/card'])"
              ),
          })
        ),
      },
      {
        name: "get_item_examples_from_registries",
        description:
          "Find usage examples and demos with their complete code. Search for patterns like 'accordion-demo', 'button example', 'card-demo', etc. Returns full implementation code with dependencies.",
        inputSchema: zodToJsonSchema(
          z.object({
            registries: z
              .array(z.string())
              .describe(
                "Array of registry names to search (e.g., ['@shadcn', '@acme'])"
              ),
            query: z
              .string()
              .describe(
                "Search query for examples (e.g., 'accordion-demo', 'button demo', 'card example', 'tooltip-demo', 'example-booking-form', 'example-hero'). Common patterns: '{item-name}-demo', '{item-name} example', 'example {item-name}'"
              ),
          })
        ),
      },
      {
        name: "get_add_command_for_items",
        description:
          "Get the shadcn CLI add command for specific items in a registry. This is useful for adding one or more components to your project.",
        inputSchema: zodToJsonSchema(
          z.object({
            items: z
              .array(z.string())
              .describe(
                "Array of items to get the add command for prefixed with the registry name (e.g., ['@shadcn/button', '@shadcn/card'])"
              ),
          })
        ),
      },
      {
        name: "get_audit_checklist",
        description:
          "After creating new components or generating new code files, use this tool for a quick checklist to verify that everything is working as expected. Make sure to run the tool after all required steps have been completed.",
        inputSchema: zodToJsonSchema(z.object({})),
      },
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("No tool arguments provided.")
    }

    switch (request.params.name) {
      case "get_project_registries": {
        const config = await getMcpConfig(process.cwd())

        if (!config?.registries) {
          return {
            content: [
              {
                type: "text",
                text: dedent`No components.json found or no registries configured.

                To fix this:
                1. Use the \`init\` command to create a components.json file
                2. Or manually create components.json with a registries section`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: dedent`The following registries are configured in the current project:

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
                `,
            },
          ],
        }
      }

      case "search_items_in_registries": {
        const inputSchema = z.object({
          registries: z.array(z.string()),
          query: z.string(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })

        const args = inputSchema.parse(request.params.arguments)
        const results = await searchRegistries(args.registries, {
          query: args.query,
          limit: args.limit,
          offset: args.offset,
          config: await getMcpConfig(process.cwd()),
          useCache: false,
        })

        if (results.items.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: dedent`No items found matching "${
                  args.query
                }" in registries ${args.registries.join(
                  ", "
                )}, Try searching with a different query or registry.`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: formatSearchResultsWithPagination(results, {
                query: args.query,
                registries: args.registries,
              }),
            },
          ],
        }
      }

      case "list_items_in_registries": {
        const inputSchema = z.object({
          registries: z.array(z.string()),
          limit: z.number().optional(),
          offset: z.number().optional(),
          cwd: z.string().optional(),
        })

        const args = inputSchema.parse(request.params.arguments)
        const results = await searchRegistries(args.registries, {
          limit: args.limit,
          offset: args.offset,
          config: await getMcpConfig(process.cwd()),
          useCache: false,
        })

        if (results.items.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: dedent`No items found in registries ${args.registries.join(
                  ", "
                )}.`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: formatSearchResultsWithPagination(results, {
                registries: args.registries,
              }),
            },
          ],
        }
      }

      case "view_items_in_registries": {
        const inputSchema = z.object({
          items: z.array(z.string()),
        })

        const args = inputSchema.parse(request.params.arguments)
        const registryItems = await getRegistryItems(args.items, {
          config: await getMcpConfig(process.cwd()),
          useCache: false,
        })

        if (registryItems?.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: dedent`No items found for: ${args.items.join(", ")}

                Make sure the item names are correct and include the registry prefix (e.g., @shadcn/button).`,
              },
            ],
          }
        }

        const formattedItems = formatRegistryItems(registryItems)

        return {
          content: [
            {
              type: "text",
              text: dedent`Item Details:

              ${formattedItems.join("\n\n---\n\n")}`,
            },
          ],
        }
      }

      case "get_item_examples_from_registries": {
        const inputSchema = z.object({
          query: z.string(),
          registries: z.array(z.string()),
        })

        const args = inputSchema.parse(request.params.arguments)
        const config = await getMcpConfig()

        const results = await searchRegistries(args.registries, {
          query: args.query,
          config,
          useCache: false,
        })

        if (results.items.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: dedent`No examples found for query "${args.query}".

                Try searching with patterns like:
                - "accordion-demo" for accordion examples
                - "button demo" or "button example"
                - Component name followed by "-demo" or "example"

                You can also:
                1. Use search_items_in_registries to find all items matching your query
                2. View the main component with view_items_in_registries for inline usage documentation`,
              },
            ],
          }
        }

        const itemNames = results.items.map((item) => item.addCommandArgument)
        const fullItems = await getRegistryItems(itemNames, {
          config,
          useCache: false,
        })

        return {
          content: [
            {
              type: "text",
              text: formatItemExamples(fullItems, args.query),
            },
          ],
        }
      }

      case "get_add_command_for_items": {
        const args = z
          .object({
            items: z.array(z.string()),
          })
          .parse(request.params.arguments)

        return {
          content: [
            {
              type: "text",
              text: await npxShadcn(`add ${args.items.join(" ")}`),
            },
          ],
        }
      }

      case "get_audit_checklist": {
        return {
          content: [
            {
              type: "text",
              text: dedent`## Component Audit Checklist

              After adding or generating components, check the following common issues:

              - [ ] Ensure imports are correct i.e named vs default imports
              - [ ] If using next/image, ensure images.remotePatterns next.config.js is configured correctly.
              - [ ] Ensure all dependencies are installed.
              - [ ] Check for linting errors or warnings
              - [ ] Check for TypeScript errors
              - [ ] Use the Playwright MCP if available.
              `,
            },
          ],
        }
      }

      default:
        throw new Error(`Tool ${request.params.name} not found`)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: "text",
            text: dedent`Invalid input parameters:
              ${error.errors
                .map((e) => `- ${e.path.join(".")}: ${e.message}`)
                .join("\n")}
              `,
          },
        ],
        isError: true,
      }
    }

    if (error instanceof RegistryError) {
      let errorMessage = error.message

      if (error.suggestion) {
        errorMessage += `\n\n💡 ${error.suggestion}`
      }

      if (error.context) {
        errorMessage += `\n\nContext: ${JSON.stringify(error.context, null, 2)}`
      }

      return {
        content: [
          {
            type: "text",
            text: dedent`Error (${error.code}): ${errorMessage}`,
          },
        ],
        isError: true,
      }
    }

    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      content: [
        {
          type: "text",
          text: dedent`Error: ${errorMessage}`,
        },
      ],
      isError: true,
    }
  }
})
