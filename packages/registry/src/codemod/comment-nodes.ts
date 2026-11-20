import { type types as t } from "@babel/core"

import { getLineEnd, getLineStart, isWhitespace } from "./trivia"

// A child of a source file or object literal as ts-morph lists them: a node,
// or a comment node, which is a comment on its own lines between the nodes.
// ts-morph counts comment nodes when it inserts by index.
export interface NodeOrComment<T> {
  // Where the leading trivia starts: TypeScript's pos. A comment node's pos is
  // where the comment starts, as in ts-morph.
  pos: number
  start: number
  end: number
  // Undefined for a comment node.
  node?: T
}

type CommentKind = "line" | "block" | "jsdoc"

// ts-morph's CommentNodeParser: the nodes of a container whose body starts at
// bodyPos, with the comment nodes before, between and after them.
export function getNodesWithComments<T extends t.Node>(
  code: string,
  bodyPos: number,
  nodes: { pos: number; node: T }[]
) {
  if (nodes.length === 0) {
    return getCommentNodes<T>(code, bodyPos, false)
  }

  const children: NodeOrComment<T>[] = []
  for (const { pos, node } of nodes) {
    children.push(...getCommentNodes<T>(code, pos, true))
    children.push({ pos, start: node.start!, end: node.end!, node })
  }
  const lastNode = nodes[nodes.length - 1].node
  children.push(...getCommentNodes<T>(code, lastNode.end!, false))

  return children
}

// getCommentNodes: the comments after fullStart that are on their own lines,
// before the next node. A JSDoc comment before a node belongs to it, so it
// stops there unless no node follows.
function getCommentNodes<T>(
  code: string,
  fullStart: number,
  stopAtJsDoc: boolean
) {
  let pos = fullStart
  const comments: NodeOrComment<T>[] = []

  // Skips what is left of the line pos is on: the trailing comments of what
  // precedes it.
  function skipTrailingLine() {
    if (pos === 0) {
      return
    }

    let lineEnd = getLineEnd(code, pos)
    while (pos < lineEnd) {
      const kind = getCommentKind(code, pos)
      if (kind) {
        pos = skipComment(code, pos, kind)
        if (kind === "line") {
          return
        }
        lineEnd = getLineEnd(code, pos)
      } else if (!isWhitespace(code[pos]) && code[pos] !== ",") {
        return
      } else {
        pos++
      }
    }

    while (code[pos] === "\n") {
      pos++
    }
  }

  skipTrailingLine()

  while (pos < code.length) {
    const kind = getCommentKind(code, pos)
    if (kind) {
      if (kind === "jsdoc" && stopAtJsDoc) {
        break
      }
      const start = pos
      pos = skipComment(code, pos, kind)
      comments.push({ pos: start, start, end: pos })
      skipTrailingLine()
    } else if (!isWhitespace(code[pos])) {
      break
    } else {
      pos++
    }
  }

  // A comment on the same line as the next node is not a node of its own.
  const maxEnd =
    pos === code.length || code[pos] === "}" ? pos : getLineStart(code, pos)

  return comments.filter((comment) => comment.end <= maxEnd)
}

function getCommentKind(code: string, pos: number): CommentKind | undefined {
  if (code[pos] !== "/") {
    return undefined
  }
  if (code[pos + 1] === "/") {
    return "line"
  }
  if (code[pos + 1] !== "*") {
    return undefined
  }
  return code[pos + 2] === "*" ? "jsdoc" : "block"
}

function skipComment(code: string, pos: number, kind: CommentKind) {
  if (kind === "line") {
    return getLineEnd(code, pos + 2)
  }

  // Like ts-morph, look for the end after "/**", so "/**/" does not end there.
  const close = code.indexOf("*/", pos + (kind === "jsdoc" ? 3 : 2))
  return close === -1 ? code.length : close + 2
}
