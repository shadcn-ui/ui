import { describe, expect, it } from "vitest"

import { getCommentRanges, getJsDocStart } from "./trivia"

// The ranges below are TypeScript's.

function getComments(code: string, pos: number, trailing: boolean) {
  return getCommentRanges(code, pos, { trailing }).map((range) =>
    code.slice(range.pos, range.end)
  )
}

describe("getCommentRanges", () => {
  it("finds trailing comments up to the end of the line", () => {
    expect(getComments("a /* b */ /* c */ // d\n// e", 1, true)).toEqual([
      "/* b */",
      "/* c */",
      "// d",
    ])
    expect(getComments("a\r\n// b\r\n", 1, true)).toEqual([])
  })

  it("finds leading comments after the first line break", () => {
    expect(getComments("a // b\n// c\n/* d */ e", 1, false)).toEqual([
      "// c",
      "/* d */",
    ])
    expect(getComments("a\n  /* b */\n  // c\n  d", 1, false)).toEqual([
      "/* b */",
      "// c",
    ])
  })

  it("collects leading comments at the start of the text", () => {
    expect(getComments("/* a */ b", 0, false)).toEqual(["/* a */"])
  })

  it("goes on past a line break beyond ASCII", () => {
    expect(getComments("a /* b */  // c\n", 1, true)).toEqual([
      "/* b */",
      "// c",
    ])
  })
})

describe("getJsDocStart", () => {
  const code = `{\n  /* a */ /** b */\n  b: 1, /** c */ c: 2,\n  /**/\n  d: 3,\n}`

  function getMemberJsDoc(member: string, includeTrailingComments = false) {
    const end = code.indexOf(member) + member.length
    const pos = code.lastIndexOf(",", code.indexOf(member)) + 1 || 1
    const start = getJsDocStart(code, pos, end, { includeTrailingComments })
    return start === undefined ? undefined : code.slice(start, end)
  }

  it("is the first JSDoc comment among the leading comments", () => {
    expect(getMemberJsDoc("b: 1")).toBe("/** b */\n  b: 1")
  })

  it("leaves out comments on the line pos is on, unless asked for", () => {
    expect(getMemberJsDoc("c: 2")).toBeUndefined()
    expect(getMemberJsDoc("c: 2", true)).toBe("/** c */ c: 2")
  })

  it("is not an empty /**/ comment", () => {
    expect(getMemberJsDoc("d: 3")).toBeUndefined()
  })
})
