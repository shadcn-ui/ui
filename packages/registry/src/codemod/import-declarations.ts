import { type types as t } from "@babel/core"

import { applyEdits, type TextEdit } from "./edits"
import { parseMaskingLines, parseTransformInput } from "./parse"
import { getSetLiteralValueEdit } from "./string-literals"

// The module specifier of each of ts-morph's SourceFile#getImportDeclarations()
// on a .tsx file: the top-level import declarations, type-only and
// side-effect imports too, but not `export … from`, import(), `import x =
// require()` or the imports in a block. TypeScript parses any file and finds
// the imports around the lines it cannot parse, so when Babel throws at a
// line, the line is masked out and the code parsed again.
export function getImportDeclarationSources(code: string): t.StringLiteral[] {
  const file = parseTransformInput(code) ?? parseMaskingLines(code)?.file
  return (file?.program.body ?? []).flatMap((statement) =>
    statement.type === "ImportDeclaration" ? [statement.source] : []
  )
}

// ts-morph's ImportDeclaration#setModuleSpecifier(value) for each import
// declaration that rewrite returns a value for, in order, then
// SourceFile#getFullText(). rewrite gets getModuleSpecifierValue().
export async function rewriteImportDeclarationSources(
  code: string,
  rewrite: (moduleSpecifier: string) => Promise<string | undefined>
) {
  const edits: TextEdit[] = []
  for (const source of getImportDeclarationSources(code)) {
    const value = await rewrite(source.value)
    if (value !== undefined) {
      edits.push(getSetLiteralValueEdit(code, source, value))
    }
  }

  if (edits.length === 0) {
    return code
  }

  // Once ts-morph has edited a file, its getFullText() leaves out a byte
  // order mark.
  return applyEdits(code, edits).replace(/^﻿/, "")
}
