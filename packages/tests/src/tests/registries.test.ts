/* eslint-disable turbo/no-undeclared-env-vars */
import path from "path"
import fs from "fs-extra"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"
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
  ],
  {
    port: 4000,
    path: "/r",
  }
)

const registryOne = await createRegistryServer(
  [
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
  ],
  {
    port: 4444,
    path: "/r",
  }
)

const registryTwo = await createRegistryServer(
  [
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
  ],
  {
    port: 5555,
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

  it("should not show registries when not configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, ["info"])
    expect(output.stdout).not.toContain("registries:")
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
        '    "@non-existent": "https://example.com/{name}.json"\n' +
        "  }\n"
    )
  })

  it("should show registries when configured", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["info"])
    expect(output.stdout).toContain(
      "registries: { '@one': 'http://localhost:4444/r/{name}' }"
    )
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
    expect(output.stdout).toContain(`registries: {
    '@one': 'http://localhost:4444/r/{name}',
    '@two': { url: 'http://localhost:5555/registry/{name}', headers: [Object] }
  },`)
  })

  it("should show an error when adding from a non-existent registry with configured registries", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")

    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    const output = await npxShadcn(fixturePath, ["add", "@acme/component"])
    expect(output.stdout).toContain('Unknown registry "@acme"')
    expect(output.stdout).toContain(
      '"registries": {\n' +
        '    "@acme": "https://example.com/{name}.json"\n' +
        "  }\n"
    )
  })

  it("should add item using namespaced registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    await configureRegistries(fixturePath, {
      "@one": "http://localhost:4444/r/{name}",
    })

    await npxShadcn(fixturePath, ["add", "@one/foo"])

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

    expect(output.stdout).toContain(
      "The items you're adding depend on unknown registry @one. \nMake sure it is defined in components.json as follows:\n" +
        `{\n  "registries": {\n    "@one": "https://example.com/{name}.json"\n  }\n}`
    )
  })

  it("should show an error when adding url with unconfigured registry", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app-init")
    const output = await npxShadcn(fixturePath, [
      "add",
      "http://localhost:5555/registry/two",
    ])

    expect(output.stdout).toContain(
      "The items you're adding depend on unknown registry @one. \nMake sure it is defined in components.json as follows:\n" +
        `{\n  "registries": {\n    "@one": "https://example.com/{name}.json"\n  }\n}`
    )
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

    const output = await npxShadcn(fixturePath, ["add", "@two/one", "@one/foo"])

    expect(output.stdout).toContain('Unknown registry "@one"')
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
    const output = await npxShadcn(fixturePath, [
      "add",
      "@one/foo",
      "@three/baz",
      "@two/two",
    ])

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
})
