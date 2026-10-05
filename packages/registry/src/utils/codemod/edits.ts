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
  const lastFirst = [...edits].sort(
    (a, b) => b.start - a.start || b.end - a.end
  )

  let result = code
  for (const edit of lastFirst) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end)
  }

  return result
}

// ts-morph's doManipulation, which throws when an edit inserts a syntax error
// instead of returning the broken text.
export function applyManipulation(code: string, edits: TextEdit[]) {
  const result = applyEdits(code, edits)

  if (countSyntaxErrors(result) > countSyntaxErrors(code)) {
    throw new Error("Manipulation error: A syntax error was inserted.")
  }

  return result
}
