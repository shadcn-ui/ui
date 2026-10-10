import {
  RegistryItemNotFoundError,
  RegistryValidationError,
} from "@/src/registry/errors"
import { describe, expect, it } from "vitest"

import {
  loadRegistryCatalogFromSource,
  loadRegistryItemFromSource,
  type RegistrySourceReader,
} from "./source"

function createReader(files: Record<string, string>): RegistrySourceReader {
  return {
    readText: async (filePath: string) => {
      const content = files[filePath]
      if (content === undefined) {
        throw new Error(`ENOENT: ${filePath}`)
      }
      return content
    },
  }
}

// Builds a chain of nested registry.json files: registry.json -> l1/registry.json
// -> l1/l2/registry.json -> ... -> l1/.../l{depth}/registry.json.
// Each level's include path has no parent-directory segments (the containment
// guards forbid ".."), so the chain can only ever get deeper, never shallower.
function buildDeepIncludeChain(depth: number) {
  const files: Record<string, string> = {
    "registry.json": JSON.stringify({
      name: "root",
      homepage: "https://example.com",
      include: ["./l1/registry.json"],
    }),
  }

  for (let level = 1; level <= depth; level++) {
    const dir = Array.from({ length: level }, (_, i) => `l${i + 1}`).join("/")
    const isLast = level === depth
    files[`${dir}/registry.json`] = JSON.stringify(
      isLast ? { items: [] } : { include: [`./l${level + 1}/registry.json`] }
    )
  }

  return files
}

describe("loadRegistryCatalogFromSource: probe / happy paths", () => {
  it("loads a single registry.json with no include and no files", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [{ name: "alert", type: "registry:ui" }],
      }),
    })

    const catalog = await loadRegistryCatalogFromSource(reader)

    expect(catalog).toMatchObject({
      name: "example",
      homepage: "https://example.com",
      items: [{ name: "alert" }],
    })
    expect(catalog).not.toHaveProperty("include")
  })

  it("loads two items from a single flat registry.json", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          { name: "alert", type: "registry:ui" },
          { name: "button", type: "registry:ui" },
        ],
      }),
    })

    const catalog = await loadRegistryCatalogFromSource(reader)

    expect(catalog.items.map((item) => item.name)).toEqual(["alert", "button"])
  })

  it("flattens items from a single include", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/registry.json"],
      }),
      "ui/registry.json": JSON.stringify({
        items: [{ name: "button", type: "registry:ui" }],
      }),
    })

    const catalog = await loadRegistryCatalogFromSource(reader)

    expect(catalog).toMatchObject({
      name: "example",
      homepage: "https://example.com",
    })
    expect(catalog).not.toHaveProperty("include")
    expect(catalog.items).toHaveLength(1)
    expect(catalog.items[0]).toMatchObject({ name: "button" })
  })

  it("flattens items from a two-level nested include", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/registry.json"],
      }),
      "ui/registry.json": JSON.stringify({
        include: ["./forms/registry.json"],
      }),
      "ui/forms/registry.json": JSON.stringify({
        items: [
          {
            name: "input",
            type: "registry:ui",
            files: [{ path: "input.tsx", type: "registry:ui" }],
          },
        ],
      }),
    })

    const catalog = await loadRegistryCatalogFromSource(reader)

    expect(catalog.items).toHaveLength(1)
    expect(catalog.items[0]).toMatchObject({ name: "input" })
    // File path is rewritten to be relative to the root registry.
    expect(catalog.items[0].files?.[0]).toMatchObject({
      path: "ui/forms/input.tsx",
    })
    // Catalog entries never carry file content.
    expect(catalog.items[0].files?.[0]).not.toHaveProperty("content")
  })
})

describe("loadRegistryItemFromSource: happy paths", () => {
  it("loads item file content from inside the chunk directory", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/registry.json"],
      }),
      "ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [{ path: "button.tsx", type: "registry:ui" }],
          },
        ],
      }),
      "ui/button.tsx": "export function Button() {}",
    })

    const item = await loadRegistryItemFromSource("button", reader)

    expect(item).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "button",
      files: [
        {
          path: "ui/button.tsx",
          content: "export function Button() {}",
        },
      ],
    })
  })

  it("throws RegistryItemNotFoundError for an unknown item name", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [{ name: "alert", type: "registry:ui" }],
      }),
    })

    await expect(
      loadRegistryItemFromSource("does-not-exist", reader)
    ).rejects.toThrow(RegistryItemNotFoundError)
  })
})

