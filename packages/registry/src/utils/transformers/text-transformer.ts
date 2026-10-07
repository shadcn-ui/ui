import { getLineEnd, skipTrivia } from "@/src/utils/codemod/trivia"
import { type Transformer, type TransformOpts } from "@/src/utils/transformers"
import { type SourceFile } from "ts-morph"

// A transformer that takes the file's text and returns the new text.
export type TextTransformer = (
  code: string,
  opts: TransformOpts
) => string | Promise<string>

// The runner and its callers hand transformers a ts-morph SourceFile, so a
// text transformer runs on its full text and writes the result back.
// Temporary: this goes away when transform() keeps the file as text.
export function fromTextTransformer(transform: TextTransformer): Transformer {
  return async ({ sourceFile, ...opts }) => {
    setFullText(sourceFile, await transform(sourceFile.getFullText(), opts))
    return sourceFile
  }
}

// Writes text into the SourceFile when it differs from its full text.
// SourceFile#replaceWithText() and replaceText() write through ts-morph's code
// writer, which turns CRLF into LF. applyTextChanges() writes the text as it
// is, and like any ts-morph edit parses the file again, so the next
// transformer finds the tree it would have.
export function setFullText(sourceFile: SourceFile, text: string) {
  const fullText = sourceFile.getFullText()
  if (text !== fullText) {
    sourceFile.applyTextChanges([
      { span: { start: 0, length: fullText.length }, newText: text },
    ])
  }
}

// transform on a ts-morph SourceFile created from source, which is then read
// with getText(). createSourceFile() drops a leading byte order mark, and
// getText() starts at TypeScript's first token: past the shebang, and the
// leading whitespace and comments.
export function transformSourceText(
  source: string,
  transform: (code: string) => string
) {
  const code = transform(
    source.charCodeAt(0) === 0xfeff ? source.slice(1) : source
  )
  const shebangEnd = code.startsWith("#!") ? getLineEnd(code, 0) : 0
  return code.slice(skipTrivia(code, shebangEnd))
}
