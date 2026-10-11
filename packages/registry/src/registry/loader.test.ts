import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { describe, expect, it } from "vitest"

import {
  RegistryErrorCode,
  RegistryItemNotFoundError,
  RegistryLocalFileError,
  RegistryParseError,
  RegistryValidationError,
} from "./errors"
import {
  getRegistryItemFileRootPath,
  getRegistryItemFileSource,
  loadRegistry,
  loadRegistryItem,
  readRegistryWithIncludes,
} from "./loader"

describe("readRegistryWithIncludes", () => {
  it("resolves explicit registry.json includes before local items", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json", "registry/hooks/registry.json"],
        items: [
          {
            name: "root-item",
            type: "registry:item",
          },
        ],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "registry/ui/button.tsx": "export function Button() {}",
      "registry/hooks/registry.json": JSON.stringify({
        name: "example-hooks",
        homepage: "https://example.com",
        items: [
          {
            name: "use-toggle",
            type: "registry:hook",
            files: [
              {
                path: "use-toggle.ts",
                type: "registry:hook",
              },
            ],
          },
        ],
      }),
      "registry/hooks/use-toggle.ts": "export function useToggle() {}",
    })

    const result = await readRegistryWithIncludes("registry.json", { cwd })

    expect(result.usesInclude).toBe(true)
    expect(result.registry).toMatchObject({
      name: "example",
      homepage: "https://example.com",
      items: [
        { name: "button" },
        { name: "use-toggle" },
        { name: "root-item" },
      ],
    })
    expect(result.registry).not.toHaveProperty("include")
    expect(
      getRegistryItemFileSource("button", "button.tsx", result.itemSources, cwd)
    ).toBe(path.join(cwd, "registry/ui/button.tsx"))
    expect(
      getRegistryItemFileRootPath(
        "button",
        "button.tsx",
        result.itemSources,
        cwd,
        cwd
      )
    ).toBe("registry/ui/button.tsx")
  })

  it("rejects root registries without name and homepage", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        include: ["registry/ui/registry.json"],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow('root registry.json must define "name" and "homepage"')
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("reports invalid registry JSON as a parse error", async () => {
    const cwd = await createFixture({
      "registry.json": "{",
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryParseError)
  })

  it("rejects include targets that are not registry.json files", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui.json"],
        items: [],
      }),
      "registry/ui.json": JSON.stringify({
        name: "example-ui",
        homepage: "https://example.com",
        items: [],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow('Use a path like "./registry/ui/registry.json"')
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects remote include paths", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["https://example.com/registry.json"],
        items: [],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("remote includes are not supported")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects absolute include paths", async () => {
    const cwd = await createFixture({
      "registry/ui/registry.json": JSON.stringify({
        items: [],
      }),
    })
    await fs.writeFile(
      path.join(cwd, "registry.json"),
      JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: [path.join(cwd, "registry/ui/registry.json")],
        items: [],
      })
    )

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("include paths must be relative")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects include cycles", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./registry.json"],
        items: [],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("Registry include cycle detected")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects include trees that exceed the maximum depth", async () => {
    const files: Record<string, string> = {
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry-1/registry.json"],
        items: [],
      }),
    }

    for (let index = 1; index <= 33; index++) {
      const registryPath = `${Array.from(
        { length: index },
        (_, nestedIndex) => `registry-${nestedIndex + 1}`
      ).join("/")}/registry.json`
      files[registryPath] = JSON.stringify({
        include:
          index < 33 ? [`registry-${index + 1}/registry.json`] : undefined,
        items: [],
      })
    }

    const cwd = await createFixture(files)

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("Registry include tree is too deep")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects duplicate include files before duplicate item validation", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json", "registry/ui/./registry.json"],
        items: [],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
          },
        ],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("Registry file included more than once")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects duplicate item names in the resolved catalog", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json"],
        items: [
          {
            name: "button",
            type: "registry:block",
          },
        ],
      }),
      "registry/ui/registry.json": JSON.stringify({
        name: "example-ui",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
          },
        ],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("Rename one of these items")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("rejects parent traversal in item file paths for include composition", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json"],
        items: [],
      }),
      "registry/ui/registry.json": JSON.stringify({
        name: "example-ui",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "../button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toThrow("file paths cannot use parent-directory traversal")
    await expect(
      readRegistryWithIncludes("registry.json", { cwd })
    ).rejects.toBeInstanceOf(RegistryValidationError)
  })

  it("keeps legacy single-file registries compatible", async () => {
    const cwd = await createFixture({
      "registry.flat.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "../button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    const result = await readRegistryWithIncludes("registry.flat.json", {
      cwd,
    })

    expect(result.usesInclude).toBe(false)
    expect(result.registry.items).toHaveLength(1)
  })

  it("keeps legacy file paths cwd-relative for nested single-file registries", async () => {
    const cwd = await createFixture({
      "registry/registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "components/button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "components/button.tsx": "export function Button() {}",
    })

    const registry = await loadRegistry({
      cwd,
      registryFile: "registry/registry.json",
    })

    expect(registry.items[0].files?.[0].path).toBe("components/button.tsx")
  })

  it("preserves registry dependencies for install-time resolution", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/blocks/registry.json"],
        items: [],
      }),
      "registry/blocks/registry.json": JSON.stringify({
        name: "example-blocks",
        homepage: "https://example.com",
        items: [
          {
            name: "login-form",
            type: "registry:block",
            registryDependencies: [
              "button",
              "@acme/button",
              "https://example.com/r/input.json",
            ],
          },
        ],
      }),
    })

    const result = await readRegistryWithIncludes("registry.json", { cwd })

    expect(result.registry.items[0].registryDependencies).toEqual([
      "button",
      "@acme/button",
      "https://example.com/r/input.json",
    ])
  })

  it("resolves a local registry catalog for dynamic registry routes", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json"],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "registry/ui/button.tsx": "export function Button() {}",
    })

    const registry = await loadRegistry({ cwd })

    expect(registry).toMatchObject({
      name: "example",
      homepage: "https://example.com",
      items: [
        {
          name: "button",
          files: [
            {
              path: "registry/ui/button.tsx",
            },
          ],
        },
      ],
    })
    expect(registry).not.toHaveProperty("include")
    expect(registry.items[0].files?.[0]).not.toHaveProperty("content")
  })

  it("resolves a local registry item for dynamic item routes", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json"],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "registry/ui/button.tsx": "export function Button() {}",
    })

    const item = await loadRegistryItem("button", {
      cwd,
    })

    expect(item).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          content: "export function Button() {}",
        },
      ],
    })
  })

  it("reports missing item files with item and source context", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry/ui/registry.json"],
      }),
      "registry/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    await expect(loadRegistryItem("button", { cwd })).rejects.toThrow(
      'Failed to read file "button.tsx" for registry item "button"'
    )
    await expect(loadRegistryItem("button", { cwd })).rejects.toBeInstanceOf(
      RegistryLocalFileError
    )
  })

  it("uses the selected item source when duplicate names exist in a flat registry", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "missing-button.tsx",
                type: "registry:ui",
              },
            ],
          },
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "button.tsx": "export function Button() {}",
    })

    await expect(loadRegistryItem("button", { cwd })).rejects.toThrow(
      "registry.json items[0]"
    )
  })

  it("throws a typed error when a registry item is not found", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [],
      }),
    })

    await expect(loadRegistryItem("button", { cwd })).rejects.toBeInstanceOf(
      RegistryItemNotFoundError
    )
    await expect(loadRegistryItem("button", { cwd })).rejects.toMatchObject({
      code: RegistryErrorCode.NOT_FOUND,
      itemName: "button",
    })
  })
})

async function createFixture(files: Record<string, string>) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-registry-"))

  await Promise.all(
    Object.entries(files).map(async ([filePath, content]) => {
      const targetPath = path.join(cwd, filePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )

  return cwd
}
