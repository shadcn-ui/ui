import { Client, type ClientOptions } from "@modelcontextprotocol/client"
import {
  getDefaultEnvironment,
  StdioClientTransport,
} from "@modelcontextprotocol/client/stdio"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  getRegistryUrl,
  SHADCN_CLI_PATH,
} from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

type NegotiationMode = NonNullable<ClientOptions["versionNegotiation"]>["mode"]

const registry = await createRegistryServer(
  [
    {
      name: "button",
      type: "registry:ui",
      description: "A button component",
      files: [
        {
          path: "components/ui/button.tsx",
          content:
            "export function Button() {\n  return <button>Click me</button>\n}",
          type: "registry:ui",
        },
      ],
    },
  ],
  {
    port: 9185,
    path: "/r",
  }
)

beforeAll(async () => {
  await registry.start()
})

afterAll(async () => {
  await registry.stop()
})

describe("shadcn mcp", () => {
  it.each<[string, NegotiationMode]>([
    ["2025-11-25", "legacy"],
    ["2026-07-28", { pin: "2026-07-28" }],
  ])("serves protocol %s", async (protocolVersion, mode) => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@acme": "http://localhost:9185/r/{name}",
    })

    const client = new Client(
      { name: "shadcn-tests", version: "1.0.0" },
      { versionNegotiation: { mode } }
    )
    await client.connect(
      new StdioClientTransport({
        command: "node",
        args: [SHADCN_CLI_PATH, "mcp"],
        cwd: fixturePath,
        env: { ...getDefaultEnvironment(), REGISTRY_URL: getRegistryUrl() },
      })
    )

    try {
      expect(client.getNegotiatedProtocolVersion()).toBe(protocolVersion)

      const result = await client.callTool({
        name: "view_items_in_registries",
        arguments: { items: ["@acme/button"] },
      })
      expect(result.isError).toBeFalsy()
      expect(result.content).toEqual([
        {
          type: "text",
          text: expect.stringContaining("A button component"),
        },
      ])
    } finally {
      await client.close()
    }
  })
})
