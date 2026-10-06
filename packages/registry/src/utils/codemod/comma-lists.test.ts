import { describe, expect, it } from "vitest"

import { appendCommaToText } from "./comma-lists"

// The outputs below are ts-morph's, which finds the last token with
// TypeScript's scanner.

describe("appendCommaToText", () => {
  it("appends a comma after the last token", () => {
    expect(appendCommaToText("a")).toBe("a,")
    expect(appendCommaToText(`"___a": "...a"`)).toBe(`"___a": "...a",`)
  })

  it("puts the comma before the whitespace and comments that end the text", () => {
    expect(appendCommaToText("a ")).toBe("a, ")
    expect(appendCommaToText("a /* c */ ")).toBe("a, /* c */ ")
    expect(appendCommaToText("a // c\n")).toBe("a, // c\n")
    expect(appendCommaToText("a /* unterminated")).toBe("a, /* unterminated")
  })

  it("adds no comma after a comma, or to text without tokens", () => {
    expect(appendCommaToText("a,")).toBe("a,")
    expect(appendCommaToText("a, // c")).toBe("a, // c")
    expect(appendCommaToText("")).toBe("")
    expect(appendCommaToText("// c")).toBe("// c")
  })

  it("does not read comments in strings and template literals", () => {
    expect(appendCommaToText(`"a // b"`)).toBe(`"a // b",`)
    expect(appendCommaToText("`a${b}c` // d")).toBe("`a${b}c`, // d")
    expect(appendCommaToText("`a${ {x: 1} }c` /* d */")).toBe(
      "`a${ {x: 1} }c`, /* d */"
    )
    expect(appendCommaToText("`${a /* } */}`")).toBe("`${a /* } */}`,")
  })

  it("ends an unterminated string at the line break", () => {
    expect(appendCommaToText(`"a\n// c`)).toBe(`"a,\n// c`)
    // An escaped line break continues the string.
    expect(appendCommaToText(`"a\\\n b" // c`)).toBe(`"a\\\n b", // c`)
  })
})
