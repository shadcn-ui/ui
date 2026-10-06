import { describe, expect, it } from "vitest"

import { getNodesWithComments } from "./comment-nodes"
import { parseModule } from "./parse"

// The source file's statements and comment nodes, as ts-morph's
// getStatementsWithComments() lists them.
function describeStatements(code: string) {
  const { body } = parseModule(code).program
  return getNodesWithComments(
    code,
    0,
    body.map((node, index) => ({
      pos: index === 0 ? 0 : body[index - 1].end!,
      node,
    }))
  ).map(
    ({ start, end, node }) =>
      `${node ? "node" : "comment"}: ${code.slice(start, end)}`
  )
}

describe("getNodesWithComments", () => {
  it("makes the comments on their own lines nodes, but not trailing ones", () => {
    expect(
      describeStatements(
        `// a\nconst a = 1 // trailing\n/* b */ const b = 2\n\n// c\n\n// d\nconst c = 3\n`
      )
    ).toEqual([
      "comment: // a",
      "node: const a = 1",
      "node: const b = 2",
      "comment: // c",
      "comment: // d",
      "node: const c = 3",
    ])
  })

  it("leaves a JSDoc comment to the node after it", () => {
    expect(
      describeStatements(`/** a */\nconst a = 1\n// b\n/** c */\n`)
    ).toEqual(["node: const a = 1", "comment: // b", "comment: /** c */"])
  })

  it("lists the comments of a container without nodes", () => {
    expect(describeStatements(`// a\n/* b */\n`)).toEqual([
      "comment: // a",
      "comment: /* b */",
    ])
  })
})