describe("root registry validation", () => {
  it("requires name and homepage on the root registry.json", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        items: [{ name: "alert", type: "registry:ui" }],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /must define "name" and "homepage"/
    )
  })

  it("requires the root file to be named registry.json when it uses include", async () => {
    const reader = createReader({
      "root.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/registry.json"],
      }),
      "ui/registry.json": JSON.stringify({
        items: [{ name: "button", type: "registry:ui" }],
      }),
    })

    await expect(
      loadRegistryCatalogFromSource(reader, { registryFile: "root.json" })
    ).rejects.toThrow(/must be named registry\.json/)
  })
})

describe("include guards", () => {
  it("rejects an absolute include path", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["/etc/registry.json"],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /must be relative/
    )
  })

  it("rejects an include path with parent-directory traversal", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["../outside/registry.json"],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /parent-directory traversal/
    )
  })

  it("rejects an include path not named registry.json", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/components.json"],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /must explicitly reference a registry\.json/
    )
  })

  it("rejects a root registry file that resolves outside the source root", async () => {
    // Nested include paths can never actually escape the root: they cannot
    // contain "..", cannot be absolute, and must end in "registry.json" - so
    // resolveIncludePath's own containment check is unreachable in practice.
    // The only way to reach `validateRegistryFileWithinRoot`'s error is by
    // supplying a malicious root `registryFile` option directly (the include
    // tree is still walked, since this root registry declares an include).
    const reader = createReader({
      "../outside/registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./ui/registry.json"],
      }),
      "../outside/ui/registry.json": JSON.stringify({
        items: [{ name: "button", type: "registry:ui" }],
      }),
    })

    await expect(
      loadRegistryCatalogFromSource(reader, {
        registryFile: "../outside/registry.json",
      })
    ).rejects.toThrow(RegistryValidationError)
    await expect(
      loadRegistryCatalogFromSource(reader, {
        registryFile: "../outside/registry.json",
      })
    ).rejects.toThrow(/stay inside the source registry root/)
  })

  it("rejects an include cycle", async () => {
    // A genuine two-distinct-file cycle (A includes B, B includes A) is not
    // reachable through the exported functions: include paths can never
    // contain "..", so once you include into a subdirectory there is no way
    // to reference back up to an ancestor's registry.json. The only
    // reachable cycle is a file that includes itself directly.
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./registry.json"],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /Registry include cycle detected/
    )
  })

  it("rejects the same registry.json included twice from different parents", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./a/registry.json", "./a/shared/registry.json"],
      }),
      "a/registry.json": JSON.stringify({
        include: ["./shared/registry.json"],
      }),
      "a/shared/registry.json": JSON.stringify({ items: [] }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /included more than once/
    )
  })

  it("rejects an include tree deeper than the maximum depth of 32", async () => {
    const reader = createReader(buildDeepIncludeChain(32))

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /include tree is too deep/
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /maximum include depth is 32/
    )
  })
})

describe("item file guards", () => {
  it("rejects a URL item file path", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "https://example.com/button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /remote file paths are not supported/
    )
  })

  it("rejects an absolute item file path", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [{ path: "/etc/passwd.tsx", type: "registry:ui" }],
          },
        ],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /file paths must be relative/
    )
  })

  it("rejects an item file path with parent-directory traversal", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [{ path: "../secret.tsx", type: "registry:ui" }],
          },
        ],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /cannot use parent-directory traversal/
    )
  })

  it("rejects an item file path that resolves to the chunk directory itself", async () => {
    // Since item file paths can never contain "..", the only way left to
    // "resolve outside the chunk directory" is a degenerate path (".") that
    // resolves to the directory itself rather than a file inside it -
    // isSourcePathInsideRoot treats an empty relative path as not-inside.
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [{ path: ".", type: "registry:ui" }],
          },
        ],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /stay inside the registry chunk directory/
    )
  })
})

describe("item name guards", () => {
  it("rejects a duplicate item name across two included files", async () => {
    const reader = createReader({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["./a/registry.json", "./b/registry.json"],
      }),
      "a/registry.json": JSON.stringify({
        items: [{ name: "button", type: "registry:ui" }],
      }),
      "b/registry.json": JSON.stringify({
        items: [{ name: "button", type: "registry:ui" }],
      }),
    })

    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      RegistryValidationError
    )
    await expect(loadRegistryCatalogFromSource(reader)).rejects.toThrow(
      /Duplicate registry item name "button"/
    )
  })
})
