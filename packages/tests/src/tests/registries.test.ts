/* eslint-disable turbo/no-undeclared-env-vars */
import path from "path"
import fs from "fs-extra"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  cssHasProperties,
  npxShadcn,
} from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

const registryShadcn = await createRegistryServer(
  [
    {
      name: "utils",
      type: "registry:component",
      files: [
        {
          path: "registry/new-york-v4/lib/utils.ts",
          content:
            'import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n',
          type: "registry:lib",
        },
      ],
    },
    {
      name: "alert-dialog",
      type: "registry:ui",
      files: [
        {
          path: "components/ui/alert-dialog.tsx",
          content:
            "export function AlertDialog() {\n  return <div>AlertDialog Component from Registry Shadcn</div>\n}",
          type: "registry:ui",
        },
        {
          path: "components/ui/button.tsx",
          content:
            "export function Button() {\n  return <div>Button Component from Registry Shadcn</div>\n}",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "button",
      type: "registry:ui",
      files: [
        {
          path: "components/ui/button.tsx",
          content:
            "export function Button() {\n  return <div>Button Component from Registry Shadcn</div>\n}",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "example-button",
      type: "registry:component",
      registryDependencies: ["@shadcn/button"],
      files: [
        {
          path: "components/example-button.tsx",
          content:
            "export function ExampleButton() {\n  return <div>Example Button Component from Registry Shadcn</div>\n}",
          type: "registry:component",
        },
      ],
    },
    {
      name: "no-framework-item",
      type: "registry:item",
      files: [
        {
          path: "path/to/foo.txt",
          content: "Foo Bar",
          type: "registry:item",
          target: "path/to/foo.txt",
        },
      ],
    },
  ],
  {
    port: 4040,
    path: "/r",
  }
)

const registryOne = await createRegistryServer(
  [
    {
      name: "style",
      type: "registry:style",
      cssVars: {
        theme: {
          "font-sans": "Inter, sans-serif",
        },
        light: {
          brand: "oklch(20 14.3% 4.1%)",
          "brand-foreground": "oklch(24 1.3% 10%)",
        },
        dark: {
          brand: "oklch(24 1.3% 10%)",
        },
      },
      css: {
        button: {
          cursor: "pointer",
        },
      },
    },
    {
      name: "foo",
      type: "registry:component",
      files: [
        {
          path: "components/foo.tsx",
          content:
            "export function Foo() {\n  return <div>Foo Component from Registry 1</div>\n}",
          type: "registry:component",
        },
      ],
    },
    {
      name: "bar",
      type: "registry:component",
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
      name: "baz",
      type: "registry:component",
      registryDependencies: ["@one/bar"],
      files: [
        {
          path: "components/baz.tsx",
          content:
            "export function Baz() {\n  return <div>Baz Component from Registry 2</div>\n}",
          type: "registry:component",
        },
      ],
    },
    {
      name: "qux",
      type: "registry:component",
      registryDependencies: ["@one/baz"],
      files: [
        {
          path: "components/qux.tsx",
          content:
            "export function Qux() {\n  return <div>Qux Component from Registry 2</div>\n}",
          type: "registry:component",
        },
      ],
    },
    {
      name: "quux",
      type: "registry:page",
      registryDependencies: ["@two/two"],
      files: [
        {
          path: "path/to/app/quux/page.tsx",
          content:
            "export function Quux() {\n  return <div>Quux Component from Registry 2</div>\n}",
          type: "registry:page",
          target: "app/quux/page.tsx",
        },
      ],
    },
    {
      name: "foo-theme",
      type: "registry:theme",
      cssVars: {
        light: {
          background: "white",
          foreground: "black",
        },
        dark: {
          background: "black",
          foreground: "white",
        },
      },
    },
  ],
  {
    port: 4444,
    path: "/r",
  }
)

const registryTwo = await createRegistryServer(
  [
    {
      name: "style",
      type: "registry:style",
      cssVars: {
        theme: {
          "font-serif": "Garamond, serif",
        },
        light: {
          neutral: "oklch(10 14.3% 4.1%)",
          "neutral-foreground": "oklch(24 3% 10%)",
        },
        dark: {
          neutral: "oklch(24 1.3% 10%)",
        },
      },
      css: {
        button: {
          cursor: "pointer",
        },
      },
    },
    {
      name: "one",
      type: "registry:file",
      files: [
        {
          path: "path/to/one.txt",
          content: "one",
          type: "registry:file",
          target: "example/one.txt",
        },
      ],
    },
    {
      name: "two",
      type: "registry:ui",
      registryDependencies: ["button", "@one/qux"],
      files: [
        {
          path: "components/ui/two.tsx",
          content:
            "export function Two() {\n  return <div>Two Component from Registry 2</div>\n}",
          type: "registry:ui",
        },
        {
          path: "components/example.tsx",
          content:
            "export function Example() {\n  return <div>Example Component from Registry 2</div>\n}",
          type: "registry:component",
        },
      ],
    },
    {
      name: "theme",
      type: "registry:theme",
      cssVars: {
        light: {
          background: "red",
          foreground: "blue",
          primary: "green",
        },
        dark: {
          foreground: "red",
        },
      },
    },
  ],
  {
    port: 5555,
    path: "/registry",
  }
)

beforeAll(async () => {
  // This sets the shadcn registry to our mock registry.
  process.env.REGISTRY_URL = "http://localhost:4040/r"
  await registryShadcn.start()
  await registryOne.start()
  await registryTwo.start()
})

afterAll(async () => {
  await registryShadcn.stop()
  await registryOne.stop()
  await registryTwo.stop()
})

describe("registries", () => {
  it("should add from registry using url", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, ["add", "http://localhost:4444/r/foo"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
  })

  it("should add multiple items from registry using urls", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, [
      "add",
      "http://localhost:4444/r/foo",
      "http://localhost:4444/r/bar",
    ])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
  })

  it("should add multiple items from multiple registries using urls", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, [
      "add",
      "http://localhost:4444/r/foo",
      "http://localhost:5555/registry/one",
    ])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
    expect(await fs.pathExists(path.join(fixturePath, "example/one.txt"))).toBe(
      true
    )
  })

  it("should add item using name and from registry url", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, [
      "add",
      "alert-dialog",
      "http://localhost:4444/r/foo",
    ])

    expect(
      await fs.pathExists(
        path.join(fixturePath, "components/ui/alert-dialog.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
  })

  it("should add item from name, local path and registry url", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await npxShadcn(fixturePath, [
      "add",
      "alert-dialog",
      "../../fixtures/registry/example-item.json",
      "http://localhost:4444/r/foo",
    ])

    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.pathExists(
        path.join(fixturePath, "components/ui/alert-dialog.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
  })

  it("should show only built-in registries when not configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["info"])
    // Should show registries since @shadcn is built-in
    expect(output.stdout).toContain("registries:")
    expect(output.stdout).toContain("@shadcn")
    // Should not show user-defined registries
    expect(output.stdout).not.toContain("@one")
    expect(output.stdout).not.toContain("@two")
  })

  it("should show an error when adding from a non-existent registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "add",
      "@non-existent/component",
    ])
    expect(output.stdout).toContain('Unknown registry "@non-existent"')
    expect(output.stdout).toContain(
      '"registries": {\n' +
        '    "@non-existent": "[URL_TO_REGISTRY]"\n' +
        "  }\n"
    )
  })

  it("should show registries when configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["info"])
    // Should contain both built-in and user registries
    expect(output.stdout).toContain("registries:")
    expect(output.stdout).toContain("@shadcn")
    expect(output.stdout).toContain("@one")
    expect(output.stdout).toContain("http://localhost:4444/r/{name}")
  })

  it("should show multiple registries when configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
      "@two": {
        url: "http://localhost:5555/registry/{name}",
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    const output = await npxShadcn(fixturePath, ["info"])
    // Should contain built-in and both user registries
    expect(output.stdout).toContain("registries:")
    expect(output.stdout).toContain("@shadcn")
    expect(output.stdout).toContain("@one")
    expect(output.stdout).toContain("@two")
    expect(output.stdout).toContain("http://localhost:4444/r/{name}")
    expect(output.stdout).toContain("http://localhost:5555/registry/{name}")
  })

  it("should show an error when adding from a non-existent registry with configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["add", "@acme/component"])
    expect(output.stdout).toContain('Unknown registry "@acme"')
    expect(output.stdout).toContain(
      '"registries": {\n' + '    "@acme": "[URL_TO_REGISTRY]"\n' + "  }\n"
    )
  })

  it("should add item using namespaced registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["add", "@one/foo"])

    if (!(await fs.pathExists(path.join(fixturePath, "components/foo.tsx")))) {
      console.log("Test failed. Command output:", output.stdout)
      console.log("Command stderr:", output.stderr)
    }

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
  })

  it("should add multiple items using namespaced registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    await npxShadcn(fixturePath, ["add", "@one/foo", "@one/bar"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
  })

  it("should add registry dependencies when adding from namespaced registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    await npxShadcn(fixturePath, ["add", "@one/baz"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/baz.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
  })

  it("should add nested registry dependencies when adding from namespaced registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    await npxShadcn(fixturePath, ["add", "@one/qux"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/qux.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/baz.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
  })

  it("should show an error when adding url with namespaced dependency", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "add",
      "http://localhost:4444/r/baz",
    ])

    expect(output.stdout).toContain('Unknown registry "@one"')
  })

  it("should show an error when adding url with unconfigured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "add",
      "http://localhost:5555/registry/two",
    ])

    expect(output.stdout).toContain('Unknown registry "@one"')
  })

  it("should show an error when adding namespaced with unconfigured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@two": "http://localhost:5555/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, ["add", "@two/two"])
    expect(output.stdout).toContain('Unknown registry "@one"')
  })

  it("should show an error when adding multiple namespaced items with unconfigured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@two": "http://localhost:5555/registry/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "add",
      "@two/one",
      "@foobar/foo",
    ])

    expect(output.stdout).toContain('Unknown registry "@foobar"')
  })

  it("should show an error when authentication is not configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": "http://localhost:5555/registry/bearer/{name}",
    })
    const output = await npxShadcn(fixturePath, ["add", "@two/one"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should add item when authentication is configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:5555/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })

    await npxShadcn(fixturePath, ["add", "@two/one"])

    expect(await fs.pathExists(path.join(fixturePath, "example/one.txt"))).toBe(
      true
    )
  })

  it("should show an error for nested unauthorized dependencies", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
      "@two": "http://localhost:5555/registry/bearer/{name}",
    })
    const output = await npxShadcn(fixturePath, ["add", "@one/quux"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should add item when authentication is configured and nested dependencies are authorized", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
      "@two": {
        url: "http://localhost:5555/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
        },
      },
    })
    await npxShadcn(fixturePath, ["add", "@one/quux"])

    expect(
      await fs.pathExists(path.join(fixturePath, "app/quux/page.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/two.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/example.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/qux.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/baz.tsx"))
    ).toBe(true)
  })

  it("should error when adding item with api key authentication and no api key is provided", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": "http://localhost:5555/registry/api-key/{name}",
    })
    const output = await npxShadcn(fixturePath, ["add", "@two/one"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should add item with api key authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:5555/registry/api-key/{name}",
        headers: {
          "x-api-key": "EXAMPLE_API_KEY",
        },
      },
    })
    await npxShadcn(fixturePath, ["add", "@two/one"])
    expect(await fs.pathExists(path.join(fixturePath, "example/one.txt"))).toBe(
      true
    )
  })

  it("should error when adding item with client secret authentication and no client secret is provided", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:5555/registry/client-secret/{name}",
      },
    })
    const output = await npxShadcn(fixturePath, ["add", "@two/one"])
    expect(output.stdout).toContain("Unauthorized")
  })

  it("should add item with client secret authentication", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:5555/registry/client-secret/{name}",
        headers: {
          "x-client-secret": "EXAMPLE_CLIENT_SECRET",
          "x-client-id": "EXAMPLE_CLIENT_ID",
        },
      },
    })
    await npxShadcn(fixturePath, ["add", "@two/one"])
    expect(await fs.pathExists(path.join(fixturePath, "example/one.txt"))).toBe(
      true
    )
  })

  it("should expand env vars in registries config", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "${NEXT_PUBLIC_REGISTRY_URL}/r/{name}",
    })

    process.env.NEXT_PUBLIC_REGISTRY_URL = "http://localhost:4444/r"
    await npxShadcn(fixturePath, ["add", "@one/foo"])
    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
  })

  it("should expand env vars in registries config with multiple registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "${NEXT_PUBLIC_REGISTRY_URL}/r/{name}",
      "@two": {
        url: "http://localhost:5555/registry/params/{name}?token=${REGISTRY_TOKEN}",
        headers: {
          "x-client-secret": "EXAMPLE_CLIENT_SECRET",
          "x-client-id": "EXAMPLE_CLIENT_ID",
        },
      },
      "@three": {
        url: "http://localhost:4444/r/api-key/{name}",
        headers: {
          "x-api-key": "${REGISTRY_API_KEY}",
        },
      },
    })

    process.env.NEXT_PUBLIC_REGISTRY_URL = "http://localhost:4444/r"
    process.env.REGISTRY_TOKEN = "EXAMPLE_REGISTRY_TOKEN"
    process.env.REGISTRY_API_KEY = "EXAMPLE_API_KEY"
    await npxShadcn(fixturePath, ["add", "@one/foo", "@three/baz", "@two/two"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/baz.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/two.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/example.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/qux.tsx"))
    ).toBe(true)
  })

  describe("fetchFromRegistry improvements", () => {
    it("should handle registry resolution transparently", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      await configureRegistries(fixturePath, {
        "@one": "http://localhost:4444/r/{name}",
        "@two": {
          url: "http://localhost:5555/registry/{name}",
          headers: {
            Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
          },
        },
      })

      // Test that components can be added without pre-resolution
      await npxShadcn(fixturePath, ["add", "@one/foo", "@two/two"])

      // Verify all files were created including dependencies
      expect(
        await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/ui/two.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/example.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/qux.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/baz.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/bar.tsx"))
      ).toBe(true)
    })

    it("should maintain type safety with mixed registries", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      await configureRegistries(fixturePath, {
        "@one": "http://localhost:4444/r/{name}",
      })

      // Mix of namespaced and non-namespaced components
      await npxShadcn(fixturePath, ["add", "@one/foo", "button"])

      expect(
        await fs.pathExists(path.join(fixturePath, "components/foo.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
      ).toBe(true)
    })

    it("should handle circular dependencies gracefully", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      // Create a mock server with circular dependencies
      const circularServer = await createRegistryServer(
        [
          {
            name: "comp-a",
            type: "registry:component",
            registryDependencies: ["@circular/comp-b"],
            files: [
              {
                path: "components/comp-a.tsx",
                content:
                  "export function CompA() { return <div>Component A</div> }",
                type: "registry:component",
              },
            ],
          },
          {
            name: "comp-b",
            type: "registry:component",
            registryDependencies: ["@circular/comp-a"],
            files: [
              {
                path: "components/comp-b.tsx",
                content:
                  "export function CompB() { return <div>Component B</div> }",
                type: "registry:component",
              },
            ],
          },
        ],
        {
          port: 9999,
          path: "/circular",
        }
      )

      await circularServer.start()

      await configureRegistries(fixturePath, {
        "@circular": "http://localhost:9999/circular/{name}",
      })

      // Should handle circular dependency without infinite loop
      await npxShadcn(fixturePath, ["add", "@circular/comp-a"])

      // Both components should be added once
      expect(
        await fs.pathExists(path.join(fixturePath, "components/comp-a.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/comp-b.tsx"))
      ).toBe(true)

      await circularServer.stop()
    })

    it("should preserve header context across dependency resolution", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      // Create a server that validates headers for all requests
      const authServer = await createRegistryServer(
        [
          {
            name: "parent",
            type: "registry:component",
            registryDependencies: ["@auth/child1", "@auth/child2"],
            files: [
              {
                path: "components/parent.tsx",
                content:
                  "export function Parent() { return <div>Parent</div> }",
                type: "registry:component",
              },
            ],
          },
          {
            name: "child1",
            type: "registry:component",
            files: [
              {
                path: "components/child1.tsx",
                content:
                  "export function Child1() { return <div>Child 1</div> }",
                type: "registry:component",
              },
            ],
          },
          {
            name: "child2",
            type: "registry:component",
            files: [
              {
                path: "components/child2.tsx",
                content:
                  "export function Child2() { return <div>Child 2</div> }",
                type: "registry:component",
              },
            ],
          },
        ],
        {
          port: 10000,
          path: "/auth-test",
        }
      )

      await authServer.start()

      await configureRegistries(fixturePath, {
        "@auth": {
          url: "http://localhost:10000/auth-test/bearer/{name}",
          headers: {
            Authorization: "Bearer EXAMPLE_BEARER_TOKEN",
          },
        },
      })

      // Add parent which should trigger requests for dependencies
      await npxShadcn(fixturePath, ["add", "@auth/parent"])

      // All components should be added
      expect(
        await fs.pathExists(path.join(fixturePath, "components/parent.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/child1.tsx"))
      ).toBe(true)
      expect(
        await fs.pathExists(path.join(fixturePath, "components/child2.tsx"))
      ).toBe(true)

      await authServer.stop()
    })
  })

  describe("built-in registries", () => {
    it("should error when trying to override @shadcn in config", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      // Read the existing components.json
      const configPath = path.join(fixturePath, "components.json")
      const config = await fs.readJson(configPath)

      // Add @shadcn as a registry
      config.registries = {
        "@shadcn": "https://my-custom-registry.com/{name}",
      }

      // Write the updated config
      await fs.writeJson(configPath, config, { spaces: 2 })

      // Try to run a command that loads the config
      const output = await npxShadcn(fixturePath, ["info"])

      // Check either stdout or stderr for the error message
      const combinedOutput = output.stdout + output.stderr

      // The error should be about built-in registry or invalid configuration
      expect(combinedOutput.toLowerCase()).toMatch(
        /built-in registry|invalid configuration/
      )
    })

    it("should work with @shadcn namespace without configuration", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      // Don't configure any registries - @shadcn should be built-in
      const output = await npxShadcn(fixturePath, ["add", "@shadcn/button"])

      if (
        !(await fs.pathExists(
          path.join(fixturePath, "components/ui/button.tsx")
        ))
      ) {
        console.log("Test failed. Command output:", output.stdout)
        console.log("Command stderr:", output.stderr)
      }

      // Should add button component just like regular "button" command
      expect(
        await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
      ).toBe(true)
    })

    it("should allow similar but different registry names", async () => {
      const fixturePath = await createFixtureTestDirectory("next-app-init")

      await configureRegistries(fixturePath, {
        "@shadcn-ui": "http://localhost:4444/r/{name}",
        "@myshadcn": "http://localhost:4444/r/{name}",
        "@shadcntest": "http://localhost:4444/r/{name}",
      })

      // Try to run a command that loads the config
      const output = await npxShadcn(fixturePath, ["info"])

      // Should not error - check that registries are shown
      expect(output.stdout).toContain("@shadcn-ui")
      expect(output.stdout).toContain("@myshadcn")
      expect(output.stdout).toContain("@shadcntest")
      expect(output.stdout).not.toContain("built-in registry")
    })
  })

  it("should add registry:item with no framework", async () => {
    const fixturePath = await createFixtureTestDirectory("no-framework")
    await npxShadcn(fixturePath, ["add", "no-framework-item"])

    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.readFile(path.join(fixturePath, "path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })

  it("should add registry:theme", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, [
      "add",
      "@one/foo-theme",
      "--yes",
    ])

    expect(output.stderr).toContain("Updating CSS variables in app/globals.css")

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )

    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: ":root",
          properties: {
            "--background": "white",
            "--foreground": "black",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--background": "black",
            "--foreground": "white",
          },
        },
      ])
    ).toBe(true)
  })

  it("should merge registry:theme with existing theme", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
      "@two": {
        url: "http://localhost:5555/registry/{name}",
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    process.env.BEARER_TOKEN = "1234567890"

    await npxShadcn(fixturePath, [
      "add",
      "@one/foo-theme",
      "@two/theme",
      "--yes",
    ])
    expect(
      cssHasProperties(
        await fs.readFile(path.join(fixturePath, "app/globals.css"), "utf-8"),
        [
          {
            selector: ":root",
            properties: {
              "--background": "red",
              "--foreground": "blue",
              "--primary": "green",
            },
          },
          {
            selector: ".dark",
            properties: {
              "--background": "black",
              "--foreground": "red",
            },
          },
        ]
      )
    ).toBe(true)

    await npxShadcn(fixturePath, [
      "add",
      "@two/theme",
      "@one/foo-theme",
      "--yes",
    ])
    expect(
      cssHasProperties(
        await fs.readFile(path.join(fixturePath, "app/globals.css"), "utf-8"),
        [
          {
            selector: ":root",
            properties: {
              "--background": "white",
              "--foreground": "black",
              "--primary": "green",
            },
          },
          {
            selector: ".dark",
            properties: {
              "--background": "black",
              "--foreground": "white",
            },
          },
        ]
      )
    ).toBe(true)
  })

  it("should add named item from shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, ["add", "button"])
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })

  it("should add namespaced items from the shadcn registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await npxShadcn(fixturePath, [
      "add",
      "@shadcn/example-button",
      "@shadcn/no-framework-item",
    ])
    expect(
      await fs.pathExists(
        path.join(fixturePath, "components/example-button.tsx")
      )
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.readFile(path.join(fixturePath, "path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })

  it("should add namespaced items from shadcn registry with no-framework", async () => {
    const fixturePath = await createFixtureTestDirectory("no-framework")
    await npxShadcn(fixturePath, ["add", "@shadcn/no-framework-item"])
    expect(await fs.pathExists(path.join(fixturePath, "path/to/foo.txt"))).toBe(
      true
    )
    expect(
      await fs.readFile(path.join(fixturePath, "path/to/foo.txt"), "utf-8")
    ).toBe("Foo Bar")
  })
})

describe("registries:init", () => {
  beforeEach(async () => {
    process.env.REGISTRY_URL = "http://localhost:4000/r"
  })

  it("should error when init with unconfigured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const output = await npxShadcn(fixturePath, ["init", "@two/style"])
    expect(output.stdout).toContain('Unknown registry "@two"')
  })

  it("should init from registry:style", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    await npxShadcn(fixturePath, ["init", "@one/style"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")
    expect(componentsJson.registries).toMatchInlineSnapshot(`
      {
        "@one": "http://localhost:4444/r/{name}",
      }
    `)

    // Install utils from shadcn.
    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )

    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@theme inline",
          properties: {
            "--font-sans": "Inter, sans-serif",
            "--color-brand": "var(--brand)",
            "--color-brand-foreground": "var(--brand-foreground)",
          },
        },
        {
          selector: ":root",
          properties: {
            "--background": "oklch(1 0 0)",
            "--foreground": "oklch(0.145 0 0)",
            "--brand": "oklch(20 14.3% 4.1%)",
            "--brand-foreground": "oklch(24 1.3% 10%)",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--background": "oklch(0.145 0 0)",
            "--foreground": "oklch(0.985 0 0)",
            "--brand": "oklch(24 1.3% 10%)",
          },
        },
      ])
    ).toBe(true)
  })

  it("should init from registry:style with auth", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await configureRegistries(fixturePath, {
      "@two": {
        url: "http://localhost:5555/registry/bearer/{name}",
        headers: {
          Authorization: "Bearer ${BEARER_TOKEN}",
        },
      },
    })

    process.env.BEARER_TOKEN = "EXAMPLE_BEARER_TOKEN"

    await npxShadcn(fixturePath, ["init", "@two/style"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")
    expect(componentsJson.registries).toMatchInlineSnapshot(`
      {
        "@two": {
          "headers": {
            "Authorization": "Bearer \${BEARER_TOKEN}",
          },
          "url": "http://localhost:5555/registry/bearer/{name}",
        },
      }
    `)

    // Install utils from shadcn.
    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )
    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@theme inline",
          properties: {
            "--font-serif": "Garamond, serif",
            "--color-neutral": "var(--neutral)",
            "--color-neutral-foreground": "var(--neutral-foreground)",
          },
        },
        {
          selector: ":root",
          properties: {
            "--background": "oklch(1 0 0)",
            "--foreground": "oklch(0.145 0 0)",
            "--neutral": "oklch(10 14.3% 4.1%)",
            "--neutral-foreground": "oklch(24 3% 10%)",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--background": "oklch(0.145 0 0)",
            "--foreground": "oklch(0.985 0 0)",
            "--neutral": "oklch(24 1.3% 10%)",
          },
        },
      ])
    ).toBe(true)
  })
})
