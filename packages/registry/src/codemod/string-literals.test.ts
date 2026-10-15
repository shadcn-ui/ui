import { describe, expect, it } from "vitest"

import { getText, parseModule } from "./parse"
import { StringLiterals } from "./string-literals"

// The expected values are ts-morph's, for the same code: its
// getDescendantsOfKind(), getLiteralValue() and setLiteralValue().

function getLiterals(code: string) {
  return new StringLiterals(code, parseModule(code))
}

// The first string or template literal of code.
function getFirstLiteral(literals: StringLiterals) {
  return [...literals.getStringLiterals(), ...literals.getTemplateLiterals()][0]
}

describe("StringLiterals", () => {
  const code = `"use client"
import a from "a"
export { b } from 'b'
const o = { "key": "value", ['computed']: 1 }
type T = "type" | \`type-template\`
enum E { "member" = 1 }
const t = \`template\`
const s = \`sub\${"inner"}\`
const tagged = tag\`tagged\`
const el = <div className="attr" title={"expr"} />
function f() {
  "use strict"
}
`

  it("lists the string literals in source order, directives included", () => {
    const literals = getLiterals(code)
    expect(
      literals.getStringLiterals().map((literal) => getText(code, literal))
    ).toEqual([
      `"use client"`,
      `"a"`,
      `'b'`,
      `"key"`,
      `"value"`,
      `'computed'`,
      `"type"`,
      `"member"`,
      `"inner"`,
      `"attr"`,
      `"expr"`,
      `"use strict"`,
    ])
  })

  it("lists the templates without substitutions in source order", () => {
    const literals = getLiterals(code)
    expect(
      literals.getTemplateLiterals().map((literal) => getText(code, literal))
    ).toEqual(["`type-template`", "`template`", "`tagged`"])
  })

  it("lists the literals inside a node", () => {
    const callCode = 'a("x", b("y"), `z`)\nc("w")'
    const file = parseModule(callCode)
    const call = file.program.body[0]
    const literals = new StringLiterals(callCode, file)
    expect(
      literals.getStringLiterals(call).map((node) => getText(callCode, node))
    ).toEqual([`"x"`, `"y"`])
    expect(
      literals.getTemplateLiterals(call).map((node) => getText(callCode, node))
    ).toEqual(["`z`"])
  })

  it.each([
    [`x = "a\\"b"`, `a"b`],
    [`x = 'it\\'s'`, "it's"],
    [`x = "a\\\nb"`, "ab"],
    [`x = "\\u0062g"`, "bg"],
    [`"use \\x41"`, "use A"],
    // TypeScript keeps a JSX attribute string as written.
    [`x = <a b="&amp;\\n" />`, "&amp;\\n"],
    ["x = `a\\nb`", "a\nb"],
    ["x = `a\r\nb`", "a\nb"],
    ["x = `a\\x`", "a\\x"],
  ])("reads the value of %j", (code, value) => {
    const literals = getLiterals(code)
    expect(literals.getValue(getFirstLiteral(literals))).toBe(value)
  })

  it.each([
    [`x = "a"`, `say "hi"`, `x = "say \\"hi\\""`],
    [`x = 'a'`, `it's "x"`, `x = 'it\\'s "x"'`],
    [`x = "a"`, "a\nb", `x = "a\\\nb"`],
    [`x = "a"`, "a\r\nb", `x = "a\\\r\nb"`],
    [`x = "a"`, "a\\b", `x = "a\\b"`],
    ["x = `a`", "a\nb`c", "x = `a\nb`c`"],
    [`x = <a b="a" />`, `c"d`, `x = <a b="c\\"d" />`],
    [`x = <a b='a' />`, "c\nd", `x = <a b='c\\\nd' />`],
    [`"use client"`, "use 'x'", `"use 'x'"`],
  ])("sets the value of %j to %j", (code, value, expected) => {
    const literals = getLiterals(code)
    literals.setValue(getFirstLiteral(literals), value)
    expect(literals.apply()).toBe(expected)
  })

  it.each([
    [`x = "a"`, "\\x41", "A"],
    [`x = <a b="a" />`, "\\x41", "\\x41"],
    ["x = `a`", "\\x41", "A"],
    [`x = "a"`, "a\nb", "ab"],
  ])(
    "reads what TypeScript parses from %j after setting %j",
    (code, value, readBack) => {
      const literals = getLiterals(code)
      const literal = getFirstLiteral(literals)
      literals.setValue(literal, value)
      expect(literals.getValue(literal)).toBe(readBack)
    }
  )

  it("keeps the last value set", () => {
    const literals = getLiterals(`x = "a"`)
    const literal = getFirstLiteral(literals)
    literals.setValue(literal, "b")
    literals.setValue(literal, "c")
    expect(literals.apply()).toBe(`x = "c"`)
  })
})
