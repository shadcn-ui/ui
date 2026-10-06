import { type types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { parseModule } from "./parse"
import { setInitializer } from "./variables"

function setInterInitializer(code: string) {
  const statement = parseModule(code).program.body[0] as t.VariableDeclaration
  return setInitializer(code, statement.declarations[0], "Inter()")
}

describe("setInitializer", () => {
  it("replaces the initializer", () => {
    expect(setInterInitializer(`const roboto = Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto = Inter()
        "
      `)
  })

  it("keeps the type annotation", () => {
    expect(setInterInitializer(`const roboto: NextFont = Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto: NextFont = Inter()
        "
      `)
  })

  it("adds spaces around the `=`", () => {
    expect(setInterInitializer(`const roboto=Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto = Inter()
        "
      `)
  })

  it("removes a comment before the `=` on the same line", () => {
    expect(setInterInitializer(`const roboto /* c */ = Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto = Inter()
        "
      `)
  })

  it("leaves the line break before an `=` on the next line", () => {
    expect(setInterInitializer(`const roboto\n  = Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto = Inter()

        "
      `)
    expect(setInterInitializer(`const roboto // c\n  = Roboto()\n`))
      .toMatchInlineSnapshot(`
        "const roboto = Inter() // c

        "
      `)
  })
})
