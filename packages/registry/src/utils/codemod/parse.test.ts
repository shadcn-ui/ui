import { types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import {
  addsSyntaxErrors,
  countSyntaxErrors,
  countSyntaxErrorsExceptSkippedCommas,
  parseModule,
} from "./parse"

// The members below are those of TypeScript's tree for the same code.

// The text of each object literal's members, in source order.
function getObjectMembers(code: string) {
  const objects: t.ObjectExpression[] = []
  t.traverseFast(parseModule(code), (node) => {
    if (node.type === "ObjectExpression") {
      objects.push(node)
    }
  })
  return objects
    .sort((a, b) => a.start! - b.start!)
    .map((object) =>
      object.properties.map((member) => code.slice(member.start!, member.end!))
    )
}

describe("parseModule", () => {
  it.each([
    ["x = { a: 1,, b: 2 }", [["a: 1", "b: 2"]]],
    ["x = { , a: 1 }", [["a: 1"]]],
    ["x = { a: 1,,, b: 2 }", [["a: 1", "b: 2"]]],
    ["x = { a: 1,, }", [["a: 1"]]],
    ["x = { a: 1,\n  // c\n  , b: 2 }", [["a: 1", "b: 2"]]],
    [
      "x = { a: { b: 1,, c: 2 },, d: 3 }",
      [
        ["a: { b: 1,, c: 2 }", "d: 3"],
        ["b: 1", "c: 2"],
      ],
    ],
    ["x = f({ a: 1,, b: 2 })", [["a: 1", "b: 2"]]],
    ["const x = { a: 1,, b: 2 }", [["a: 1", "b: 2"]]],
    ["x = { a: 1,\n  , b: 2 }", [["a: 1", "b: 2"]]],
    ["x = <div style={{ a: 1,, b }} />", [["a: 1", "b"]]],
  ])(
    "parses past a comma TypeScript skips where an object literal member goes: %j",
    (code, members) => {
      expect(getObjectMembers(code)).toEqual(members)
    }
  )

  it.each([
    // An array literal takes the comma as its own, even in a function.
    "x = [{ a: 1,, b: 2 }]",
    "x = [f(() => ({ a: 1,, b: 2 }))]",
    "const [a = { b: 1,, c }] = d",
    // So do a type argument list and a tuple type.
    "let x: Foo<(a = { a: 1,, b: 2 }) => void>",
    "let x: [(a = { a: 1,, b: 2 }) => void]",
    // A variable declaration list takes a comma that starts a line.
    "const x = { a: 1,\n  , b: 2 }",
    "const x = { a: 1, /* c\n */ , b: 2 }",
    // JSX children take any token.
    "x = <div>{ { a: 1,, b } }</div>",
    "x = <div><p style={{ a: 1,, b }} /></div>",
  ])(
    "does not parse past a comma a list around the object takes, where TypeScript's object ends: %j",
    (code) => {
      expect(() => parseModule(code)).toThrow(SyntaxError)
    }
  )

  it.each([
    // TypeScript has `a:` with a missing value.
    "x = { a: , b }",
    "import { a,, b } from 'c'",
  ])("does not parse past other commas Babel throws on: %j", (code) => {
    expect(() => parseModule(code)).toThrow(SyntaxError)
  })

  it("throws Babel's error for the code as written", () => {
    // Babel throws at the comma after `a:`, and with it blanked out, at the
    // colon after `b`.
    expect(() => parseModule("x = { a: , b: 1 }")).toThrow(
      "Unexpected token (1:9)"
    )
  })
})

describe("countSyntaxErrors and countSyntaxErrorsExceptSkippedCommas", () => {
  it("differ on a skipped comma, which only countSyntaxErrors counts, as unparsable", () => {
    expect(countSyntaxErrors("x = { a: 1,, b: 2 }")).toBe(Infinity)
    expect(countSyntaxErrorsExceptSkippedCommas("x = { a: 1,, b: 2 }")).toBe(0)
    // Babel recovers from the comma in the call, which still counts.
    expect(
      countSyntaxErrorsExceptSkippedCommas("x = { a: 1,, b: 2 }; f(a,, b)")
    ).toBe(1)
  })

  it("count a comma TypeScript does not skip as unparsable", () => {
    expect(countSyntaxErrors("x = [{ a: 1,, b: 2 }]")).toBe(Infinity)
    expect(countSyntaxErrorsExceptSkippedCommas("x = [{ a: 1,, b: 2 }]")).toBe(
      Infinity
    )
  })

  it("agree on code without skipped commas", () => {
    for (const code of ["x = { a: 1, b: 2 }", "f(a,, b)", "x = {"]) {
      expect(countSyntaxErrorsExceptSkippedCommas(code)).toBe(
        countSyntaxErrors(code)
      )
    }
  })
})

describe("addsSyntaxErrors", () => {
  it("is whether the output has more syntax errors than the input", () => {
    expect(addsSyntaxErrors("x = { a: 1 }", "x = { a: 1, b: 2 }")).toBe(false)
    expect(addsSyntaxErrors("x = { a: 1 }", "x = { a: 1,, b: 2 }")).toBe(true)
    expect(addsSyntaxErrors("f(a,, b)", "f(a,, b, c)")).toBe(false)
  })

  it("parses .ts code without JSX", () => {
    const output = "x = <Config>{ a: 1 }"
    expect(addsSyntaxErrors("x = {}", output)).toBe(true)
    expect(addsSyntaxErrors("x = {}", output, { jsx: false })).toBe(false)
  })
})
