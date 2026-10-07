import { type types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import { getNodesWithComments, type NodeOrComment } from "./comment-nodes"
import { applyManipulation, type TextEdit } from "./edits"
import { parseModule } from "./parse"
import {
  getNonWhitespaceStart,
  getPosAtEndOfPreviousLine,
  getPosAtNextNonBlankLine,
  getPosAtStartOfLineOrNonWhitespace,
  getTrailingTriviaEnd,
  isNewLineAtPos,
} from "./trivia"

// A top-level statement as ts-morph lists them in getStatementsWithComments:
// the program's statements and directives, and comment statements, which are
// comments on their own lines between them. A statement's pos is the previous
// node's end, as in TypeScript, and a comment statement's is its start.
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
function getStatementNonWhitespaceStart(
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

  return getNonWhitespaceStart(
    code,
    statement,
    previous && { end: previous.end, isComment: !previous.node }
  )
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
  const { edit, end } = getStatementInsertion(
    code,
    statements,
    index,
    statementText,
    isSameKind
  )
  return { code: applyManipulation(code, [edit]), end }
}

// insertStatement's edit, and where the inserted statement ends after it.
function getStatementInsertion(
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
    next ? getStatementNonWhitespaceStart(code, statements, index) : code.length
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

  const edit: TextEdit = {
    start: insertPos,
    end: endPos,
    text: writer.toString(),
  }
  return { edit, end: statementEnd }
}

// ts-morph's Statement#remove() for a statement of the source file
// (removeStatementedNodeChild): from the end of the statement or comment
// before it, through its trailing comments and the blank lines after it. The
// statements around it are then separated by a blank line if either has a
// body, and by a line break otherwise.
export function removeStatement(
  code: string,
  statements: Statement[],
  index: number
) {
  const statement = statements[index]
  const previous = statements[index - 1]
  const next = statements[index + 1]

  // RemoveChildrenWithFormattingTextManipulator's getRemovalPos and
  // getRemovalEnd. A statement without a previous one starts at the source
  // file's pos, 0.
  let start: number
  if (previous) {
    const previousTriviaEnd = getTrailingTriviaEnd(code, previous.end)
    start = isNewLineAtPos(code, previousTriviaEnd)
      ? previousTriviaEnd
      : previous.end
  } else {
    start = getStatementNonWhitespaceStart(code, statements, index)
  }

  const triviaEnd = getTrailingTriviaEnd(code, statement.end)
  let end: number
  if (previous && next) {
    end = getPosAtStartOfLineOrNonWhitespace(
      code,
      getStatementNonWhitespaceStart(code, statements, index + 1)
    )
  } else if (statement.end === code.length) {
    // The statement ends where the source file does.
    end = statement.end
  } else if (isNewLineAtPos(code, triviaEnd)) {
    const nextLineStart = getPosAtNextNonBlankLine(code, triviaEnd)
    end = previous
      ? getPosAtEndOfPreviousLine(code, nextLineStart)
      : nextLineStart
  } else {
    end = previous ? statement.end : triviaEnd
  }

  let spacing = ""
  if (previous && next) {
    spacing = hasBody(previous) || hasBody(next) ? "\n\n" : "\n"
  }

  return applyManipulation(code, [{ start, end, text: spacing }])
}

// ts-morph's hasBody() for a statement: a function or module declaration with
// a body, a class, an interface or an enum.
function hasBody({ node }: Statement) {
  const declaration =
    node?.type === "ExportNamedDeclaration" ||
    node?.type === "ExportDefaultDeclaration"
      ? node.declaration
      : node
  switch (declaration?.type) {
    case "FunctionDeclaration":
    case "ClassDeclaration":
    case "TSInterfaceDeclaration":
    case "TSEnumDeclaration":
      return true
    case "TSModuleDeclaration":
      return declaration.body !== undefined
    default:
      return false
  }
}

// ts-morph's SourceFile#addImportDeclaration({ moduleSpecifier, namedImports:
// [name] }).
export function addImportDeclaration(
  code: string,
  moduleSpecifier: string,
  name: string
) {
  return applyManipulation(code, [
    getImportDeclarationInsertion(
      code,
      `import { ${name} } from "${moduleSpecifier}";`
    ),
  ])
}

// The edit with which ts-morph's SourceFile#addImportDeclaration() writes the
// text of an import declaration: after the last import, or after the leading
// block comments when there are no imports.
export function getImportDeclarationInsertion(code: string, text: string) {
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

  return getStatementInsertion(
    code,
    statements,
    index,
    text,
    isImportDeclaration
  ).edit
}

export function isImportDeclaration(statement: Statement) {
  return statement.node?.type === "ImportDeclaration"
}

function isBlockComment(code: string, statement: Statement) {
  return !statement.node && code.startsWith("/*", statement.start)
}
