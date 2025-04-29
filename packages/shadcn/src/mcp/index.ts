import { registrySchema } from "@/src/registry"
import { fetchRegistry, getRegistryItem } from "@/src/registry/api"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const server = new Server(
  {
    name: "shadcn",
    version: "0.0.1",
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
        name: "init",
        description:
          "Initialize a new project using a registry style project structure.",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "get_items",
        description: "List all the available items in the registry",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "get_item",
        description: "Get an item from the registry",
        inputSchema: zodToJsonSchema(
          z.object({
            name: z
              .string()
              .describe(
                "The name of the item to get from the registry. This is required."
              ),
          })
        ),
      },
      {
        name: "add_item",
        description: "Add an item from the registry",
        inputSchema: zodToJsonSchema(
          z.object({
            name: z
              .string()
              .describe(
                "The name of the item to add to the registry. This is required."
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
      throw new Error("Arguments are required")
    }

    const REGISTRY_URL = process.env.REGISTRY_URL

    if (!REGISTRY_URL) {
      throw new Error("REGISTRY_URL is not set")
    }

    switch (request.params.name) {
      case "init": {
        const registry = await getRegistry(REGISTRY_URL)
        const style = registry.items.find(
          (item) => item.type === "registry:style"
        )

        let text = `To initialize a new project, run the following command:
                \`\`\`bash
                npx shadcn@canary init
                \`\`\`
                - This will install all the dependencies and theme for the project.
                - If running the init command installs a rules i.e registry.mdc file, you should follow the instructions in the file to configure the project.
                `

        const rules = registry.items.find(
          (item) => item.type === "registry:file" && item.name === "rules"
        )

        if (rules) {
          text += `
                You should also install the rules for the project.
                \`\`\`bash
                npx shadcn@canary add ${getRegistryItemUrl(
                  rules.name,
                  REGISTRY_URL
                )}
                \`\`\`
                `
        }

        if (!style) {
          return {
            content: [
              {
                type: "text",
                text,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `To initialize a new project using the ${
                style.name
              } style, run the following command:
              \`\`\`bash
              npx shadcn@canary init ${getRegistryItemUrl(
                style.name,
                REGISTRY_URL
              )}
              \`\`\`
              `,
            },
          ],
        }
      }
      case "get_items": {
        const registry = await getRegistry(REGISTRY_URL)

        if (!registry.items) {
          return {
            content: [
              {
                type: "text",
                text: "No items found in the registry",
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `The following items are available in the registry:
              ${JSON.stringify(
                registry.items.map(
                  (item) => `- ${item.name} (${item.type}): ${item.description}`
                ),
                null,
                2
              )}.
              - To install and use an item in your project, you run the following command:
              \`\`\`bash
              npx shadcn@canary add ${getRegistryItemUrl(
                "NAME_OF_THE_ITEM",
                REGISTRY_URL
              )}
              \`\`\`
                - Example: npx shadcn@canary add ${getRegistryItemUrl(
                  registry.items[0].name,
                  REGISTRY_URL
                )} to install the ${registry.items[0].name} item.
                - To install multiple registry.items, you can do the following:
                \`\`\`bash
                npx shadcn@canary add ${getRegistryItemUrl(
                  "NAME_OF_THE_ITEM_1",
                  REGISTRY_URL
                )} ${getRegistryItemUrl("NAME_OF_THE_ITEM_2", REGISTRY_URL)}
                \`\`\`
                - Before using any item, you need to add it first.
                - Adding the items will install all dependencies for the item and format the code as per the project.
              - Example components should not be installed directly unless asked. These components should be used as a reference to build other components.
              `,
            },
          ],
        }
      }

      case "get_item": {
        const name = z.string().parse(request.params.arguments.name)

        if (!name) {
          throw new Error("Name is required")
        }

        const itemUrl = getRegistryItemUrl(name, REGISTRY_URL)
        const item = await getRegistryItem(itemUrl, "")

        return {
          content: [{ type: "text", text: JSON.stringify(item, null, 2) }],
        }
      }

      case "add_item": {
        const name = z.string().parse(request.params.arguments.name)

        if (!name) {
          throw new Error("Name is required")
        }

        const itemUrl = getRegistryItemUrl(name, REGISTRY_URL)
        const item = await getRegistryItem(itemUrl, "")

        if (!item) {
          return {
            content: [
              {
                type: "text",
                text: `Item ${name} not found in the registry.`,
              },
            ],
          }
        }
        return {
          content: [
            {
              type: "text",
              text: `To install the ${name} item, run the following command:
              \`\`\`bash
              npx shadcn@canary add ${itemUrl}
              \`\`\``,
            },
          ],
        }
      }
      default:
        throw new Error(`Tool ${request.params.name} not found`)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`)
    }

    throw error
  }
})

async function getRegistry(registryUrl: string) {
  const [registryJson] = await fetchRegistry([registryUrl], {
    useCache: false,
  })
  return registrySchema.parse(registryJson)
}

function getRegistryItemUrl(itemName: string, registryUrl: string) {
  const registryBaseUrl = registryUrl.replace(/\/registry\.json$/, "")
  return `${registryBaseUrl}/${itemName}.json`
}
