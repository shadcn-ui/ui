import { type types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { applyEdits, replaceWithText } from "./edits"
import { getIndentationLevel, getReplacementText } from "./indentation"
import { parseModule } from "./parse"

const CLASS_NAME = `{cn(
  "a",
  inter.variable
)}`

// Replaces the className string, like ts-morph's Node#replaceWithText.
function replaceClassName(code: string) {
  const start = code.indexOf(`"a"`)
  return applyEdits(code, [
    {
      start,
      end: start + `"a"`.length,
      text: getReplacementText(code, start, CLASS_NAME),
    },
  ])
}

describe("getReplacementText", () => {
  it("indents the lines after the first to the attribute", () => {
    expect(
      replaceClassName(`export default function L() {
  return <html className="a"></html>
}
`)
    ).toMatchInlineSnapshot(`
      "export default function L() {
        return <html className={cn(
          "a",
          inter.variable
        )}></html>
      }
      "
    `)
  })

  it("indents an attribute in nested JSX children", () => {
    expect(
      replaceClassName(`export default function L() {
  return (
    <div>
      <html className="a">
        <body />
      </html>
    </div>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export default function L() {
        return (
          <div>
            <html className={cn(
                  "a",
                  inter.variable
                )}>
              <body />
            </html>
          </div>
        )
      }
      "
    `)
  })

  it("indents an attribute on its own line", () => {
    expect(
      replaceClassName(`export default function L() {
  return (
    <html
      lang="en"
      className="a"
    >
      <body />
    </html>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export default function L() {
        return (
          <html
            lang="en"
            className={cn(
                  "a",
                  inter.variable
                )}
          >
            <body />
          </html>
        )
      }
      "
    `)
  })
})

// The indentation TypeScript's language service gives at the first match of
// search, in columns.
function getIndentationAt(code: string, search: string) {
  return getIndentationLevel(code, code.indexOf(search)) * 4
}

describe("getIndentationLevel", () => {
  it("indents an object literal like a block, to the line of its brace", () => {
    expect(getIndentationAt(`  export default { x: 1 }\n`, "{")).toBe(2)
    expect(getIndentationAt(`const a =\n     {\n  b: 1 }\n`, "{")).toBe(5)
    expect(
      getIndentationAt(`const a = {\n  b: {\n    c: 1,\n  },\n}\n`, "{\n    c")
    ).toBe(2)
  })

  it("indents an array literal for its context", () => {
    const code = `const a = {\n  b: [1, 2],\n  c: [\n    [3],\n  ],\n}\n`
    expect(getIndentationAt(code, "[1")).toBe(4)
    expect(getIndentationAt(code, "[3")).toBe(6)
    expect(getIndentationAt(`foo({\n  a: 1,\n}, [\n  2,\n])\n`, "[")).toBe(4)
  })

  it("counts a tab as four columns", () => {
    const code = `module.exports = {\n\ttheme: {\n\t\textend: {},\n\t},\n}\n`
    expect(getIndentationAt(code, "{\n\t\t")).toBe(4)
    expect(getIndentationAt(code, "{},")).toBe(8)
  })
})

describe("replaceWithText", () => {
  it("indents the lines after the first to the node's line", () => {
    const code = `const a = {\n  theme: { extend: {} },\n}\n`
    const theme = parseModule(code).program.body[0] as t.VariableDeclaration
    const config = theme.declarations[0].init as t.ObjectExpression
    const themeProperty = config.properties[0] as t.ObjectProperty

    expect(
      replaceWithText(
        code,
        themeProperty.value,
        `{\n\textend: {\n\t\tcolors: {}\n\t}\n}`,
        {}
      )
    ).toMatchInlineSnapshot(`
      "const a = {
        theme: {
        \textend: {
        \t\tcolors: {}
        \t}
        },
      }
      "
    `)
  })
})
