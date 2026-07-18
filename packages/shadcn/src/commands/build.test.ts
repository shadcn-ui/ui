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
})

async function createFixture(files: Record<string, string>) {
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
