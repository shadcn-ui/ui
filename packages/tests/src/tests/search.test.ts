import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

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
    port: 9180,
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
    port: 9181,
    path: "/r",
  }
)

// Create a registry with many items for pagination testing
const registryLarge = await createRegistryServer(
  Array.from({ length: 20 }, (_, i) => ({
    name: `component-${i + 1}`,
    type: "registry:ui",
    description: `Component number ${i + 1}`,
    files: [
      {
        path: `components/ui/component-${i + 1}.tsx`,
        content: `export function Component${i + 1}() { return <div>Component ${
          i + 1
        }</div> }`,
        type: "registry:ui",
      },
    ],
  })),
  {
    port: 9184,
    path: "/large",
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
    port: 9182,
    path: "/registry",
  }
)

beforeAll(async () => {
  await registryShadcn.start()
  await registryOne.start()
  await registryTwo.start()
  await registryLarge.start()
})

afterAll(async () => {
  await registryShadcn.stop()
  await registryOne.stop()
  await registryTwo.stop()
  await registryLarge.stop()
})

describe("shadcn search", () => {
  it("should search items from shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })
    const output = await npxShadcn(fixturePath, ["search", "@shadcn"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        {
          name: "button",
          type: "registry:ui",
          description: "A button component",
          registry: "@shadcn",
          addCommandArgument: "@shadcn/button",
        },
        {
          name: "card",
          type: "registry:ui",
          description: "A card component",
          registry: "@shadcn",
          addCommandArgument: "@shadcn/card",
        },
        {
          name: "alert-dialog",
          type: "registry:ui",
          description: undefined,
          registry: "@shadcn",
          addCommandArgument: "@shadcn/alert-dialog",
        },
      ])
    )
  })

  it("should list items from multiple registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
      "@one": "http://localhost:9181/r/{name}",
      "@two": "http://localhost:9182/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "@one",
      "@two",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(expect.any(Array))

    // Check that items from all three registries are present
    const registries = parsed.items.map((item: any) => item.registry)
    expect(registries).toContain("@shadcn")
    expect(registries).toContain("@one")
    expect(registries).toContain("@two")
  })

  it("should list from configured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@one"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        {
          name: "foo",
          type: "registry:component",
          description: "Foo component from registry one",
          registry: "@one",
          addCommandArgument: "@one/foo",
        },
        {
          name: "bar",
          type: "registry:component",
          registry: "@one",
          addCommandArgument: "@one/bar",
        },
      ])
    )
  })

  it("should handle non-existent registry gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["search", "@unknown"])

    expect(output.stdout).toContain('Unknown registry "@unknown"')
  })

  it("should handle authentication for secured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:9182/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    const output = await npxShadcn(fixturePath, ["search", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "item",
          type: "registry:ui",
          description: "Item component from registry two",
          registry: "@two",
        }),
        expect.objectContaining({
          name: "secure-item",
          type: "registry:component",
          description: "Secure item requiring authentication",
          registry: "@two",
        }),
      ])
    )
  })

  it("should fail when listing secured registry without authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": "http://localhost:9182/registry/bearer/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@two"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should handle authentication with environment variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:9182/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    const originalBearerToken = process.env.BEARER_TOKEN
    try {
      process.env.BEARER_TOKEN = "EXAMPLE_BEARER_TOKEN"

      const output = await npxShadcn(fixturePath, ["search", "@two"])

      const parsed = JSON.parse(output.stdout)
      expect(parsed).toHaveProperty("items")
      expect(parsed.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "item",
            registry: "@two",
          }),
        ])
      )
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
        url: "http://localhost:9182/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer ${MISSING_ENV_VAR}",
        },
      },
    })

    const output = await npxShadcn(fixturePath, ["search", "@auth"])

    expect(output.stdout).toContain("MISSING_ENV_VAR")
  })

  it("should work with @shadcn namespace", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })
    const output = await npxShadcn(fixturePath, ["search", "@shadcn"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "button",
          registry: "@shadcn",
        }),
        expect.objectContaining({
          name: "card",
          registry: "@shadcn",
        }),
      ])
    )
  })

  it("should handle namespace with special characters", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["search", "@test-123"])

    expect(output.stdout).toContain('Unknown registry "@test-123"')
  })

  it("should handle empty registry name", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["search", "@"])

    expect(output.stdout).toContain("The item at @/registry was not found.")
  })

  it("should handle namespace without @ prefix", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["search", "one"])

    // Without @ prefix, it should show an error
    expect(output.stdout).toContain('Invalid registry namespace: "one".')
  })

  it("should list from components.json with registries config only (shadow config)", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@one"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items.length).toBeGreaterThan(0)

    // Verify items are from @one registry
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          registry: "@one",
        }),
      ])
    )
  })

  it("should error when listing from non-existent registry with configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Configure @one registry, but try to list from @two
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@two"])

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
        port: 9183,
        path: "/bad",
      }
    )

    await badServer.start()

    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@bad": "http://localhost:9183/bad/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@bad"])

    // Should handle validation error
    expect(output.stdout.toLowerCase()).toContain("failed to parse")

    await badServer.stop()
  })

  it("should handle network timeouts gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@timeout": "http://localhost:9999/timeout/{name}", // Non-existent server
    })

    const output = await npxShadcn(fixturePath, ["search", "@timeout"])

    // Check for connection error in the output
    expect(output.stdout.toLowerCase()).toContain("failed, reason:")
  })

  it("should list multiple registries with mixed success and failure", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "search",
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
      "@one": "http://localhost:9181/r/{name}",
      "@two": "http://localhost:9182/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@one", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(expect.any(Array))

    // Check that items from both registries are present
    const registries = parsed.items.map((item: any) => item.registry)
    expect(registries).toContain("@one")
    expect(registries).toContain("@two")
  })

  it("should handle dependencies that require authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    // Configure both registries - @two requires auth, @one doesn't
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
      "@two": {
        url: "http://localhost:9182/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    // List from both registries
    const output = await npxShadcn(fixturePath, ["search", "@one", "@two"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveProperty("items")
    expect(parsed.items).toEqual(expect.any(Array))

    // Check that items from both registries are present
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "foo",
          registry: "@one",
        }),
        expect.objectContaining({
          name: "item",
          registry: "@two",
        }),
      ])
    )
  })

  it("should handle search with pagination", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Search for "button" with pagination
    const output = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "button",
      "--limit",
      "1",
      "--offset",
      "0",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed.items).toHaveLength(1)
    expect(parsed.items[0].name).toBe("button")
    expect(parsed.pagination).toEqual({
      total: 1,
      offset: 0,
      limit: 1,
      hasMore: false,
    })
  })

  it("should handle empty search results with pagination", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "nonexistent",
      "--limit",
      "10",
      "--offset",
      "5",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed.items).toHaveLength(0)
    expect(parsed.pagination).toEqual({
      total: 0,
      offset: 5,
      limit: 10,
      hasMore: false,
    })
  })

  it("should handle typos in search (fuzzy matching)", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Test various typos that should still match "button"
    const typos = [
      "buton", // missing 't'
      "buttn", // missing 'o'
      "buttno", // 'no' instead of 'on'
      "btton", // missing 'u'
      "dialg", // typo in 'dialog'
      "alrt", // typo in 'alert'
    ]

    // Test button typos
    for (const typo of typos.slice(0, 4)) {
      const output = await npxShadcn(fixturePath, [
        "search",
        "@shadcn",
        "--query",
        typo,
      ])
      const parsed = JSON.parse(output.stdout)
      expect(
        parsed.items.some((item: any) => item.name === "button"),
        `Typo '${typo}' should match 'button'`
      ).toBe(true)
    }

    // Test dialog typo
    const dialogOutput = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "dialg",
    ])
    const dialogParsed = JSON.parse(dialogOutput.stdout)
    expect(
      dialogParsed.items.some((item: any) => item.name === "alert-dialog"),
      "Typo 'dialg' should match 'alert-dialog'"
    ).toBe(true)

    // Test alert typo
    const alertOutput = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "alrt",
    ])
    const alertParsed = JSON.parse(alertOutput.stdout)
    expect(
      alertParsed.items.some((item: any) => item.name === "alert-dialog"),
      "Typo 'alrt' should match 'alert-dialog'"
    ).toBe(true)
  })

  it("should handle partial word matching", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Test partial matches
    const partialQueries = [
      { query: "btn", expected: "button" },
      { query: "crd", expected: "card" },
      { query: "alert", expected: "alert-dialog" },
      { query: "dial", expected: "alert-dialog" },
    ]

    for (const { query, expected } of partialQueries) {
      const output = await npxShadcn(fixturePath, [
        "search",
        "@shadcn",
        "--query",
        query,
      ])
      const parsed = JSON.parse(output.stdout)
      expect(
        parsed.items.some((item: any) => item.name === expected),
        `Partial '${query}' should match '${expected}'`
      ).toBe(true)
    }
  })

  it("should handle case-insensitive search", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Search with different cases
    const output1 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "BUTTON",
    ])
    const output2 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "button",
    ])
    const output3 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "BuTtOn",
    ])

    const parsed1 = JSON.parse(output1.stdout)
    const parsed2 = JSON.parse(output2.stdout)
    const parsed3 = JSON.parse(output3.stdout)

    // All should find the button component
    expect(parsed1.items).toHaveLength(1)
    expect(parsed2.items).toHaveLength(1)
    expect(parsed3.items).toHaveLength(1)
    expect(parsed1.items[0].name).toBe("button")
  })

  it("should handle special characters in search", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Test searching for components with hyphens
    const output1 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "alert-dialog",
    ])
    const parsed1 = JSON.parse(output1.stdout)
    expect(
      parsed1.items.some((item: any) => item.name === "alert-dialog")
    ).toBe(true)

    // Test searching with just the hyphen part
    const output2 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "-dialog",
    ])
    const parsed2 = JSON.parse(output2.stdout)
    expect(
      parsed2.items.some((item: any) => item.name === "alert-dialog")
    ).toBe(true)

    // Test with spaces (should still work)
    const output3 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "alert dialog",
    ])
    const parsed3 = JSON.parse(output3.stdout)
    expect(
      parsed3.items.some((item: any) => item.name === "alert-dialog")
    ).toBe(true)
  })

  it("should rank exact matches higher than fuzzy matches", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    // Search for "bar" which should match "bar" exactly
    const output = await npxShadcn(fixturePath, [
      "search",
      "@one",
      "--query",
      "bar",
    ])
    const parsed = JSON.parse(output.stdout)

    // If we have results, "bar" should be first (exact match)
    if (parsed.items.length > 0) {
      expect(parsed.items[0].name).toBe("bar")
    }
  })

  it("should work with 'search' command alias", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Use 'search' instead of 'list'
    const output = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--query",
      "button",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "button",
          registry: "@shadcn",
        }),
      ])
    )
  })

  it("should handle limit edge cases", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
    })

    // Test with limit 0 - should return all items
    const output1 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--limit",
      "0",
    ])
    const parsed1 = JSON.parse(output1.stdout)
    expect(parsed1.items.length).toBeGreaterThan(0)

    // Test with very large limit
    const output2 = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "--limit",
      "9999",
    ])
    const parsed2 = JSON.parse(output2.stdout)
    expect(parsed2.items.length).toBeLessThanOrEqual(9999)
    expect(parsed2.pagination.hasMore).toBe(false)
  })

  it("should handle pagination across registries with search", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9180/r/{name}",
      "@one": "http://localhost:9181/r/{name}",
    })

    // Search across multiple registries with pagination
    const output = await npxShadcn(fixturePath, [
      "search",
      "@shadcn",
      "@one",
      "--query",
      "o", // Should match "button", "foo", etc.
      "--limit",
      "2",
      "--offset",
      "1",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed.items).toHaveLength(2)
    expect(parsed.pagination.limit).toBe(2)
    expect(parsed.pagination.offset).toBe(1)
  })

  it("should handle large dataset pagination properly", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@large": "http://localhost:9184/large/{name}",
    })

    // First page
    const output1 = await npxShadcn(fixturePath, [
      "search",
      "@large",
      "--limit",
      "5",
      "--offset",
      "0",
    ])
    const parsed1 = JSON.parse(output1.stdout)
    expect(parsed1.items).toHaveLength(5)
    expect(parsed1.items[0].name).toBe("component-1")
    expect(parsed1.items[4].name).toBe("component-5")
    expect(parsed1.pagination).toEqual({
      total: 20,
      offset: 0,
      limit: 5,
      hasMore: true,
    })

    // Middle page
    const output2 = await npxShadcn(fixturePath, [
      "search",
      "@large",
      "--limit",
      "5",
      "--offset",
      "10",
    ])
    const parsed2 = JSON.parse(output2.stdout)
    expect(parsed2.items).toHaveLength(5)
    expect(parsed2.items[0].name).toBe("component-11")
    expect(parsed2.items[4].name).toBe("component-15")
    expect(parsed2.pagination.hasMore).toBe(true)

    // Last page (partial)
    const output3 = await npxShadcn(fixturePath, [
      "search",
      "@large",
      "--limit",
      "5",
      "--offset",
      "18",
    ])
    const parsed3 = JSON.parse(output3.stdout)
    expect(parsed3.items).toHaveLength(2) // Only 2 items left
    expect(parsed3.items[0].name).toBe("component-19")
    expect(parsed3.items[1].name).toBe("component-20")
    expect(parsed3.pagination.hasMore).toBe(false)
  })

  it("should list with only name, type, description, registry, and addCommandArgument fields", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@one"])
    const parsed = JSON.parse(output.stdout)

    // Check that we only get name, type, description, registry, and addCommand fields
    expect(parsed.items).toContainEqual({
      name: "foo",
      type: "registry:component",
      description: "Foo component from registry one",
      registry: "@one",
      addCommandArgument: "@one/foo",
    })

    // Verify that other fields are not included
    const fooItem = parsed.items.find((item: any) => item.name === "foo")
    expect(fooItem).toBeDefined()
    expect(fooItem.dependencies).toBeUndefined()
    expect(fooItem.files).toBeUndefined()
    expect(fooItem.tailwind).toBeUndefined()
    expect(fooItem.cssVars).toBeUndefined()
  })

  it("should handle different registry URL patterns for addCommand", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9181/r/{name}",
      "@two": "http://localhost:9182/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, ["search", "@one", "@two"])
    const parsed = JSON.parse(output.stdout)

    // Check @one registry items have correct addCommand
    const fooItem = parsed.items.find(
      (item: any) => item.name === "foo" && item.registry === "@one"
    )
    expect(fooItem.addCommandArgument).toBe("@one/foo")

    // Check @two registry items have correct addCommand
    const itemItem = parsed.items.find(
      (item: any) => item.name === "item" && item.registry === "@two"
    )
    expect(itemItem.addCommandArgument).toBe("@two/item")
  })
})
