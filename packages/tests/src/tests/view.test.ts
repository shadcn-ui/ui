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
    port: 9080,
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
    {
      name: "complex",
      type: "registry:component",
      registryDependencies: ["@two/item", "@one/foo"],
      files: [
        {
          path: "components/complex.tsx",
          content:
            "export function Complex() {\n  return <div>Complex Component</div>\n}",
          type: "registry:component",
        },
      ],
    },
  ],
  {
    port: 9081,
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
    port: 9082,
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

describe("shadcn view", () => {
  it("should view a single component from shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@shadcn": "http://localhost:9080/r/{name}",
    })
    const output = await npxShadcn(fixturePath, ["view", "button"])

    const parsed = JSON.parse(output.stdout)

    expect(parsed[0]).toMatchObject({
      name: "button",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot"],
      files: expect.arrayContaining([
        expect.objectContaining({
          path: "registry/new-york-v4/ui/button.tsx",
          type: "registry:ui",
        }),
      ]),
    })
  })

  it("should view multiple components from shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "button", "card"])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(2)
    expect(parsed.map((p: any) => p.name)).toEqual(["button", "card"])
  })

  it("should view component with registry dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "alert-dialog"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "alert-dialog",
        type: "registry:ui",
        dependencies: ["@radix-ui/react-alert-dialog"],
        registryDependencies: ["button"],
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "registry/new-york-v4/ui/alert-dialog.tsx",
            type: "registry:ui",
          }),
        ]),
      },
    ])
  })

  it("should view component from URL without needing config", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9081/r/foo.json",
    ])

    expect(JSON.parse(output.stdout)).toMatchInlineSnapshot(`
      [
        {
          "cssVars": {
            "dark": {
              "foo-color": "#00ff00",
            },
            "light": {
              "foo-color": "#ff0000",
            },
          },
          "dependencies": [
            "clsx",
            "tailwind-merge",
          ],
          "description": "Foo component from registry one",
          "files": [
            {
              "content": "export function Foo() {
        return <div>Foo Component from Registry 1</div>
      }",
              "path": "components/foo.tsx",
              "type": "registry:component",
            },
          ],
          "name": "foo",
          "tailwind": {
            "config": {
              "theme": {
                "extend": {
                  "colors": {
                    "foo": "#ff0000",
                  },
                },
              },
            },
          },
          "type": "registry:component",
        },
      ]
    `)
  })

  it("should view multiple URLs without needing config", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9081/r/foo.json",
      "http://localhost:9082/registry/item.json",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(2)
    expect(parsed.map((p: any) => p.name)).toEqual(["foo", "item"])
  })

  it("should view component from configured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@one/foo"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "foo",
        type: "registry:component",
        description: "Foo component from registry one",
        dependencies: ["clsx", "tailwind-merge"],
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
      },
    ])
  })

  it("should view multiple components from different registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
      "@two": "http://localhost:9082/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "view",
      "@one/foo",
      "@two/item",
      "button",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(3)
    expect(parsed.map((p: any) => p.name)).toEqual(["foo", "item", "button"])
  })

  it("should view component with nested registry dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@one/bar"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "bar",
        type: "registry:component",
        registryDependencies: ["@one/foo"],
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "components/bar.tsx",
            type: "registry:component",
          }),
        ]),
      },
    ])
  })

  it("should view component with cross-registry dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
      "@two": "http://localhost:9082/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@one/complex"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "complex",
        type: "registry:component",
        registryDependencies: expect.arrayContaining(["@two/item", "@one/foo"]),
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "components/complex.tsx",
            type: "registry:component",
          }),
        ]),
      },
    ])
  })

  it("should handle authentication for secured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:9082/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    const output = await npxShadcn(fixturePath, ["view", "@two/secure-item"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "secure-item",
        type: "registry:component",
        description: "Secure item requiring authentication",
        registryDependencies: ["@one/foo"],
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "components/secure-item.tsx",
          }),
        ]),
      },
    ])
  })

  it("should fail when viewing secured item without authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": "http://localhost:9082/registry/bearer/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@two/secure-item"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should handle authentication with environment variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
      "@two": {
        url: "http://localhost:9082/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    process.env.BEARER_TOKEN = "EXAMPLE_BEARER_TOKEN"

    const output = await npxShadcn(fixturePath, [
      "view",
      "@two/secure-item",
      "@one/foo",
    ])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "secure-item",
        type: "registry:component",
        registryDependencies: ["@one/foo"],
      },
      {
        name: "foo",
        type: "registry:component",
        dependencies: ["clsx", "tailwind-merge"],
      },
    ])

    delete process.env.BEARER_TOKEN
  })

  it("should mix URLs and named components", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9082/registry/item.json",
      "@one/foo",
      "button",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(3)
    expect(parsed.map((p: any) => p.name)).toEqual(["item", "foo", "button"])
  })

  it("should handle non-existent component gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "non-existent"])

    expect(output.stdout).toContain("not found")
  })

  it("should handle non-existent registry gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "@unknown/component"])

    expect(output.stdout).toContain('Unknown registry "@unknown"')
  })

  it("should work with @shadcn namespace", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "view",
      "@shadcn/button",
      "@shadcn/card",
    ])

    const parsed = JSON.parse(output.stdout)
    expect(parsed).toHaveLength(2)
    expect(parsed.map((p: any) => p.name)).toEqual(["button", "card"])
  })

  it("should handle 404 for non-existent URL", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9081/r/does-not-exist.json",
    ])

    expect(output.stdout).toContain("not found")
  })

  it("should handle multiple errors in batch", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "view",
      "non-existent",
      "@one/does-not-exist",
    ])

    // Should fail on first error - non-existent component
    expect(output.stdout.toLowerCase()).toContain("not found")
  })

  it("should handle invalid URL format", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, ["view", "not-a-valid-url"])

    // With defaults in place, it will try to fetch as a component and fail
    expect(output.stdout.toLowerCase()).toContain("not found")
  })

  it("should handle network timeouts gracefully", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9999/timeout.json", // Non-existent server
    ])

    // Check for connection error in the output
    expect(output.stdout.toLowerCase()).toContain("failed, reason:")
  })

  it("should handle mixed success and failure", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "view",
      "button",
      "non-existent-component",
    ])

    // Should fail fast on first error
    expect(output.stdout).not.toContain('"name": "button"')
    expect(output.stdout).toContain("not found")
  })

  it("should handle missing environment variables for authenticated registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@auth": {
        url: "http://localhost:9082/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer ${MISSING_ENV_VAR}",
        },
      },
    })

    const output = await npxShadcn(fixturePath, ["view", "@auth/secure-item"])

    expect(output.stdout).toContain("MISSING_ENV_VAR")
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
        port: 9083,
        path: "/bad",
      }
    )

    await badServer.start()

    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, [
      "view",
      "http://localhost:9083/bad/invalid-schema.json",
    ])

    // Should handle validation error
    expect(output.stdout.toLowerCase()).toContain("failed to parse")

    await badServer.stop()
  })

  it("should handle dependencies that require authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    // Configure both registries - @two requires auth, @one doesn't
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
      "@two": {
        url: "http://localhost:9082/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    // complex depends on @two/item which requires auth
    const output = await npxShadcn(fixturePath, ["view", "@one/complex"])

    // Should just show the component metadata, not fail on auth
    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "complex",
        type: "registry:component",
        registryDependencies: expect.arrayContaining(["@two/item", "@one/foo"]),
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "components/complex.tsx",
            type: "registry:component",
          }),
        ]),
      },
    ])
  })

  it("should fail when viewing component with unauthenticated dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    // Configure registries - @two requires auth but no token provided
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
      "@two": "http://localhost:9082/registry/bearer/{name}",
    })

    // Try to view complex which depends on @two/item (requires auth)
    // Note: This should succeed for view command as it just shows metadata
    const output = await npxShadcn(fixturePath, ["view", "@one/complex"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "complex",
        type: "registry:component",
        registryDependencies: expect.arrayContaining(["@two/item"]),
      },
    ])
  })

  it("should view authenticated dependencies when directly requested", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    // Configure with proper auth
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:9082/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    // Directly view the authenticated item
    const output = await npxShadcn(fixturePath, ["view", "@two/item"])

    expect(JSON.parse(output.stdout)).toMatchObject([
      {
        name: "item",
        type: "registry:ui",
        description: "Item component from registry two",
        files: expect.arrayContaining([
          expect.objectContaining({
            path: "components/ui/item.tsx",
            type: "registry:ui",
          }),
        ]),
      },
    ])
  })

  it("should view component with all metadata fields", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@one/foo"])
    const parsed = JSON.parse(output.stdout)

    expect(parsed[0]).toMatchObject({
      name: "foo",
      type: "registry:component",
      description: "Foo component from registry one",
      dependencies: ["clsx", "tailwind-merge"],
      files: expect.arrayContaining([
        expect.objectContaining({
          path: "components/foo.tsx",
          type: "registry:component",
        }),
      ]),
      tailwind: expect.objectContaining({
        config: expect.objectContaining({
          theme: expect.objectContaining({
            extend: expect.objectContaining({
              colors: expect.objectContaining({
                foo: "#ff0000",
              }),
            }),
          }),
        }),
      }),
      cssVars: expect.objectContaining({
        light: expect.objectContaining({
          "foo-color": "#ff0000",
        }),
        dark: expect.objectContaining({
          "foo-color": "#00ff00",
        }),
      }),
    })
  })

  it("should handle namespace with special characters", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "@test-123/component"])

    expect(output.stdout).toContain('Unknown registry "@test-123"')
  })

  it("should handle empty component name in namespace", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "@shadcn/"])

    expect(output.stdout).toContain("not found")
  })

  it("should handle namespace without @ prefix", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "one/foo"])

    // Without @ prefix, it's treated as a regular component name
    expect(output.stdout).toContain("not found")
  })

  it("should handle double namespace", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "@@test/component"])

    expect(output.stdout).toContain("not found")
  })

  it("should two error for unknown registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["view", "@test/component"])

    expect(output.stdout).toContain('Unknown registry "@test"')
  })

  it("should two error for unknown registry not in first position", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "view",
      "@shadcn/component",
      "@does-not-exist/component",
    ])

    expect(output.stdout).toContain('Unknown registry "@does-not-exist"')
  })

  it("should handle namespace with multiple slashes", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "view",
      "@test/path/to/component",
    ])

    expect(output.stdout).toContain('Unknown registry "@test"')
  })

  it("should view from components.json with registries config only", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@one/foo"])

    expect(output.stdout).toContain("Foo component from registry one")
  })

  it("should error when viewing from non-existent registry with configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Configure @one registry, but try to view from @two
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["view", "@two/item"])

    expect(output.stdout).toContain('Unknown registry "@two"')
  })

  it("should error when viewing non-existent item from configured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Configure @one registry
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:9081/r/{name}",
    })

    // Try to view an item that doesn't exist in @one registry
    const output = await npxShadcn(fixturePath, ["view", "@one/does-not-exist"])

    expect(output.stdout).toContain("not found")
  })
})
