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
          "Search for components in registries using fuzzy matching (requires components.json)",
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
          "View detailed information about specific registry items including the name, description, type and files content.",
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
                \`${npxShadcn("view @name-of-registry")}\`

                For example: \`${npxShadcn("view @shadcn")}\` or \`${npxShadcn(
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
