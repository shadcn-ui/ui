import { type types as t } from "@babel/core"

import {
  getListChildren,
  insertIntoCommaSeparatedNodes,
  isItem,
  type CommaSeparatedList,
} from "./comma-lists"
import { applyManipulation } from "./edits"
import { skipTrivia } from "./trivia"

// ts-morph's ImportDeclaration#addNamedImport(name).
export function addNamedImport(
  code: string,
  declaration: t.ImportDeclaration,
  name: string
) {
  const namedImports = declaration.specifiers.filter(
    (specifier): specifier is t.ImportSpecifier =>
      specifier.type === "ImportSpecifier"
  )
  if (namedImports.length > 0) {
    // `{ a, b }` becomes `{ a, b, name }`.
    const list = getNamedImportsList(code, declaration, namedImports)
    return insertIntoCommaSeparatedNodes(
      code,
      list,
      list.children.filter(isItem),
      namedImports.length,
      name,
      { surroundWithSpaces: true },
      {}
    )
  }

  if (
    declaration.specifiers.some(
      (specifier) => specifier.type === "ImportNamespaceSpecifier"
    )
  ) {
    throw new Error(
      "Cannot add a named import to an import declaration that has a namespace import."
    )
  }

  const namedImportsText = `{ ${name} }`

  // `import {} from "module"` or `import a, {} from "module"`.
  const openBrace = findOpenBrace(code, declaration)
  if (openBrace !== undefined) {
    return applyManipulation(code, [
      {
        start: openBrace,
        end: skipTrivia(code, openBrace + 1) + 1,
        text: namedImportsText,
      },
    ])
  }

  const defaultImport = declaration.specifiers.find(
    (specifier) => specifier.type === "ImportDefaultSpecifier"
  )
  if (defaultImport) {
    return applyManipulation(code, [
      {
        start: defaultImport.end!,
        end: defaultImport.end!,
        text: `, ${namedImportsText}`,
      },
    ])
  }

  // `import "module"` has no import clause.
  const importKeywordEnd = declaration.start! + "import".length
  return applyManipulation(code, [
    {
      start: importKeywordEnd,
      end: importKeywordEnd,
      text: ` ${namedImportsText} from`,
    },
  ])
}

// The declaration's NamedImports, the list in braces after `import`.
function getNamedImportsList(
  code: string,
  declaration: t.ImportDeclaration,
  namedImports: t.ImportSpecifier[]
): CommaSeparatedList {
  const openBrace = findOpenBrace(code, declaration)!
  let closeBrace = skipTrivia(code, namedImports[namedImports.length - 1].end!)
  if (code[closeBrace] === ",") {
    closeBrace = skipTrivia(code, closeBrace + 1)
  }

  return {
    nodeStart: openBrace,
    pos: openBrace + 1,
    closeStart: closeBrace,
    children: getListChildren(code, openBrace + 1, closeBrace, namedImports),
  }
}

// The `{` of the declaration's named imports.
function findOpenBrace(code: string, declaration: t.ImportDeclaration) {
  let pos = declaration.start! + "import".length
  const sourceStart = declaration.source.start!

  while (pos < sourceStart) {
    pos = skipTrivia(code, pos)
    if (code[pos] === "{") {
      return pos
    }
    pos++
  }

  return undefined
}
