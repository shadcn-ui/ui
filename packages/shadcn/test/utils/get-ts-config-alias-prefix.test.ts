import { tmpdir } from "os"
import path from "path"
import fs from "fs-extra"
import { describe, expect, test } from "vitest"

import { getTsConfigAliasPrefix } from "../../src/utils/get-project-info"

describe("get ts config alias prefix", async () => {
  test.each([
    {
      name: "next-app",
      prefix: "@",
    },
    {
      name: "next-app-src",
      prefix: "#",
    },
    {
      name: "next-pages",
      prefix: "~",
    },
    {
      name: "next-pages-src",
      prefix: "@",
    },
    {
      name: "t3-app",
      prefix: "~",
    },
    {
      name: "next-app-custom-alias",
      prefix: "@custom-alias",
    },
    {
      name: "vite-partial-imports",
      prefix: "#components",
    },
    {
      name: "vite-root-paths",
      prefix: "@",
    },
  ])(`getTsConfigAliasPrefix($name) -> $prefix`, async ({ name, prefix }) => {
    expect(
      await getTsConfigAliasPrefix(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toBe(prefix)
  })

  test("parses JSONC tsconfig files with trailing commas", async () => {
    const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-jsonc-tsconfig-"))

    try {
      await fs.writeFile(
        path.join(cwd, "tsconfig.json"),
        `{
          // This mirrors the JSONC shape emitted by common TS templates.
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"], // trailing comments are valid JSONC.
            },
          },
        }
        `,
        "utf8"
      )

      expect(await getTsConfigAliasPrefix(cwd)).toBe("@")
    } finally {
      await fs.remove(cwd)
    }
  })
})
