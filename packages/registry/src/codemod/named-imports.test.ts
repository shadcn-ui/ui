import { type types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { addNamedImport } from "./named-imports"
import { parseModule } from "./parse"

function addInter(code: string) {
  const declaration = parseModule(code).program.body[0] as t.ImportDeclaration
  return addNamedImport(code, declaration, "Inter")
}

describe("addNamedImport", () => {
  it("appends to the named imports", () => {
    expect(addInter(`import { Roboto, Lora } from "next/font/google"\n`))
      .toMatchInlineSnapshot(`
        "import { Roboto, Lora, Inter } from "next/font/google"
        "
      `)
  })

  it("keeps comments after the last named import in front of the new comma", () => {
    expect(addInter(`import { Roboto /* a */ } from "next/font/google"\n`))
      .toMatchInlineSnapshot(`
        "import { Roboto, /* a */ Inter } from "next/font/google"
        "
      `)
  })

  it("reuses a trailing comma, keeping the comments around it", () => {
    expect(
      addInter(`import { Roboto, /* a */ } from "next/font/google" // b\n`)
    ).toMatchInlineSnapshot(`
      "import { Roboto, /* a */ Inter } from "next/font/google" // b
      "
    `)
  })

  it("fills empty braces", () => {
    expect(addInter(`import {} from "next/font/google"\n`))
      .toMatchInlineSnapshot(`
        "import { Inter } from "next/font/google"
        "
      `)
    expect(addInter(`import Fonts, {} from "next/font/google"\n`))
      .toMatchInlineSnapshot(`
        "import Fonts, { Inter } from "next/font/google"
        "
      `)
  })

  it("adds braces after a default import", () => {
    expect(addInter(`import Fonts from "next/font/google"\n`))
      .toMatchInlineSnapshot(`
        "import Fonts, { Inter } from "next/font/google"
        "
      `)
  })

  it("adds an import clause to a side-effect import", () => {
    expect(addInter(`import "next/font/google"\n`)).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google"
      "
    `)
  })

  it("throws for a namespace import", () => {
    expect(() =>
      addInter(`import * as Fonts from "next/font/google"\n`)
    ).toThrow(
      "Cannot add a named import to an import declaration that has a namespace import."
    )
  })

  it("throws like ts-morph when the name would land in a line comment", () => {
    expect(() =>
      addInter(`import {\n  Roboto, // body\n} from "next/font/google"\n`)
    ).toThrow("Manipulation error: A syntax error was inserted.")
  })
})
