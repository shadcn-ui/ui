import { types as t } from "@babel/core"
import { describe, expect, it } from "vitest"

import { getNodesWithComments, type NodeOrComment } from "./comment-nodes"
import { parseModule } from "./parse"
import { getStatementsWithComments } from "./statements"

// The lists below are ts-morph's.

function describeNodes(code: string, nodes: NodeOrComment<t.Node>[]) {
  return nodes.map(
    ({ start, end, node }) =>
      `${node ? "node" : "comment"}: ${code.slice(start, end)}`
  )
}

// The source file's statements and comment nodes, as
// getStatementsWithComments() lists them.
function describeStatements(code: string) {
  return describeNodes(
    code,
    getStatementsWithComments(code, parseModule(code).program)
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

  it("lists a directive as a statement", () => {
    expect(describeStatements(`"use client"\n// a\nconst a = 1\n`)).toEqual([
      `node: "use client"`,
      "comment: // a",
      "node: const a = 1",
    ])
  })

  it("lists the comments of a container without nodes", () => {
    expect(describeStatements(`// a\n/* b */\n`)).toEqual([
      "comment: // a",
      "comment: /* b */",
    ])
  })

  it("keeps a comment before an object literal's closing brace", () => {
    // As getPropertiesWithComments() lists them.
    const code = `const a = {\n  // a\n  b: 1, // trailing\n  // c\n  /* d */ c: 2,\n  /* e */ }\n`
    const [declaration] = parseModule(code).program.body
    const object = (declaration as t.VariableDeclaration).declarations[0]
      .init as t.ObjectExpression
    const bodyPos = object.start! + 1

    expect(
      describeNodes(
        code,
        getNodesWithComments(
          code,
          bodyPos,
          object.properties.map((node, index) => ({
            pos:
              index === 0
                ? bodyPos
                : code.indexOf(",", object.properties[index - 1].end!) + 1,
            node,
          }))
        )
      )
    ).toEqual([
      "comment: // a",
      "node: b: 1",
      "comment: // c",
      "node: c: 2",
      "comment: /* e */",
    ])
  })
})
