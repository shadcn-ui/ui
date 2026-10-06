import { types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { SyntaxErrorInsertedError } from "./edits"
import {
  addPropertyAssignment,
  getProperty,
  getPropertyName,
  insertPropertyAssignment,
  insertSpreadAssignment,
  removeProperty,
} from "./object-literals"
import { parseModule } from "./parse"

// The outputs below are ts-morph's for the same edits.

function getObject(code: string) {
  const objects: t.ObjectExpression[] = []
  t.traverseFast(parseModule(code), (node) => {
    if (node.type === "ObjectExpression") {
      objects.push(node)
    }
  })
  return objects.sort((a, b) => a.start! - b.start!)[0]
}

function insertA(code: string, index: number) {
  return insertPropertyAssignment(code, getObject(code), index, "a", "1", {})
}

function addA(code: string, initializer = "1") {
  return addPropertyAssignment(code, getObject(code), "a", initializer, {})
}

function remove(code: string, index: number) {
  const object = getObject(code)
  return removeProperty(code, object, object.properties[index], {})
}

describe("insertPropertyAssignment", () => {
  it("writes the property on its own line, at the object's child indentation", () => {
    expect(insertA(`const c = {\n  b: 2,\n  c: 3,\n}\n`, 0))
      .toMatchInlineSnapshot(`
        "const c = {
            a: 1,
            b: 2,
          c: 3,
        }
        "
      `)
    expect(insertA(`const c = {\n  b: 2,\n  c: 3,\n}\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = {
          b: 2,
            a: 1,
            c: 3,
        }
        "
      `)
  })

  it("breaks a one-line object", () => {
    expect(insertA(`const c = { b: 2 }\n`, 0)).toMatchInlineSnapshot(`
      "const c = {
          a: 1,
          b: 2 }
      "
    `)
  })

  it("counts comment nodes in the index", () => {
    expect(insertA(`const c = {\n  // first\n  b: 2,\n}\n`, 0))
      .toMatchInlineSnapshot(`
        "const c = {
            a: 1,
            // first
          b: 2,
        }
        "
      `)
    expect(insertA(`const c = {\n  // first\n  b: 2,\n}\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = {
          // first
            a: 1,
            b: 2,
        }
        "
      `)
  })

  it("keeps a JSDoc comment with the property after it", () => {
    expect(insertA(`const c = {\n  /** doc */\n  b: 2,\n}\n`, 0))
      .toMatchInlineSnapshot(`
        "const c = {
            a: 1,
            /** doc */
          b: 2,
        }
        "
      `)
  })

  it("keeps every JSDoc comment with the property after them", () => {
    expect(
      insertA(
        `const c = {\n  b: 2,\n  /** one */\n  /** two */\n  c: 3\n}\n`,
        1
      )
    ).toMatchInlineSnapshot(`
      "const c = {
        b: 2,
          a: 1,
          /** one */
        /** two */
        c: 3
      }
      "
    `)
  })

  it("keeps a trailing comment with the property before it", () => {
    expect(insertA(`const c = {\n  b: 2, // two\n  c: 3,\n}\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = {
          b: 2, // two
            a: 1,
            c: 3,
        }
        "
      `)
  })
})

describe("addPropertyAssignment", () => {
  it("adds the property after the last one, with a comma", () => {
    expect(addA(`const c = {\n  b: 2,\n}\n`)).toMatchInlineSnapshot(`
      "const c = {
        b: 2,
          a: 1
      }
      "
    `)
    expect(addA(`const c = {\n  b: 2\n}\n`)).toMatchInlineSnapshot(`
      "const c = {
        b: 2,
          a: 1
      }
      "
    `)
    expect(addA(`const c = { b: 2 }\n`)).toMatchInlineSnapshot(`
      "const c = { b: 2,
          a: 1
      }
      "
    `)
  })

  it("adds the property to an empty object", () => {
    expect(addA(`const c = {}\n`)).toMatchInlineSnapshot(`
      "const c = {
          a: 1
      }
      "
    `)
  })

  it("indents the other lines of the initializer one more level", () => {
    expect(addA(`const c = {\n  b: 2,\n}\n`, `{\n  x: 1,\n}`))
      .toMatchInlineSnapshot(`
        "const c = {
          b: 2,
            a: {
                  x: 1,
                }
        }
        "
      `)
  })

  it("indents with four spaces per level of the object's indentation", () => {
    expect(addA(`  const c = {\n    b: 2,\n  }\n`)).toMatchInlineSnapshot(`
      "  const c = {
          b: 2,
            a: 1
      }
      "
    `)
    expect(addA(`const c = {\n\tb: 2,\n}\n`)).toMatchInlineSnapshot(`
      "const c = {
      	b: 2,
          a: 1
      }
      "
    `)
  })

  it("keeps the comments after the last property in front of it", () => {
    expect(addA(`const c = {\n  b: 2, // two\n}\n`)).toMatchInlineSnapshot(`
      "const c = {
        b: 2, // two
          a: 1
      }
      "
    `)
    expect(addA(`const c = {\n  b: 2\n  // c: 3\n}\n`)).toMatchInlineSnapshot(`
      "const c = {
        b: 2,
        // c: 3
          a: 1
      }
      "
    `)
    expect(addA(`const c = {\n  b: 2\n  /* c */ // d\n}\n`))
      .toMatchInlineSnapshot(`
        "const c = {
          b: 2,
          /* c */ // d
            a: 1
        }
        "
      `)
  })

  it("throws after a comment node that follows a comma, where ts-morph wrote a second comma", () => {
    // ts-morph copies the text from the last property's end through the
    // comment, comma included, after a new comma: `b: 2,,`.
    expect(() => addA(`const c = {\n  b: 2,\n  // c: 3,\n}\n`)).toThrow(
      SyntaxErrorInsertedError
    )
    // A comment before the closing brace is a comment node too.
    expect(() => addA(`const c = {\n  b: 2,\n  /* c */ }\n`)).toThrow(
      SyntaxErrorInsertedError
    )
  })

  it("throws after an empty /**/ comment node, as ts-morph did", () => {
    // Like ts-morph, the comment node parser looks for the end of a JSDoc
    // comment after "/**", so this one runs to the end of the code.
    expect(() => addA(`const c = {\n  b: 2\n  /**/\n}\n`)).toThrow(
      SyntaxErrorInsertedError
    )
  })
})

describe("insertSpreadAssignment", () => {
  it("inserts the spread like a property", () => {
    const code = `const c = {\n  b: 2,\n}\n`
    expect(insertSpreadAssignment(code, getObject(code), 0, "b", {}))
      .toMatchInlineSnapshot(`
        "const c = {
            ...b,
            b: 2,
        }
        "
      `)
    expect(insertSpreadAssignment(code, getObject(code), 1, "b", {}))
      .toMatchInlineSnapshot(`
        "const c = {
          b: 2,
            ...b
        }
        "
      `)
  })
})

describe("removeProperty", () => {
  const code = `const c = {\n  a: 1,\n  b: 2,\n  c: 3,\n}\n`

  it.each([
    // b: 2 is commented out.
    `const c = {\n  // c\n  a: 1, b: 2\n}\n`,
    // b becomes a shorthand property.
    `const c = {\n  // c\n  a: 1, ...\n  b\n}\n`,
  ])(
    "throws when the rest of the line goes onto a comment's, which ts-morph rejected: %j",
    (code) => {
      expect(() => remove(code, 0)).toThrow(SyntaxErrorInsertedError)
    }
  )

  it("removes the property with its comma and the line break before it", () => {
    expect(remove(code, 0)).toMatchInlineSnapshot(`
      "const c = {
        b: 2,
        c: 3,
      }
      "
    `)
    expect(remove(code, 1)).toMatchInlineSnapshot(`
      "const c = {
        a: 1,
        c: 3,
      }
      "
    `)
  })

  it("removes the comma before the last property", () => {
    expect(remove(code, 2)).toMatchInlineSnapshot(`
      "const c = {
        a: 1,
        b: 2
      }
      "
    `)
    expect(remove(`const c = { a: 1, b: 2 }\n`, 1)).toMatchInlineSnapshot(`
      "const c = { a: 1 }
      "
    `)
  })

  it("removes the only property", () => {
    expect(remove(`const c = {\n  a: 1,\n}\n`, 0)).toMatchInlineSnapshot(`
      "const c = {
      }
      "
    `)
    expect(remove(`const c = { a: 1 }\n`, 0)).toMatchInlineSnapshot(`
      "const c = { }
      "
    `)
  })

  it("removes the comments after the previous comma, but not comment nodes", () => {
    expect(remove(`const c = {\n  a: 1, // one\n  b: 2,\n}\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = {
          a: 1
        }
        "
      `)
    expect(remove(`const c = {\n  a: 1,\n  // two\n  b: 2,\n}\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = {
          a: 1,
          // two
        }
        "
      `)
  })
})

describe("getPropertyName", () => {
  it("is the key's text, with the brackets of a computed key", () => {
    const code = `const c = { a: 1, "b": 2, 3: 3, [d]: 4, async [ e ]() {}, ...f, g }\n`
    expect(
      getObject(code).properties.map((member) => getPropertyName(code, member))
    ).toEqual(["a", `"b"`, "3", "[d]", "[ e ]", undefined, "g"])
  })
})

describe("getProperty", () => {
  it("finds shorthand properties and methods, but not quoted names", () => {
    const code = `const c = { "a": 1, a, b() {}, get c() { return 1 } }\n`
    const object = getObject(code)
    expect(getProperty(code, object, "a")).toBe(object.properties[1])
    expect(getProperty(code, object, "b")).toBe(object.properties[2])
    expect(getProperty(code, object, "c")).toBe(object.properties[3])
    expect(getProperty(code, object, "d")).toBeUndefined()
  })
})
