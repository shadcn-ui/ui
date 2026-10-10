import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import * as importDeclarations from "@/src/codemod/import-declarations"
import { getConfig } from "@/src/get-config"
import { getProjectInfo } from "@/src/get-project-info"
import * as transformers from "@/src/transformers"
import { updateFiles } from "@/src/updaters/update-files"
import prompts from "prompts"
import { afterEach, describe, expect, it, vi } from "vitest"

import { loadRegistryItem } from "./loader"
import { registryItemFileSchema, registryItemSchema } from "./schema"

vi.mock("@/src/registry/api", () => ({
  getRegistryBaseColor: vi.fn().mockResolvedValue(undefined),
}))
vi.mock("prompts", () => ({ default: vi.fn() }))

const directories: string[] = []
const font = Buffer.from([0x77, 0x4f, 0x46, 0x32, 0, 0xff, 0x80, 1])

afterEach(async () => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  for (const cwd of directories.splice(0)) {
    await fs.rm(cwd, { recursive: true, force: true })
  }
})

async function fixture(files: Record<string, string | Buffer> = {}) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-binary-"))
  directories.push(cwd)
  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(cwd, name)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content)
  }
  return cwd
}

async function app() {
  const cwd = await fixture({
    "package.json": JSON.stringify({ dependencies: { tailwindcss: "4.0.0" } }),
    "vite.config.ts": "export default {}",
    "src/index.css": '@import "tailwindcss";',
    "tsconfig.json": JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    }),
    "components.json": JSON.stringify({
      style: "new-york",
      rsc: false,
      tsx: true,
      tailwind: { config: "", css: "src/index.css", baseColor: "neutral" },
      aliases: { components: "@/components", utils: "@/lib/utils" },
    }),
  })
  const config = await getConfig(cwd)
  if (!config) throw new Error("Fixture configuration did not load")
  expect(await getProjectInfo(cwd)).not.toBeNull()
  return { cwd, config }
}

function binaryFile(target: string, content = font) {
  return {
    path: path.basename(target),
    type: "registry:file" as const,
    target: `~/${target}`,
    content: content.toString("base64"),
    encoding: "base64" as const,
  }
}

