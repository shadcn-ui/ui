import { describe, expect, it } from "vitest"

import {
  getImportDeclarationSources,
  rewriteImportDeclarationSources,
} from "./import-declarations"

// The expected values are ts-morph's, for the same code parsed as TSX: its
// getImportDeclarations() and getModuleSpecifierValue(), then
// setModuleSpecifier() and getFullText().

function getSpecifiers(code: string) {
  return getImportDeclarationSources(code).map((source) => source.value)
}

function rewrite(code: string, values: Partial<Record<string, string>>) {
  return rewriteImportDeclarationSources(
    code,
    async (moduleSpecifier) => values[moduleSpecifier]
  )
}

describe("getImportDeclarationSources", () => {
  it("lists the top-level import declarations only", () => {
    expect(
      getSpecifiers(`"use client"

import a from "a"
import type { B } from 'b'
import "c"
import * as d from "d"
import k, { l } from "k" with { type: "json" }
export { e } from "e"
export * from "f"
import g = require("g")
const h = import("h")
declare module "m" {
  import i from "i"
}
function f() {
  return import("j")
}
`)
    ).toEqual(["a", "b", "c", "d", "k"])
  })

  it("finds the imports around a line Babel cannot parse", () => {
    expect(
      getSpecifiers(`import a from "a"
# Not code
import b from "b"
`)
    ).toEqual(["a", "b"])
    expect(
      getSpecifiers(`import a from "a"
const s = "oops
import b from "b"
`)
    ).toEqual(["a", "b"])
  })

  it("parses a type assertion that JSX cannot parse", () => {
    expect(
      getSpecifiers(`import a from "a"
const b = <string>a
`)
    ).toEqual(["a"])
  })

  it("leaves out an import inside an unclosed block", () => {
    expect(
      getSpecifiers(`import a from "a"
export function f() {
import b from "b"
`)
    ).toEqual(["a"])
  })
})

describe("rewriteImportDeclarationSources", () => {
  it("keeps each specifier's quotes", async () => {
    expect(
      await rewrite(`import { a } from "@/a"\nimport { b } from '@/b'\n`, {
        "@/a": "@/x/a",
        "@/b": "@/x/b",
      })
    ).toBe(`import { a } from "@/x/a"\nimport { b } from '@/x/b'\n`)
  })

  it("escapes the quote character and line breaks, not backslashes", async () => {
    expect(
      await rewrite(`import { a } from "@/a"\nimport { b } from '@/b'\n`, {
        "@/a": `@/it's "a"`,
        "@/b": `@/it's "b"\nnext`,
      })
    ).toBe(
      `import { a } from "@/it's \\"a\\""\nimport { b } from '@/it\\'s "b"\\\nnext'\n`
    )
  })

  it("rewrites only import declarations and keeps everything else", async () => {
    expect(
      await rewrite(
        `"use client"\r\n\r\n// Comment\r\nimport { a } from "@/a" // trailing\r\nimport data from "@/data.json" with { type: "json" };\r\nimport "@/side"\r\nexport { c } from "@/c"\r\n`,
        {
          "@/a": "@/components/a",
          "@/data.json": "@/lib/data.json",
          "@/side": "../side",
          "@/c": "@/x",
        }
      )
    ).toBe(
      `"use client"\r\n\r\n// Comment\r\nimport { a } from "@/components/a" // trailing\r\nimport data from "@/lib/data.json" with { type: "json" };\r\nimport "../side"\r\nexport { c } from "@/c"\r\n`
    )
  })

  it("rewrites the imports around a line Babel cannot parse", async () => {
    expect(
      await rewrite(`import a from "@/a"\n# Not code\nimport b from "@/b"\n`, {
        "@/a": "@/x",
        "@/b": "@/y",
      })
    ).toBe(`import a from "@/x"\n# Not code\nimport b from "@/y"\n`)
  })

  it("drops a byte order mark only when it rewrites", async () => {
    const code = `﻿import { a } from "@/a"\n`
    expect(await rewrite(code, { "@/a": "@/x" })).toBe(
      `import { a } from "@/x"\n`
    )
    expect(await rewrite(code, {})).toBe(code)
  })
})
