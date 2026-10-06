// Text scanning shared by the helpers in this folder, after the TypeScript and
// ts-morph functions they are named for.

// ts-morph's StringUtils.isWhitespace.
const WHITESPACE = /[ \f\n\r\t\v\u00a0\u2028\u2029]/

// TypeScript's isWhiteSpaceSingleLine.
const SINGLE_LINE_WHITESPACE =
  /[ \t\v\f\u00a0\u0085\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]/

// TypeScript's isLineBreak.
const LINE_BREAK = /[\n\r\u2028\u2029]/

export function isWhitespace(char: string | undefined) {
  return char !== undefined && WHITESPACE.test(char)
}

export function isWhiteSpaceSingleLine(char: string | undefined) {
  return char !== undefined && SINGLE_LINE_WHITESPACE.test(char)
}

export function isLineBreak(char: string | undefined) {
  return char !== undefined && LINE_BREAK.test(char)
}

// ts-morph's StringUtils.getLineStartFromPos.
export function getLineStart(code: string, pos: number) {
  while (pos > 0 && code[pos - 1] !== "\n" && code[pos - 1] !== "\r") {
    pos--
  }
  return pos
}

// ts-morph's StringUtils.getLineEndFromPos.
export function getLineEnd(code: string, pos: number) {
  while (pos < code.length && code[pos] !== "\n" && code[pos] !== "\r") {
    pos++
  }
  return pos
}

// ts-morph's getPosAtStartOfLineOrNonWhitespace: back over spaces and tabs, to
// the start of the line or just after the previous non-whitespace character.
export function getPosAtStartOfLineOrNonWhitespace(code: string, pos: number) {
  while (pos > 0) {
    pos--
    if (code[pos] === "\n" || (code[pos] !== " " && code[pos] !== "\t")) {
      return pos + 1
    }
  }
  return pos
}

// Where the comment starting at pos ends, or undefined if none starts there.
function getCommentEnd(code: string, pos: number) {
  if (code.startsWith("//", pos)) {
    return getLineEnd(code, pos)
  }

  if (code.startsWith("/*", pos)) {
    const close = code.indexOf("*/", pos + 2)
    return close === -1 ? code.length : close + 2
  }

  return undefined
}

// The end of the last comment ts.getTrailingCommentRanges finds at pos: the
// comments that follow on the same line.
export function getTrailingCommentsEnd(code: string, pos: number) {
  let lastCommentEnd: number | undefined

  while (pos < code.length) {
    while (isWhiteSpaceSingleLine(code[pos])) {
      pos++
    }

    const commentEnd = getCommentEnd(code, pos)
    if (commentEnd === undefined) {
      break
    }

    lastCommentEnd = commentEnd
    // A line comment runs to the end of the line.
    if (code.startsWith("//", pos)) {
      break
    }
    pos = commentEnd
  }

  return lastCommentEnd
}

// ts-morph's Node#getTrailingTriviaEnd() for a node ending at end: past the
// comments on the rest of its line, and the spaces and tabs after them.
export function getTrailingTriviaEnd(code: string, end: number) {
  let pos = getTrailingCommentsEnd(code, end) ?? end
  while (code[pos] === " " || code[pos] === "\t") {
    pos++
  }
  return pos
}

// ts-morph's getNextNonWhitespacePos.
export function getNextNonWhitespacePos(code: string, pos: number) {
  while (pos < code.length && isWhitespace(code[pos])) {
    pos++
  }
  return pos
}

// TypeScript's skipTrivia: past whitespace, line breaks and comments.
export function skipTrivia(code: string, pos: number) {
  while (pos < code.length) {
    if (isWhiteSpaceSingleLine(code[pos]) || isLineBreak(code[pos])) {
      pos++
      continue
    }

    const commentEnd = getCommentEnd(code, pos)
    if (commentEnd === undefined) {
      break
    }
    pos = commentEnd
  }

  return pos
}
