// The full text of a ts-morph SourceFile created from source, as
// createSourceFile() drops a leading byte order mark.
export function stripByteOrderMark(source: string) {
  return source.charCodeAt(0) === 0xfeff ? source.slice(1) : source
}

// The text from its first non-whitespace character. ts-morph's
// SourceFile#getText() started at the first token, so it also dropped the
// leading comments, the shebang and merge conflict markers: a license header
// or a JSDoc block above the imports was lost on install (#9206). Only the
// leading blank lines go now, so a file whose "use client" was removed does
// not start with an empty line.
export function trimLeadingWhitespace(code: string) {
  return code.replace(/^\s+/, "")
}

// transform on a ts-morph SourceFile created from source, which is then read
// from its first non-whitespace character.
export function transformSourceText(
  source: string,
  transform: (code: string) => string
) {
  return trimLeadingWhitespace(transform(stripByteOrderMark(source)))
}
