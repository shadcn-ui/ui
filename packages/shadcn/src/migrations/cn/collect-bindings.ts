import { Node, type SourceFile } from "ts-morph"

import { getRequiredPackage } from "./references"
import type { Binding, OldModule } from "./types"

export function collectBindings(sourceFile: SourceFile) {
  return [
    ...collectEsmBindings(sourceFile),
    ...collectCommonJsBindings(sourceFile),
  ]
}

function collectEsmBindings(sourceFile: SourceFile) {
  const bindings: Binding[] = []

  for (const declaration of sourceFile.getImportDeclarations()) {
    const module = declaration.getModuleSpecifierValue()
    if (!isOldModule(module)) {
      continue
    }

    const defaultImport = declaration.getDefaultImport()
    if (defaultImport && module.startsWith("clsx")) {
      bindings.push({
        identifier: defaultImport,
        localName: defaultImport.getText(),
        importedName: "default",
        module,
        kind: "esm",
      })
    }

    for (const specifier of declaration.getNamedImports()) {
      if (declaration.isTypeOnly() || specifier.isTypeOnly()) {
        continue
      }

      const identifier = specifier.getAliasNode() ?? specifier.getNameNode()
      if (!Node.isIdentifier(identifier)) {
        continue
      }

      bindings.push({
        identifier,
        localName: identifier.getText(),
        importedName: specifier.getName(),
        module,
        kind: "esm",
      })
    }
  }

  return bindings
}

function collectCommonJsBindings(sourceFile: SourceFile) {
  const bindings: Binding[] = []

  for (const declaration of sourceFile.getVariableDeclarations()) {
    const initializer = declaration.getInitializer()
    if (!initializer || !Node.isCallExpression(initializer)) {
      continue
    }

    const module = getRequiredPackage(initializer)
    if (!module) {
      continue
    }

    const nameNode = declaration.getNameNode()
    if (Node.isIdentifier(nameNode) && module.startsWith("clsx")) {
      bindings.push({
        identifier: nameNode,
        localName: nameNode.getText(),
        importedName: "default",
        module,
        kind: "cjs",
      })
      continue
    }

    if (!Node.isObjectBindingPattern(nameNode)) {
      continue
    }

    for (const element of nameNode.getElements()) {
      const identifier = element.getNameNode()
      if (!Node.isIdentifier(identifier)) {
        continue
      }

      bindings.push({
        identifier,
        localName: identifier.getText(),
        importedName:
          element.getPropertyNameNode()?.getText() ?? identifier.getText(),
        module,
        kind: "cjs",
      })
    }
  }

  return bindings
}

function isOldModule(value: string): value is OldModule {
  return value === "clsx" || value === "clsx/lite" || value === "tailwind-merge"
}
