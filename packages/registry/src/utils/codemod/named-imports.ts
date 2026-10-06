import { type types as t } from "@babel/core"

import { applyManipulation } from "./edits"
import { getTrailingCommentsEnd, skipTrivia } from "./trivia"

// ts-morph's ImportDeclaration#addNamedImport(name).
export function addNamedImport(
  code: string,
  declaration: t.ImportDeclaration,
  name: string
) {
  const namedImports = declaration.specifiers.filter(
    (specifier) => specifier.type === "ImportSpecifier"
  )
  if (namedImports.length > 0) {
    return insertIntoCommaSeparatedNodes(code, namedImports, name)
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

  const emptyBraces = findEmptyBraces(code, declaration)
  if (emptyBraces) {
    return applyManipulation(code, [{ ...emptyBraces, text: namedImportsText }])
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

// ts-morph's insertIntoCommaSeparatedNodes, appending an identifier to a list
// in braces: `{ a, b }` becomes `{ a, b, name }`. Comments trailing the last
// node or its comma stay in front of the comma that follows them.
function insertIntoCommaSeparatedNodes(
  code: string,
  nodes: t.Node[],
  name: string
) {
  const lastNodeEnd = nodes[nodes.length - 1].end!
  const afterLastNode = skipTrivia(code, lastNodeEnd)
  const hasTrailingComma = code[afterLastNode] === ","

  const commentsAfterLastNode = getTrailingComments(code, lastNodeEnd)
  const separator = hasTrailingComma
    ? `${commentsAfterLastNode},${getTrailingComments(code, afterLastNode + 1)}`
    : `,${commentsAfterLastNode}`
  const closeBrace = hasTrailingComma
    ? skipTrivia(code, afterLastNode + 1)
    : afterLastNode

  return applyManipulation(code, [
    { start: lastNodeEnd, end: closeBrace, text: `${separator} ${name} ` },
  ])
}

function getTrailingComments(code: string, pos: number) {
  return code.slice(pos, getTrailingCommentsEnd(code, pos) ?? pos)
}

// The `{}` of `import {} from "module"` or `import a, {} from "module"`.
function findEmptyBraces(code: string, declaration: t.ImportDeclaration) {
  let pos = declaration.start! + "import".length
  const sourceStart = declaration.source.start!

  while (pos < sourceStart) {
    pos = skipTrivia(code, pos)
    if (code[pos] === "{") {
      return { start: pos, end: skipTrivia(code, pos + 1) + 1 }
    }
    pos++
  }

  return undefined
}
