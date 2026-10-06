import { type types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import { getNodesWithComments, type NodeOrComment } from "./comment-nodes"
import { applyManipulation } from "./edits"
import { parseModule } from "./parse"
import {
  getNextNonWhitespacePos,
  getPosAtStartOfLineOrNonWhitespace,
  getTrailingTriviaEnd,
} from "./trivia"

// A top-level statement as ts-morph lists them in getStatementsWithComments:
// the program's statements and directives, and comment statements, which are
// comments on their own lines between them. A statement's pos is the previous
// statement's end.
export type Statement = NodeOrComment<t.Statement | t.Directive>

// ts-morph's StatementedNode#getStatementsWithComments() on a source file.
export function getStatementsWithComments(
  code: string,
  program: t.Program
): Statement[] {
  const nodes = [...program.directives, ...program.body].sort(
    (a, b) => a.start! - b.start!
  )

  return getNodesWithComments(
    code,
    0,
    nodes.map((node, index) => ({
      pos: index === 0 ? 0 : nodes[index - 1].end!,
      node,
    }))
  )
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
