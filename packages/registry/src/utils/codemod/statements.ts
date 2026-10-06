import { type types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import { applyManipulation } from "./edits"
import { parseModule } from "./parse"
import {
  getLineEnd,
  getLineStart,
  getNextNonWhitespacePos,
  getPosAtStartOfLineOrNonWhitespace,
  getTrailingTriviaEnd,
  isWhitespace,
} from "./trivia"

// A top-level statement as ts-morph lists them in getStatementsWithComments:
// the program's statements and directives, and comment statements, which are
// comments on their own lines between them.
export interface Statement {
  // Where the leading trivia starts: the previous statement's end.
  pos: number
  start: number
  end: number
  // Undefined for a comment statement.
  node?: t.Statement | t.Directive
}

type CommentKind = "line" | "block" | "jsdoc"

// ts-morph's StatementedNode#getStatementsWithComments() on a source file.
export function getStatementsWithComments(code: string, program: t.Program) {
  const nodes = [...program.directives, ...program.body].sort(
    (a, b) => a.start! - b.start!
  )

  if (nodes.length === 0) {
    return getCommentStatements(code, 0, false)
  }

  const statements: Statement[] = []
  let previousEnd = 0
  for (const node of nodes) {
    statements.push(...getCommentStatements(code, previousEnd, true))
    statements.push({
      pos: previousEnd,
      start: node.start!,
      end: node.end!,
      node,
    })
    previousEnd = node.end!
  }
  statements.push(...getCommentStatements(code, previousEnd, false))

  return statements
}

// ts-morph's CommentNodeParser: the comments after fullStart that are on their
// own lines, before the next statement. A JSDoc comment before a statement
// belongs to it, so it stops there unless no statement follows.
function getCommentStatements(
  code: string,
  fullStart: number,
  stopAtJsDoc: boolean
) {
  let pos = fullStart
  const comments: Statement[] = []

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
      comments.push({ pos: fullStart, start, end: pos })
      skipTrailingLine()
    } else if (!isWhitespace(code[pos])) {
      break
    } else {
      pos++
    }
  }

  // A comment on the same line as the next statement is not its own statement.
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

// ts-morph's Node#getNonWhitespaceStart() for a top-level statement.
function getNonWhitespaceStart(
  code: string,
  statements: Statement[],
  index: number
) {
  const statement = statements[index]
  const previous = statements[index - 1]

  // A comment statement's leading trivia is only whitespace.
  if (!statement.node) {
    return statement.start
  }

  let searchStart = statement.pos
  if (previous && !previous.node) {
    searchStart = previous.end
  } else if (
    previous &&
    code.slice(statement.pos, statement.start).includes("\n")
  ) {
    searchStart = getTrailingTriviaEnd(code, previous.end)
  }

  return getNextNonWhitespacePos(code, searchStart)
}

// ts-morph's insertion of a statement into a source file at index
// (insertIntoBracesOrSourceFile with _standardWrite). A blank line separates
// it from neighbors of another kind. Returns the new code and where the
// inserted statement ends in it.
export function insertStatement(
  code: string,
  statements: Statement[],
  index: number,
  statementText: string,
  isSameKind: (statement: Statement) => boolean
) {
  const previous = statements[index - 1]
  const next = statements[index]
  const insertPos = previous ? previous.end : 0
  const endPos = getPosAtStartOfLineOrNonWhitespace(
    code,
    next ? getNonWhitespaceStart(code, statements, index) : code.length
  )

  const writer = new CodeBlockWriter()
  if (previous?.node && !isSameKind(previous)) {
    writer.blankLine()
  } else if (insertPos !== 0) {
    writer.newLineIfLastNot()
  }
  writer.write(statementText)
  const statementEnd = insertPos + writer.getLength()
  if (next && !isSameKind(next)) {
    writer.blankLine()
  } else {
    writer.newLineIfLastNot()
  }

  return {
    code: applyManipulation(code, [
      { start: insertPos, end: endPos, text: writer.toString() },
    ]),
    end: statementEnd,
  }
}

// ts-morph's SourceFile#addImportDeclaration({ moduleSpecifier, namedImports:
// [name] }): after the last import, or after the leading block comments when
// there are no imports.
export function addImportDeclaration(
  code: string,
  moduleSpecifier: string,
  name: string
) {
  const statements = getStatementsWithComments(code, parseModule(code).program)

  let index = 0
  let isInLeadingComments = true
  for (let i = 0; i < statements.length; i++) {
    if (isInLeadingComments && isBlockComment(code, statements[i])) {
      index = i + 1
    } else {
      isInLeadingComments = false
      if (isImportDeclaration(statements[i])) {
        index = i + 1
      }
    }
  }

  return insertStatement(
    code,
    statements,
    index,
    `import { ${name} } from "${moduleSpecifier}";`,
    isImportDeclaration
  ).code
}

export function isImportDeclaration(statement: Statement) {
  return statement.node?.type === "ImportDeclaration"
}

function isBlockComment(code: string, statement: Statement) {
  return !statement.node && code.startsWith("/*", statement.start)
}
