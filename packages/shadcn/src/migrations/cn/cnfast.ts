import { Node, SyntaxKind, type SourceFile } from "ts-morph"

import type { OldPackage } from "./types"

export function migrateCnfastSpecifiers(
  sourceFile: SourceFile,
  migratedPackages: Set<OldPackage>
) {
  let changes = 0

  for (const declaration of sourceFile.getImportDeclarations()) {
    if (declaration.getModuleSpecifierValue() === "cnfast") {
      declaration.setModuleSpecifier("cn")
      changes++
    }
  }

  for (const declaration of sourceFile.getExportDeclarations()) {
    if (declaration.getModuleSpecifierValue() === "cnfast") {
      declaration.setModuleSpecifier("cn")
      changes++
    }
  }

  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    const expression = call.getExpression()
    if (
      expression.getKind() !== SyntaxKind.ImportKeyword &&
      (!Node.isIdentifier(expression) || expression.getText() !== "require")
    ) {
      continue
    }

    const argument = call.getArguments()[0]
    if (
      Node.isStringLiteral(argument) &&
      argument.getLiteralValue() === "cnfast"
    ) {
      argument.replaceWithText('"cn"')
      changes++
    }
  }

  if (changes) {
    migratedPackages.add("cnfast")
  }

  return changes
}
