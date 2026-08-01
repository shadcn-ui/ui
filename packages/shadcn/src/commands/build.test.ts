import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { describe, expect, it, vi } from "vitest"

import { build } from "./build"

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn((error) => {
    throw error
  }),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: () => ({
    start: vi.fn(),
    succeed: vi.fn(),
  }),
}))

describe("build command", () => {
  it("writes flattened registries for source registries that use include", async () => {
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
                path: "button.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
      "components/ui/button.tsx": "export function Button() {}",
    })

    await build.parseAsync(
      ["node", "shadcn", "registry.json", "--cwd", cwd, "--output", "public/r"],
      { from: "node" }
    )

    const outputDir = path.join(cwd, "public/r")
    const registry = JSON.parse(
      await fs.readFile(path.join(outputDir, "registry.json"), "utf-8")
    )
    const button = JSON.parse(
      await fs.readFile(path.join(outputDir, "button.json"), "utf-8")
    )

    expect(registry).toMatchObject({
      name: "example",
      homepage: "https://example.com",
      items: [
        {
          name: "button",
          files: [
            {
              path: "components/ui/button.tsx",
            },
          ],
        },
      ],
    })
    expect(registry).not.toHaveProperty("include")
    expect(registry.items[0].files[0]).not.toHaveProperty("content")
    expect(button).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "button",
      files: [
        {
          path: "components/ui/button.tsx",
          content: "export function Button() {}",
        },
      ],
    })
  })

  it("base64-encodes binary registry files", async () => {
    const font = Buffer.from([0x77, 0x4f, 0x46, 0x32, 0x00, 0xff, 0x80, 0x01])
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "font",
            type: "registry:item",
            files: [
              {
                path: "font.woff2",
                type: "registry:file",
                target: "public/font.woff2",
              },
            ],
          },
        ],
      }),
      "font.woff2": font,
    })

    await build.parseAsync(
      ["node", "shadcn", "registry.json", "--cwd", cwd, "--output", "public/r"],
      { from: "node" }
    )

    const item = JSON.parse(
      await fs.readFile(path.join(cwd, "public/r/font.json"), "utf-8")
    )

    expect(item.files[0]).toEqual({
      path: "font.woff2",
      content: font.toString("base64"),
      encoding: "base64",
      type: "registry:file",
      target: "public/font.woff2",
    })
  })

  it("creates nested output directories for item names with path segments", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [
          {
            name: "extension/foo",
            type: "registry:item",
            files: [
              {
                path: "registry/extensions/foo.tsx",
                type: "registry:file",
                target: "extensions/foo.tsx",
              },
            ],
          },
        ],
      }),
      "registry/extensions/foo.tsx": "export function Foo() {}",
    })

    await build.parseAsync(
      ["node", "shadcn", "registry.json", "--cwd", cwd, "--output", "public/r"],
      { from: "node" }
    )

    const item = JSON.parse(
      await fs.readFile(path.join(cwd, "public/r/extension/foo.json"), "utf-8")
    )

    expect(item).toMatchObject({
      name: "extension/foo",
      files: [
        {
          path: "registry/extensions/foo.tsx",
          content: "export function Foo() {}",
        },
      ],
    })
  })
})

async function createFixture(files: Record<string, string | Buffer>) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-build-"))

  await Promise.all(
    Object.entries(files).map(async ([filePath, content]) => {
      const targetPath = path.join(cwd, filePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )

  return cwd
}
