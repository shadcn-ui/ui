import { describe, expect, it } from "vitest"

import { applyEdits } from "./edits"
import { getReplacementText } from "./indentation"

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
