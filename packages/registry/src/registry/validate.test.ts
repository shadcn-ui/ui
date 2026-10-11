import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { describe, expect, it } from "vitest"

import { validateRegistry } from "./validate"

describe("validateRegistry", () => {
  it("validates a buildable source registry with include", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["components/ui/registry.json"],
      }),
      "components/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            registryDependencies: [
              "input",
              "@acme/dialog",
              "https://example.com/r/card.json",
            ],
            files: [
              {
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "components/ui/button.tsx": "export function Button() {}",
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(true)
    expect(report.registryFiles).toBe(2)
    expect(
      report.registryFilePaths.map((filePath) => path.relative(cwd, filePath))
    ).toEqual(["registry.json", path.join("components", "ui", "registry.json")])
    expect(report.items).toBe(1)
    expect(report.diagnostics).toEqual([])
  })

  it("validates an empty source registry", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(true)
    expect(report.registryFiles).toBe(1)
    expect(report.items).toBe(0)
  })

  it("preserves cwd-relative files for legacy single-file registries", async () => {
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
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "button.tsx": "export function Button() {}",
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(true)
    expect(report.diagnostics).toEqual([])
  })

  it("collects independent diagnostics across include branches", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["components/ui.json", "hooks/registry.json"],
        items: [
          {
            name: "button",
            type: "registry:ui",
          },
        ],
      }),
      "hooks/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:hook",
            files: [
              {
                path: "missing.ts",
                type: "registry:hook",
              },
            ],
          },
        ],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        'Include "components/ui.json" must explicitly reference a registry.json file.',
        expect.stringContaining('Duplicate registry item name "button"'),
        'File "missing.ts" was not found or could not be read.',
      ])
    )
  })

  it("continues validating valid items when another item is invalid", async () => {
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
                path: "missing.tsx",
                type: "registry:ui",
              },
            ],
          },
          {
            name: "brand-font",
            type: "registry:font",
          },
        ],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.items).toBe(2)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          itemIndex: 0,
          itemName: "button",
          message: 'File "missing.tsx" was not found or could not be read.',
        }),
        expect.objectContaining({
          itemIndex: 1,
          itemName: "brand-font",
          message: "font: Required",
        }),
      ])
    )
  })

  it("reports all root-level issues for an empty object", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({}),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        'Root registry.json must define "name".',
        'Root registry.json must define "homepage".',
        "Registry must define at least one of `items` or `include`.",
      ])
    )
  })

  it("filters internal registry item types from item type diagnostics", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "button",
            type: "registry:unknown",
          },
        ],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("Invalid registry item type"),
        }),
      ])
    )
    expect(
      report.diagnostics.some(
        (diagnostic) =>
          diagnostic.message.includes("registry:example") ||
          diagnostic.message.includes("registry:internal")
      )
    ).toBe(false)
  })

  it("requires the root registry file to be named registry.json", async () => {
    const cwd = await createFixture({
      "registry.flat.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.flat.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Root source registry file must be named registry.json.",
        }),
      ])
    )
  })

  it("reports missing root registry files as validation diagnostics", async () => {
    const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-validate-"))

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.registryFiles).toBe(1)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Registry file was not found or could not be read.",
        }),
      ])
    )
  })

  it("reports include cycles", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["registry.json"],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("Registry include cycle detected"),
        }),
      ])
    )
  })

  it("reports include paths that are remote, absolute, or parent-traversing", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: [
          "https://example.com/registry.json",
          path.join(cwdRoot(), "registry.json"),
          "../registry.json",
        ],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        'Remote include "https://example.com/registry.json" is not supported.',
        expect.stringContaining("must be relative"),
        'Include "../registry.json" cannot use parent-directory traversal.',
      ])
    )
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          includePath: "../registry.json",
          suggestion:
            "Registry includes must descend from the including chunk. Move shared registries into the registry root and include them from there.",
        }),
      ])
    )
  })

  it("reports root registry files outside cwd", async () => {
    const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-validate-"))
    const outside = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: path.relative(cwd, path.join(outside, "registry.json")),
    })

    expect(report.valid).toBe(false)
    expect(report.registryFiles).toBe(0)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining(
            "Root registry file must stay inside"
          ),
        }),
      ])
    )
  })

  it("reports include trees that are too deep", async () => {
    const files: Record<string, string> = {}
    const depth = 33

    for (let index = 0; index <= depth; index++) {
      const filePath =
        index === 0
          ? "registry.json"
          : path.join(...getIncludeSegments(index), "registry.json")
      const nextPath =
        index === depth
          ? undefined
          : path.join(...getIncludeSegments(index + 1), "registry.json")

      files[filePath] = JSON.stringify({
        ...(index === 0
          ? {
              name: "example",
              homepage: "https://example.com",
            }
          : {}),
        ...(nextPath
          ? { include: [path.relative(path.dirname(filePath), nextPath)] }
          : { items: [] }),
      })
    }

    const cwd = await createFixture(files)

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("Registry include tree is too deep"),
        }),
      ])
    )
  })

  it("reports registry files included through multiple branches", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: [
          "components/registry.json",
          "components/shared/registry.json",
        ],
      }),
      "components/registry.json": JSON.stringify({
        include: ["shared/registry.json"],
      }),
      "components/shared/registry.json": JSON.stringify({
        items: [],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.registryFiles).toBe(3)
    expect(
      report.registryFilePaths.map((filePath) => path.relative(cwd, filePath))
    ).toEqual([
      "registry.json",
      path.join("components", "registry.json"),
      path.join("components", "shared", "registry.json"),
    ])
    expect(report.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining(
            "Registry file included more than once"
          ),
        }),
      ])
    )
  })

  it("reports missing root registry metadata", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        items: [],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        'Root registry.json must define "name".',
        'Root registry.json must define "homepage".',
      ])
    )
  })

  it("reports invalid JSON and missing includes without validating dependency names", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["components/ui/registry.json", "hooks/registry.json"],
        items: [
          {
            name: "card",
            type: "registry:ui",
            registryDependencies: ["input"],
          },
        ],
      }),
      "components/ui/registry.json": "{",
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.registryFiles).toBe(3)
    expect(
      report.registryFilePaths.map((filePath) => path.relative(cwd, filePath))
    ).toEqual([
      "registry.json",
      path.join("components", "ui", "registry.json"),
      path.join("hooks", "registry.json"),
    ])
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        "Registry file contains invalid JSON.",
        "Registry file was not found or could not be read.",
      ])
    )
    expect(
      report.diagnostics.some((diagnostic) =>
        diagnostic.message.includes("input")
      )
    ).toBe(false)
  })

  it("reports remote and parent-traversing item file paths", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["components/ui/registry.json"],
      }),
      "components/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "https://example.com/button.tsx",
                type: "registry:ui",
              },
              {
                path: "../shared/button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    const report = await validateRegistry({
      cwd,
      registryFile: "registry.json",
    })

    expect(report.valid).toBe(false)
    expect(report.diagnostics.map((diagnostic) => diagnostic.message)).toEqual(
      expect.arrayContaining([
        'File path "https://example.com/button.tsx" cannot be remote.',
        'File path "../shared/button.tsx" cannot use parent-directory traversal.',
      ])
    )
  })
})

async function createFixture(files: Record<string, string>) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-validate-"))

  await Promise.all(
    Object.entries(files).map(async ([filePath, content]) => {
      const targetPath = path.join(cwd, filePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )

  return cwd
}

function cwdRoot() {
  return path.parse(process.cwd()).root
}

function getIncludeSegments(depth: number) {
  return Array.from({ length: depth }, (_, index) => `level-${index + 1}`)
}
