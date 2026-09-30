import { Node, type SourceFile } from "ts-morph"

import type { PendingImport } from "./types"

export function addCommonJsCnRequire(
  sourceFile: SourceFile,
  localName: string
) {
  const binding = localName === "cn" ? "cn" : `cn: ${localName}`
  const statements = sourceFile.getStatements()
  let index = 0

  while (index < statements.length) {
    const statement = statements[index]
    if (
      Node.isExpressionStatement(statement) &&
      Node.isStringLiteral(statement.getExpression())
    ) {
      index++
      continue
    }
    break
  }

  sourceFile.insertStatements(index, `const { ${binding} } = require("cn")`)
}

export function addPendingImports(
  sourceFile: SourceFile,
  pendingImports: PendingImport[]
) {
  for (const pendingImport of dedupePendingImports(pendingImports)) {
    let declaration = sourceFile
      .getImportDeclarations()
      .find(
        (candidate) =>
          candidate.getModuleSpecifierValue() ===
            pendingImport.moduleSpecifier &&
          !candidate.getNamespaceImport() &&
          !candidate.isTypeOnly()
      )

    declaration ??= sourceFile.addImportDeclaration({
      moduleSpecifier: pendingImport.moduleSpecifier,
    })

    const exists = declaration.getNamedImports().some((specifier) => {
      const localName =
        specifier.getAliasNode()?.getText() ?? specifier.getNameNode().getText()
      return (
        specifier.getName() === pendingImport.importedName &&
        localName === pendingImport.localName
      )
    })

    if (!exists) {
      declaration.addNamedImport({
        name: pendingImport.importedName,
        alias:
          pendingImport.importedName === pendingImport.localName
            ? undefined
            : pendingImport.localName,
        isTypeOnly: pendingImport.isTypeOnly,
      })
    }
  }
}

function dedupePendingImports(imports: PendingImport[]) {
  return imports.filter(
    (item, index) =>
      imports.findIndex(
        (candidate) =>
          candidate.moduleSpecifier === item.moduleSpecifier &&
          candidate.importedName === item.importedName &&
          candidate.localName === item.localName &&
          candidate.isTypeOnly === item.isTypeOnly
      ) === index
  )
}
