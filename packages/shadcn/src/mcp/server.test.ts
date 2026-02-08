import { describe, expect, it, vi } from "vitest"

vi.mock("@/src/utils/get-package-manager", () => {
  return {
    getPackageRunner: vi.fn(async () => "pnpm dlx"),
  }
})

vi.mock("@/src/registry", () => {
  return {
    getRegistryItems: vi.fn(async () => []),
    searchRegistries: vi.fn(async () => {
      return {
        pagination: { total: 1, offset: 0, limit: 20, hasMore: false },
        items: [
          {
            name: "sidebar",
            type: "registry:ui",
            description: "A sidebar component.",
            registry: "@shadcn",
            addCommandArgument: "@shadcn/sidebar",
          },
        ],
      }
    }),
  }
})

describe("MCP server", () => {
  it("returns concrete add commands for search_items_in_registries", async () => {
    const [{ InMemoryTransport }, { Client }, { server }] = await Promise.all([
      import("@modelcontextprotocol/sdk/inMemory.js"),
      import("@modelcontextprotocol/sdk/client/index.js"),
      import("@/src/mcp"),
    ])

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair()

    await server.connect(serverTransport)

    const client = new Client({ name: "test", version: "0.0.0" })
    await client.connect(clientTransport)

    const result = await client.callTool({
      name: "search_items_in_registries",
      arguments: {
        registries: ["@shadcn"],
        query: "sidebar",
        limit: 20,
        offset: 0,
      },
    })

    const text = result.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("\n")

    expect(text).not.toContain("[object Promise]")
    expect(text).toContain(
      "Add command: `pnpm dlx shadcn@latest add @shadcn/sidebar`"
    )

    await client.close()
    await server.close()
  })
})
