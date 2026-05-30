import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { describe, expect, it } from "vitest"

import { normalizeAddComponents } from "./add"

describe("normalizeAddComponents", () => {
  it("removes shell-expanded files and directories from component arguments", async () => {
    const cwd = await createFixture({
      "app/file.tsx": "",
      "package.json": "{}",
      "button.json": '{"name":"button"}',
    })

    await fs.mkdir(path.join(cwd, "button"))
    const result = normalizeAddComponents(
      ["app", "package.json", "button", "button.json"],
      cwd
    )

    expect(result).toEqual([])
  })

  it("keeps valid registry item names and urls", async () => {
    const cwd = await createFixture({})

    const result = normalizeAddComponents(
      [
        "button",
        "@ui/button",
        "https://ui.shadcn.com/r/styles/new-york-v4/card.json",
      ],
      cwd
    )

    expect(result).toEqual([
      "button",
      "@ui/button",
      "https://ui.shadcn.com/r/styles/new-york-v4/card.json",
    ])
  })

  it("removes wildcard tokens", async () => {
    const cwd = await createFixture({})

    const result = normalizeAddComponents(["*", "button"], cwd)

    expect(result).toEqual(["button"])
  })

  it("keeps local json component files even when they exist", async () => {
    const cwd = await createFixture({
      "registry/custom.json": '{"name":"custom"}',
    })

    const result = normalizeAddComponents(
      ["./registry/custom.json", "button"],
      cwd
    )

    expect(result).toEqual(["./registry/custom.json", "button"])
  })
})

async function createFixture(files: Record<string, string>) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-add-"))

  await Promise.all(
    Object.entries(files).map(async ([filePath, content]) => {
      const targetPath = path.join(cwd, filePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )

  return cwd
}
