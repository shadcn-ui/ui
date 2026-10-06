import { applyManipulation } from "@/src/utils/codemod/edits"
import { getText, parseTransformInput } from "@/src/utils/codemod/parse"
import {
  getStatementNonWhitespaceStart,
  getStatementsWithComments,
  type Statement,
} from "@/src/utils/codemod/statements"
import {
  getPosAtStartOfLineOrNonWhitespace,
  getTrailingTriviaEnd,
} from "@/src/utils/codemod/trivia"

import { fromTextTransformer } from "./text-transformer"

// With /g, test() starts where the last match ended, so after a match the next
// call fails and every other file keeps its "use client". Kept on purpose
// until that is fixed (see transform-rsc.test.ts).
const directiveRegex = /^["']use client["']$/g

export const transformRsc = fromTextTransformer((code, { config }) => {
  if (config.rsc) {
    return code
  }

  // ts-morph tests the first expression statement of the tree TypeScript
  // recovers from a file Babel cannot parse, such as a CSS file, which resets
  // the regex. This leaves the regex as it is.
  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // Remove "use client" from the top of the file. TypeScript parses a
  // directive as an expression statement.
  const statements = getStatementsWithComments(code, file.program)
  const index = statements.findIndex(
    ({ node }) =>
      node?.type === "ExpressionStatement" || node?.type === "Directive"
  )
  if (
    index !== -1 &&
    directiveRegex.test(getText(code, statements[index].node!))
  ) {
    return removeStatement(code, statements, index)
  }

  return code
})

// ts-morph's Statement#remove() for a statement of the source file
// (removeStatementedNodeChild): from the end of the statement or comment
// before it, through its trailing comments and the blank lines after it. The
// statements around it are then separated by a blank line if either has a
// body, and by a line break otherwise.
function removeStatement(code: string, statements: Statement[], index: number) {
  const statement = statements[index]
  const previous = statements[index - 1]
  const next = statements[index + 1]

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
    end = statement.end
  } else if (isNewLineAtPos(code, triviaEnd)) {
    // Without a previous statement, the statement starts the file.
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

// ts-morph's isNewLineAtPos.
function isNewLineAtPos(code: string, pos: number) {
  return code[pos] === "\n" || (code[pos] === "\r" && code[pos + 1] === "\n")
}

// ts-morph's getPosAtNextNonBlankLine: past the blank lines from pos, to the
// start of the first line with something on it.
function getPosAtNextNonBlankLine(code: string, pos: number) {
  let lineStart = pos
  for (let i = pos; i < code.length; i++) {
    if (code[i] === " " || code[i] === "\t") {
      continue
    }
    if (code[i] === "\n" || (code[i] === "\r" && code[i + 1] === "\n")) {
      i += code[i] === "\r" ? 1 : 0
      lineStart = i + 1
      continue
    }
    break
  }
  return lineStart
}

// ts-morph's getPosAtEndOfPreviousLine: the line break before pos.
function getPosAtEndOfPreviousLine(code: string, pos: number) {
  while (pos > 0) {
    pos--
    if (code[pos] === "\n") {
      return code[pos - 1] === "\r" ? pos - 1 : pos
    }
  }
  return pos
}