describe("binary registry file round trips", () => {
  it.each([
    ["woff2", font],
    ["woff", Buffer.from([0x77, 0x4f, 0x46, 0x46, 0, 0xfe])],
    ["null byte", Buffer.from([0x61, 0, 0x62])],
    ["invalid UTF-8 without null", Buffer.from([0xff, 0x80, 0x61])],
  ])("preserves %s through loading and JSON", async (_, bytes) => {
    const cwd = await fixture({
      "registry.json": JSON.stringify({
        name: "fonts",
        homepage: "https://example.com",
        items: [
          {
            name: "font",
            type: "registry:theme",
            files: [binaryFile("font.woff2")],
          },
        ],
      }),
      "font.woff2": bytes,
    })
    const item = registryItemSchema.parse(
      JSON.parse(JSON.stringify(await loadRegistryItem("font", { cwd })))
    )
    expect(item.files?.[0]).toMatchObject({ encoding: "base64" })
    expect(Buffer.from(item.files![0].content!, "base64")).toEqual(bytes)
  })

  it.each(["hello café 世界", ""])(
    "keeps text content %j unencoded",
    async (content) => {
      const cwd = await fixture({
        "registry.json": JSON.stringify({
          name: "text",
          homepage: "https://example.com",
          items: [
            {
              name: "text",
              type: "registry:item",
              files: [
                {
                  path: "note.txt",
                  type: "registry:file",
                  target: "~/note.txt",
                },
              ],
            },
          ],
        }),
        "note.txt": content,
      })
      const item = await loadRegistryItem("text", { cwd })
      expect(item.files![0].content).toBe(content)
      expect(item.files![0]).not.toHaveProperty("encoding")
    }
  )

  it("loads a binary file beside text through a nested include", async () => {
    const cwd = await fixture({
      "registry.json": JSON.stringify({
        name: "fonts",
        homepage: "https://example.com",
        include: ["nested/registry.json"],
      }),
      "nested/registry.json": JSON.stringify({
        items: [
          {
            name: "font",
            type: "registry:theme",
            files: [
              {
                path: "font.woff2",
                type: "registry:file",
                target: "~/font.woff2",
              },
              { path: "font.css", type: "registry:file", target: "~/font.css" },
            ],
          },
        ],
      }),
      "nested/font.woff2": font,
      "nested/font.css": "body { font-family: custom; }",
    })
    const item = await loadRegistryItem("font", { cwd })
    expect(item.files![0]).toMatchObject({
      path: "nested/font.woff2",
      encoding: "base64",
    })
    expect(Buffer.from(item.files![0].content!, "base64")).toEqual(font)
    expect(item.files![1].content).toBe("body { font-family: custom; }")
    expect(item.files![1]).not.toHaveProperty("encoding")
  })

  it.each(["asset.woff2", "asset.ts", ".env"])(
    "creates, skips and replaces %s byte-for-byte",
    async (target) => {
      const { cwd, config } = await app()
      const rewrite = vi.spyOn(
        importDeclarations,
        "rewriteImportDeclarationSources"
      )
      const options = { silent: true, overwrite: true }
      const first = await updateFiles([binaryFile(target)], config, options)
      expect(first).toEqual({
        filesCreated: [target],
        filesUpdated: [],
        filesSkipped: [],
      })
      expect(await fs.readFile(path.join(cwd, target))).toEqual(font)
      const second = await updateFiles([binaryFile(target)], config, options)
      expect(second).toEqual({
        filesCreated: [],
        filesUpdated: [],
        filesSkipped: [target],
      })
      const replacement = Buffer.concat([font, Buffer.from([0xfe])])
      const third = await updateFiles(
        [binaryFile(target, replacement)],
        config,
        options
      )
      expect(third).toEqual({
        filesCreated: [],
        filesUpdated: [target],
        filesSkipped: [],
      })
      expect(await fs.readFile(path.join(cwd, target))).toEqual(replacement)
      expect(rewrite).not.toHaveBeenCalled()
      expect(prompts).not.toHaveBeenCalled()
    }
  )

  it.each([true, false])(
    "does not parse a skipped binary file (interactive=%s)",
    async (interactive) => {
      const { cwd, config } = await app()
      const target = "asset.ts"
      const existing = Buffer.concat([
        Buffer.from('import { cn } from "@/lib/utils.ts"\n// '),
        Buffer.from([0xff]),
      ])
      await fs.mkdir(path.join(cwd, "src/lib"), { recursive: true })
      await fs.writeFile(
        path.join(cwd, "src/lib/utils.ts"),
        "export const cn = 1"
      )
      await fs.writeFile(path.join(cwd, target), existing)
      vi.mocked(prompts).mockResolvedValue({ overwrite: false })
      const rewrite = vi.spyOn(
        importDeclarations,
        "rewriteImportDeclarationSources"
      )
      const result = await updateFiles(
        [binaryFile(target, Buffer.from([0xff]))],
        config,
        { silent: true, interactive }
      )
      expect(await fs.readFile(path.join(cwd, target))).toEqual(existing)
      expect(result).toEqual({
        filesCreated: [],
        filesUpdated: [],
        filesSkipped: [target],
      })
      expect(prompts).toHaveBeenCalledTimes(interactive ? 1 : 0)
      expect(rewrite).not.toHaveBeenCalled()
    }
  )

  it.each(["registry:page", "registry:ui"] as const)(
    "bypasses the initial text transform for %s",
    async (type) => {
      const { cwd, config } = await app()
      const transform = vi.spyOn(transformers, "transform")
      const rewrite = vi.spyOn(
        importDeclarations,
        "rewriteImportDeclarationSources"
      )
      await updateFiles([{ ...binaryFile("asset.ts"), type }], config, {
        silent: true,
      })
      expect(await fs.readFile(path.join(cwd, "asset.ts"))).toEqual(font)
      expect(transform).not.toHaveBeenCalled()
      expect(rewrite).not.toHaveBeenCalled()
    }
  )

  it("still merges ordinary text environment variables", async () => {
    const { cwd, config } = await app()
    await fs.writeFile(path.join(cwd, ".env"), "EXISTING=kept\n")
    await updateFiles(
      [
        {
          path: ".env",
          target: "~/.env",
          type: "registry:file",
          content: "EXISTING=changed\nNEW=added\n",
        },
      ],
      config,
      { silent: true }
    )
    expect(await fs.readFile(path.join(cwd, ".env"), "utf8")).toBe(
      "EXISTING=kept\n\nNEW=added\n"
    )
  })

  it("preserves the directory-target error", async () => {
    const { cwd, config } = await app()
    await fs.mkdir(path.join(cwd, "asset.woff2"))
    await expect(
      updateFiles([binaryFile("asset.woff2")], config, { silent: true })
    ).rejects.toThrow("path exists and is a directory")
  })

  it.each(["registry:file", "registry:page", "registry:ui"])(
    "retains encoding and rejects unknown encoding for %s",
    (type) => {
      const file = { ...binaryFile("asset.woff2"), type }
      expect(registryItemFileSchema.parse(file)).toEqual(file)
      expect(
        registryItemFileSchema.safeParse({ ...file, encoding: "hex" }).success
      ).toBe(false)
    }
  )
})
