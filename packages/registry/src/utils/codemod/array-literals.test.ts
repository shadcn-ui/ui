import { types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { addElement, insertElement, removeElement } from "./array-literals"
import { parseModule } from "./parse"

// The outputs below are ts-morph's for the same edits.

function getArray(code: string) {
  const arrays: t.ArrayExpression[] = []
  t.traverseFast(parseModule(code), (node) => {
    if (node.type === "ArrayExpression") {
      arrays.push(node)
    }
  })
  return arrays.sort((a, b) => a.start! - b.start!)[0]
}

function insertX(code: string, index: number) {
  return insertElement(code, getArray(code), index, "x")
}

function addX(code: string) {
  return addElement(code, getArray(code), "x")
}

function remove(code: string, index: number) {
  return removeElement(code, getArray(code), index)
}

describe("insertElement", () => {
  it("inserts on the same line in a one-line array", () => {
    expect(insertX(`const c = [a, b]\n`, 1)).toMatchInlineSnapshot(`
      "const c = [a, x, b]
      "
    `)
    expect(insertX(`const c = [a, b]\n`, 0)).toMatchInlineSnapshot(`
      "const c = [x, a, b]
      "
    `)
  })

  it("inserts on its own line when every element is on its own line", () => {
    expect(insertX(`const c = [\n  a,\n  b,\n]\n`, 1)).toMatchInlineSnapshot(`
      "const c = [
        a,
          x,
          b,
      ]
      "
    `)
    expect(insertX(`const c = [\n  a, b,\n  c,\n]\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = [
          a, x, b,
          c,
        ]
        "
      `)
  })

  it("inserts on its own line when an array with one element spans lines", () => {
    expect(insertX(`const c = [\n  a,\n]\n`, 0)).toMatchInlineSnapshot(`
      "const c = [
          x,
          a,
      ]
      "
    `)
  })

  it("counts holes as elements", () => {
    expect(insertX(`const c = [a, , b]\n`, 1)).toMatchInlineSnapshot(`
      "const c = [a, x,  , b]
      "
    `)
  })

  it("keeps the JSDoc comments TypeScript attaches to the next element", () => {
    expect(insertX(`const c = [\n  a,\n  /** doc */ () => b,\n]\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = [
          a,
            x,
            /** doc */ () => b,
        ]
        "
      `)
    expect(insertX(`const c = [\n  a,\n  /** doc */\n  (b),\n]\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = [
          a,
            x,
            /** doc */
          (b),
        ]
        "
      `)
    // TypeScript attaches no JSDoc comment to an identifier, so the insertion
    // replaces it like any other comment before the element.
    expect(insertX(`const c = [\n  a,\n  /** doc */\n  b,\n]\n`, 1))
      .toMatchInlineSnapshot(`
        "const c = [
          a,
            x,
            b,
        ]
        "
      `)
  })
})

describe("addElement", () => {
  it("adds the element after the last one", () => {
    expect(addX(`const c = []\n`)).toMatchInlineSnapshot(`
      "const c = [x]
      "
    `)
    expect(addX(`const c = [a]\n`)).toMatchInlineSnapshot(`
      "const c = [a, x]
      "
    `)
    expect(addX(`const c = [a,]\n`)).toMatchInlineSnapshot(`
      "const c = [a, x]
      "
    `)
  })

  it("adds the element on its own line to an array that spans lines", () => {
    expect(addX(`const c = [\n  a,\n]\n`)).toMatchInlineSnapshot(`
      "const c = [
        a,
          x
      ]
      "
    `)
    expect(addX(`const c = [\n  a\n]\n`)).toMatchInlineSnapshot(`
      "const c = [
        a,
          x
      ]
      "
    `)
    expect(addX(`const c = [\n]\n`)).toMatchInlineSnapshot(`
      "const c = [
          x
      ]
      "
    `)
  })

  it("keeps the comments after the last element in front of it", () => {
    expect(addX(`const c = [a /* one */]\n`)).toMatchInlineSnapshot(`
      "const c = [a, /* one */ x]
      "
    `)
    expect(addX(`const c = [a, // one\n]\n`)).toMatchInlineSnapshot(`
      "const c = [a, // one
          x
      ]
      "
    `)
    expect(addX(`const c = [\n  a // one\n]\n`)).toMatchInlineSnapshot(`
      "const c = [
        a, // one
          x
      ]
      "
    `)
  })
})

describe("removeElement", () => {
  it("removes the element with its comma and the spaces after it", () => {
    expect(remove(`const c = [a, b, c]\n`, 0)).toMatchInlineSnapshot(`
      "const c = [b, c]
      "
    `)
    expect(remove(`const c = [a, b, c]\n`, 1)).toMatchInlineSnapshot(`
      "const c = [a, c]
      "
    `)
  })

  it("removes the comma before the last element", () => {
    expect(remove(`const c = [a, b, c]\n`, 2)).toMatchInlineSnapshot(`
      "const c = [a, b]
      "
    `)
    expect(remove(`const c = [a, b, c,]\n`, 2)).toMatchInlineSnapshot(`
      "const c = [a, b]
      "
    `)
    expect(remove(`const c = [\n  a,\n\n  b,\n]\n`, 1)).toMatchInlineSnapshot(`
      "const c = [
        a
      ]
      "
    `)
  })

  it("removes the only element", () => {
    expect(remove(`const c = [a]\n`, 0)).toMatchInlineSnapshot(`
      "const c = []
      "
    `)
    expect(remove(`const c = [\n  a,\n]\n`, 0)).toMatchInlineSnapshot(`
      "const c = [
      ]
      "
    `)
  })
})
