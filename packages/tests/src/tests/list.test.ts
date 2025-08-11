import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

// Helper to run npxShadcn with our mock registry URL
async function npxShadcnWithMockRegistry(
  cwd: string,
  args: string[],
  options?: { debug?: boolean }
) {
  return npxShadcn(cwd, args, {
    ...options,
    registryUrl: `http://localhost:${registryShadcn.port}/r`,
  })
}

// Use dynamic port assignment to avoid conflicts
const registryShadcn = await createRegistryServer(
  [
    {
      name: "button",
      type: "registry:ui",
      description: "A button component",
      dependencies: ["@radix-ui/react-slot"],
      devDependencies: ["@types/react"],
      files: [
        {
          path: "components/ui/button.tsx",
          content:
            "export function Button() {\n  return <button>Click me</button>\n}",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "card",
      type: "registry:ui",
      description: "A card component",
      files: [
        {
          path: "components/ui/card.tsx",
          content:
            "export function Card() {\n  return <div>Card Component</div>\n}",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "alert-dialog",
      type: "registry:ui",
      registryDependencies: ["button"],
      files: [
        {
          path: "components/ui/alert-dialog.tsx",
          content:
            "export function AlertDialog() {\n  return <div>AlertDialog Component</div>\n}",
          type: "registry:ui",
        },
      ],
    },
  ],
  {
    port: 0, // Use dynamic port assignment
    path: "/r",
  }
)

const registryOne = await createRegistryServer(
  [
    {
      name: "foo",
      type: "registry:component",
      description: "Foo component from registry one",
      dependencies: ["clsx", "tailwind-merge"],
      files: [
        {
          path: "components/foo.tsx",
          content:
            "export function Foo() {\n  return <div>Foo Component from Registry 1</div>\n}",
          type: "registry:component",
        },
      ],
      tailwind: {
        config: {
          theme: {
            extend: {
              colors: {
                foo: "#ff0000",
              },
            },
          },
        },
      },
      cssVars: {
        light: {
          "foo-color": "#ff0000",
        },
        dark: {
          "foo-color": "#00ff00",
        },
      },
    },
    {
      name: "bar",
      type: "registry:component",
      registryDependencies: ["@one/foo"],
      files: [
        {
          path: "components/bar.tsx",
          content:
            "export function Bar() {\n  return <div>Bar Component from Registry 1</div>\n}",
          type: "registry:component",
        },
      ],
    },
  ],
  {
    port: 0, // Use dynamic port assignment
    path: "/r",
  }
)

const registryTwo = await createRegistryServer(
  [
    {
      name: "item",
      type: "registry:ui",
      description: "Item component from registry two",
      files: [
        {
          path: "components/ui/item.tsx",
          content:
            "export function Item() {\n  return <div>Item Component from Registry 2</div>\n}",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "secure-item",
      type: "registry:component",
      description: "Secure item requiring authentication",
      registryDependencies: ["@one/foo"],
      files: [
        {
          path: "components/secure-item.tsx",
          content:
            "export function SecureItem() {\n  return <div>Secure Item</div>\n}",
          type: "registry:component",
        },
      ],
    },
  ],
  {
    port: 0, // Use dynamic port assignment
    path: "/registry",
  }
)

beforeAll(async () => {
  await registryShadcn.start()
  await registryOne.start()
  await registryTwo.start()
})

afterAll(async () => {
  await registryShadcn.stop()
  await registryOne.stop()
  await registryTwo.stop()
})

describe("shadcn list", () => {
  it("should list items from shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@shadcn"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toMatchObject({
      registry: "@shadcn",
      items: expect.arrayContaining([
        {
          name: "button",
          type: "registry:ui",
          description: "A button component",
        },
        {
          name: "card",
          type: "registry:ui",
          description: "A card component",
        },
        {
          name: "alert-dialog",
          type: "registry:ui",
          description: undefined,
        },
      ]),
    })
  })

  it("should list items from multiple registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
      "@two": `http://localhost:${registryTwo.port}/registry/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, [
      "list",
      "@shadcn",
      "@one",
      "@two",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(3)
    expect(parsed[0].registry).toBe("@shadcn")
    expect(parsed[1].registry).toBe("@one")
    expect(parsed[2].registry).toBe("@two")
  })

  it("should list from configured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@one"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toMatchObject({
      registry: "@one",
      items: expect.arrayContaining([
        {
          name: "foo",
          type: "registry:component",
          description: "Foo component from registry one",
        },
        {
          name: "bar",
          type: "registry:component",
          description: undefined,
        },
      ]),
    })
  })

  it("should handle non-existent registry gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@unknown"])

    expect(output.stdout).toContain('Unknown registry "@unknown"')
  })

  it("should handle authentication for secured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: `http://localhost:${registryTwo.port}/registry/bearer/{name}`,
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toMatchObject({
      registry: "@two",
      items: expect.arrayContaining([
        expect.objectContaining({
          name: "item",
          type: "registry:ui",
          description: "Item component from registry two",
        }),
        expect.objectContaining({
          name: "secure-item",
          type: "registry:component",
          description: "Secure item requiring authentication",
        }),
      ]),
    })
  })

  it("should fail when listing secured registry without authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": `http://localhost:${registryTwo.port}/registry/bearer/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@two"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should handle authentication with environment variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: `http://localhost:${registryTwo.port}/registry/bearer/{name}`,
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    const originalBearerToken = process.env.BEARER_TOKEN
    try {
      process.env.BEARER_TOKEN = "EXAMPLE_BEARER_TOKEN"

      const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@two"])

      const parsed = JSON.parse(output.stdout)
      expect(parsed[0]).toMatchObject({
        registry: "@two",
        items: expect.arrayContaining([
          expect.objectContaining({
            name: "item",
          }),
        ]),
      })
    } finally {
      if (originalBearerToken !== undefined) {
        process.env.BEARER_TOKEN = originalBearerToken
      } else {
        delete process.env.BEARER_TOKEN
      }
    }
  })

  it("should handle missing environment variables for authenticated registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@auth": {
        url: `http://localhost:${registryTwo.port}/registry/bearer/{name}`,
        headers: {
          Authorization: "Bearer ${MISSING_ENV_VAR}",
        },
      },
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@auth"])

    expect(output.stdout).toContain("MISSING_ENV_VAR")
  })

  it("should work with @shadcn namespace", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@shadcn"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].registry).toBe("@shadcn")
    expect(parsed[0].items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "button" }),
        expect.objectContaining({ name: "card" }),
      ])
    )
  })

  it("should handle namespace with special characters", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@test-123"])

    expect(output.stdout).toContain('Unknown registry "@test-123"')
  })

  it("should handle empty registry name", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@"])

    expect(output.stdout).toContain("Failed to parse registry item: @")
    expect(output.stdout).toContain(
      "Registry name must start with @ followed by alphanumeric characters"
    )
  })

  it("should handle namespace without @ prefix", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "one"])

    // Without @ prefix, it should show an error
    expect(output.stdout).toContain("Failed to parse registry item: one")
    expect(output.stdout).toContain("Registry name must start with @")
  })

  it("should list from components.json with registries config only (shadow config)", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@one"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].registry).toBe("@one")
    expect(parsed[0].items.length).toBeGreaterThan(0)
  })

  it("should error when listing from non-existent registry with configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Configure @one registry, but try to list from @two
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@two"])

    expect(output.stdout).toContain('Unknown registry "@two"')
  })

  it("should handle validation errors", async () => {
    // Create a server that returns invalid schema
    const badServer = await createRegistryServer(
      [
        {
          name: "invalid-schema",
          type: "invalid-type", // Invalid type
          files: [
            {
              path: "components/bad.tsx",
              content: "export function Bad() { return null }",
              // Missing required 'type' field
            },
          ],
        } as any,
      ],
      {
        port: 0, // Use dynamic port assignment
        path: "/bad",
      }
    )

    await badServer.start()

    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@bad": `http://localhost:${badServer.port}/bad/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@bad"])

    // Should handle validation error
    expect(output.stdout.toLowerCase()).toContain("failed to parse")

    await badServer.stop()
  })

  it("should handle network timeouts gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@timeout": `http://localhost:9999/timeout/{name}`, // Non-existent server
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@timeout"])

    // Check for connection error in the output
    expect(output.stdout.toLowerCase()).toContain("failed, reason:")
  })

  it("should list multiple registries with mixed success and failure", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, [
      "list",
      "@one",
      "@non-existent",
    ])

    // Should fail fast on first error
    expect(output.stdout).toContain('Unknown registry "@non-existent"')
  })

  it("should handle partial components.json without other required fields", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Create a partial components.json with only registries
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
      "@two": `http://localhost:${registryTwo.port}/registry/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@one", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(2)
    expect(parsed[0].registry).toBe("@one")
    expect(parsed[1].registry).toBe("@two")
  })

  it("should handle dependencies that require authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    // Configure both registries - @two requires auth, @one doesn't
    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
      "@two": {
        url: `http://localhost:${registryTwo.port}/registry/bearer/{name}`,
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    // List from both registries
    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@one", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({
      registry: "@one",
      items: expect.arrayContaining([
        expect.objectContaining({
          name: "foo",
        }),
      ]),
    })
    expect(parsed[1]).toMatchObject({
      registry: "@two",
      items: expect.arrayContaining([
        expect.objectContaining({
          name: "item",
        }),
      ]),
    })
  })

  it("should list with only name, type, and description fields", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": `http://localhost:${registryOne.port}/r/{name}`,
    })

    const output = await npxShadcnWithMockRegistry(fixturePath, ["list", "@one"])
    const parsed = JSON.parse(output.stdout)

    // Check that we only get name, type, and description fields
    expect(parsed[0].items).toContainEqual({
      name: "foo",
      type: "registry:component",
      description: "Foo component from registry one",
    })

    // Verify that other fields are not included
    const fooItem = parsed[0].items.find((item: any) => item.name === "foo")
    expect(fooItem).toBeDefined()
    expect(fooItem.dependencies).toBeUndefined()
    expect(fooItem.files).toBeUndefined()
    expect(fooItem.tailwind).toBeUndefined()
    expect(fooItem.cssVars).toBeUndefined()
  })
})
