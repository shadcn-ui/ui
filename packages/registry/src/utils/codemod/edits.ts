import { countSyntaxErrors } from "./parse"

// Replaces code[start, end) with text. Positions are in the original code.
export interface TextEdit {
  start: number
  end: number
  text: string
}

// ts-morph's text manipulations, without its syntax check. The edits must not
// overlap.
export function applyEdits(code: string, edits: TextEdit[]) {
  // From the end, so earlier positions stay valid. At the same start, the
  // longer edit goes first, so an insertion lands before a removal there.
  const editsFromEnd = [...edits].sort(
    (a, b) => b.start - a.start || b.end - a.end
  )

  let result = code
  for (const edit of editsFromEnd) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end)
  }

  return result
}

// ts-morph's error for an edit it rejects, with its message.
export class SyntaxErrorInsertedError extends Error {
  constructor() {
    super("Manipulation error: A syntax error was inserted.")
  }
}

// ts-morph's doManipulation, which throws when the edited text no longer
// parses into the tree it expects. A new parse error stands in for that.
export function applyManipulation(code: string, edits: TextEdit[]) {
  const result = applyEdits(code, edits)

  if (countSyntaxErrors(result) > countSyntaxErrors(code)) {
    throw new SyntaxErrorInsertedError()
  }

  return result
}
