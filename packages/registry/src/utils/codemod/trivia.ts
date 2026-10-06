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
// TypeScript ends a line comment at any of its line breaks.
export function getCommentEnd(code: string, pos: number) {
  if (code.startsWith("//", pos)) {
    let end = pos + 2
    while (end < code.length && !isLineBreak(code[end])) {
      end++
    }
    return end
  }

  if (code.startsWith("/*", pos)) {
    const close = code.indexOf("*/", pos + 2)
    return close === -1 ? code.length : close + 2
  }

  return undefined
}

interface CommentRange {
  pos: number
  end: number
}

// TypeScript's iterateCommentRanges, behind ts.getLeadingCommentRanges and
// ts.getTrailingCommentRanges: the comments from pos on. Trailing comments
// stop at the end of the line, and leading ones are those after its first
// line break. The positions here are never at a shebang, so it is left out.
export function getCommentRanges(
  code: string,
  pos: number,
  { trailing }: { trailing: boolean }
) {
  const ranges: CommentRange[] = []
  let collecting = trailing || pos === 0

  while (pos < code.length) {
    const char = code[pos]

    if (char === "\r" || char === "\n") {
      pos += char === "\r" && code[pos + 1] === "\n" ? 2 : 1
      if (trailing) {
        break
      }
      collecting = true
      continue
    }

    const commentEnd = getCommentEnd(code, pos)
    if (commentEnd !== undefined) {
      if (collecting) {
        ranges.push({ pos, end: commentEnd })
      }
      pos = commentEnd
      continue
    }

    // Past other whitespace, including the line breaks beyond ASCII, which do
    // not end trailing comments.
    if (!isWhiteSpaceSingleLine(char) && !isLineBreak(char)) {
      break
    }
    pos++
  }

  return ranges
}

// The end of the last comment ts.getTrailingCommentRanges finds at pos: the
// comments that follow on the same line.
export function getTrailingCommentsEnd(code: string, pos: number) {
  return getCommentRanges(code, pos, { trailing: true }).at(-1)?.end
}

// Where the JSDoc comment TypeScript attaches to a node starts, for a node
// whose leading trivia starts at pos and that ends at end: the first `/** */`
// comment among its leading comments, and for some expressions also among
// the trailing comments at pos (getJSDocCommentRanges). ts-morph's
// getStart(true) starts there.
export function getJsDocStart(
  code: string,
  pos: number,
  end: number,
  { includeTrailingComments }: { includeTrailingComments: boolean }
) {
  const ranges = getCommentRanges(code, pos, { trailing: false })
  if (includeTrailingComments) {
    ranges.unshift(...getCommentRanges(code, pos, { trailing: true }))
  }

  return ranges.find(
    (range) =>
      range.end <= end &&
      code.startsWith("/**", range.pos) &&
      code[range.pos + 3] !== "/"
  )?.pos
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
