import { getLineEnd, isLineBreak, skipTrivia } from "@/src/utils/codemod/trivia"

// The full text of a ts-morph SourceFile created from source, as
// createSourceFile() drops a leading byte order mark.
export function stripByteOrderMark(source: string) {
  return source.charCodeAt(0) === 0xfeff ? source.slice(1) : source
}

// ts-morph's SourceFile#getText(), which starts at TypeScript's first token:
// past the shebang, the leading whitespace and comments, and the merge
// conflict markers TypeScript skips with them.
export function getTextFromFirstToken(code: string) {
  let pos = code.startsWith("#!") ? getLineEnd(code, 0) : 0
  for (;;) {
    pos = skipTrivia(code, pos)
    if (!isConflictMarker(code, pos)) {
      return code.slice(pos)
    }
    pos = skipConflictMarker(code, pos)
  }
}

// TypeScript's isConflictMarkerTrivia: seven <, =, | or > at the start of a
// line, followed by a space unless they are =.
function isConflictMarker(code: string, pos: number) {
  const char = code[pos]
  return (
    "<=|>".includes(char) &&
    (pos === 0 || isLineBreak(code[pos - 1])) &&
    pos + 7 < code.length &&
    code.startsWith(char.repeat(7), pos) &&
    (char === "=" || code[pos + 7] === " ")
  )
}

// TypeScript's scanConflictMarkerTrivia: a <<<<<<< or >>>>>>> marker ends
// with its line, a ||||||| or ======= marker at the next marker of =, or >,
// that is not its own.
function skipConflictMarker(code: string, pos: number) {
  const char = code[pos]
  if (char === "<" || char === ">") {
    while (pos < code.length && !isLineBreak(code[pos])) {
      pos++
    }
    return pos
  }

  while (
    pos < code.length &&
    !(
      (code[pos] === "=" || code[pos] === ">") &&
      code[pos] !== char &&
      isConflictMarker(code, pos)
    )
  ) {
    pos++
  }
  return pos
}

// transform on a ts-morph SourceFile created from source, which is then read
// with getText().
export function transformSourceText(
  source: string,
  transform: (code: string) => string
) {
  return getTextFromFirstToken(transform(stripByteOrderMark(source)))
}
