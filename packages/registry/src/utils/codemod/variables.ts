import { type types as t } from "@babel/core"

import { applyManipulation } from "./edits"
import { getNonWhitespaceStart, skipTrivia } from "./trivia"

// ts-morph's VariableDeclaration#setInitializer(text) on a declaration that
// has an initializer: removeInitializer() takes out the `=`, the initializer
// and the spaces before them, then ` = text` goes after the name and type.
export function setInitializer(
  code: string,
  declaration: t.VariableDeclarator,
  initializer: string
) {
  // Babel's identifier ends after its type annotation.
  const nameEnd = declaration.id.end!

  // The `=` token's getNonWhitespaceStart(). On the same line, comments
  // between the name and the `=` are removed with it.
  let removalStart = getNonWhitespaceStart(
    code,
    { pos: nameEnd, start: skipTrivia(code, nameEnd) },
    { end: nameEnd, isComment: false }
  )
  while (code[removalStart - 1] === " " || code[removalStart - 1] === "\t") {
    removalStart--
  }

  return applyManipulation(code, [
    { start: removalStart, end: declaration.init!.end!, text: "" },
    { start: nameEnd, end: nameEnd, text: ` = ${initializer}` },
  ])
}
