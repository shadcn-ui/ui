import {
  Node,
  type Identifier,
  type SourceFile,
  type VariableDeclaration,
} from "ts-morph"

import { addPendingImports } from "./emit"
import { reportUnsupportedReferences } from "./issues"
import {
  getLiveReferences,
  getRequiredPackage,
  getUnsupportedBindingReason,
} from "./references"
import {
  TAILWIND_CONFIG_EXPORTS,
  TAILWIND_ROOT_EXPORTS,
  type CnMigrationIssue,
  type OldModule,
  type OldPackage,
  type PendingImport,
} from "./types"

export function migrateSpecifiers(
  sourceFile: SourceFile,
  pendingImports: PendingImport[],
  unsupported: CnMigrationIssue[],
  migratedPackages: Set<OldPackage>,
  externalContent: string
) {
  const changes =
    migrateEsmImports(
      sourceFile,
      pendingImports,
      unsupported,
      migratedPackages,
      externalContent
    ) + migrateCommonJsRequires(sourceFile, unsupported, migratedPackages)

  reportUnsupportedReferences(sourceFile, unsupported)
  addPendingImports(sourceFile, pendingImports)
  return changes
}

function migrateEsmImports(
  sourceFile: SourceFile,
  pendingImports: PendingImport[],
  unsupported: CnMigrationIssue[],
  migratedPackages: Set<OldPackage>,
  externalContent: string
) {
  let changes = 0

  for (const declaration of [...sourceFile.getImportDeclarations()]) {
    const moduleSpecifier = declaration.getModuleSpecifierValue()
    if (!isOldModule(moduleSpecifier)) {
      continue
    }

    const packageName = getOldPackage(moduleSpecifier)
    const hadImportClause = Boolean(declaration.getImportClause())
    const namespaceImport = declaration.getNamespaceImport()
    if (namespaceImport) {
      unsupported.push({
        packageName,
        symbol: namespaceImport.getText(),
        reason: "namespace imports cannot be migrated safely",
      })
    }

    const defaultImport = declaration.getDefaultImport()
    if (defaultImport) {
      if (packageName === "clsx") {
        if (hasReferences(defaultImport, externalContent)) {
          pendingImports.push({
            moduleSpecifier: moduleSpecifier === "clsx/lite" ? "cn/lite" : "cn",
            importedName: "clsx",
            localName: defaultImport.getText(),
            isTypeOnly: false,
          })
        }
        declaration.removeDefaultImport()
        migratedPackages.add("clsx")
        changes++
      } else {
        unsupported.push({
          packageName,
          symbol: defaultImport.getText(),
          reason: "tailwind-merge has no compatible default import mapping",
        })
      }
    }

    for (const specifier of [...declaration.getNamedImports()]) {
      const importedName = specifier.getName()
      const localName =
        specifier.getAliasNode()?.getText() ?? specifier.getNameNode().getText()
      const isTypeOnly = declaration.isTypeOnly() || specifier.isTypeOnly()
      const target = getImportTarget(moduleSpecifier, importedName, isTypeOnly)

      if (!target) {
        unsupported.push({
          packageName,
          symbol: importedName,
          reason:
            importedName.startsWith("Experimental") ||
            importedName === "experimentalParseClassName"
              ? "experimentalParseClassName is not supported by cn"
              : "no compatible cn export is available",
        })
        continue
      }

      const identifier = specifier.getAliasNode() ?? specifier.getNameNode()
      if (!Node.isIdentifier(identifier)) {
        unsupported.push({
          packageName,
          symbol: importedName,
          reason: "string-named imports cannot be migrated safely",
        })
        continue
      }

      const unsupportedReason = getUnsupportedBindingReason(
        identifier,
        importedName
      )
      if (unsupportedReason) {
        unsupported.push({
          packageName,
          symbol: importedName,
          reason: unsupportedReason,
        })
        continue
      }

      if (hasReferences(identifier, externalContent)) {
        pendingImports.push({ ...target, localName, isTypeOnly })
      }
      specifier.remove()
      migratedPackages.add(packageName)
      changes++
    }

    if (
      hadImportClause &&
      !declaration.getDefaultImport() &&
      !declaration.getNamespaceImport() &&
      declaration.getNamedImports().length === 0
    ) {
      declaration.remove()
    } else if (!hadImportClause) {
      unsupported.push({
        packageName,
        reason: "side-effect imports are left unchanged",
      })
    }
  }

  return changes
}

function getImportTarget(
  moduleSpecifier: OldModule,
  importedName: string,
  isTypeOnly: boolean
): Omit<PendingImport, "localName" | "isTypeOnly"> | null {
  if (moduleSpecifier === "clsx") {
    return {
      moduleSpecifier: "cn",
      importedName: importedName === "default" ? "clsx" : importedName,
    }
  }

  if (moduleSpecifier === "clsx/lite") {
    if (
      (importedName === "clsx" || importedName === "default") &&
      !isTypeOnly
    ) {
      return { moduleSpecifier: "cn/lite", importedName: "clsx" }
    }

    if (
      ["ClassValue", "ClassArray", "ClassDictionary"].includes(importedName)
    ) {
      return { moduleSpecifier: "cn", importedName }
    }
    return null
  }

  if (TAILWIND_ROOT_EXPORTS.has(importedName)) {
    return { moduleSpecifier: "cn", importedName }
  }

  const configExport = TAILWIND_CONFIG_EXPORTS.get(importedName)
  return configExport
    ? { moduleSpecifier: "cn/config", importedName: configExport }
    : null
}

function migrateCommonJsRequires(
  sourceFile: SourceFile,
  unsupported: CnMigrationIssue[],
  migratedPackages: Set<OldPackage>
) {
  let changes = 0

  for (const declaration of sourceFile.getVariableDeclarations()) {
    const initializer = declaration.getInitializer()
    if (!initializer || !Node.isCallExpression(initializer)) {
      continue
    }

    const requiredPackage = getRequiredPackage(initializer)
    if (!requiredPackage) {
      continue
    }

    const packageName = getOldPackage(requiredPackage)
    const nameNode = declaration.getNameNode()
    if (Node.isIdentifier(nameNode) && requiredPackage.startsWith("clsx")) {
      if (!getLiveReferences(nameNode).length) {
        removeVariableDeclaration(declaration)
      } else {
        initializer.replaceWithText(
          `require(${JSON.stringify(
            requiredPackage === "clsx/lite" ? "cn/lite" : "cn"
          )}).clsx`
        )
      }
      migratedPackages.add("clsx")
      changes++
      continue
    }

    if (!Node.isObjectBindingPattern(nameNode)) {
      unsupported.push({
        packageName,
        reason: "this CommonJS require shape cannot be migrated safely",
      })
      continue
    }

    const elements = nameNode.getElements()
    const unsafeElement = elements.find((element) => {
      const identifier = element.getNameNode()
      const importedName =
        element.getPropertyNameNode()?.getText() ?? identifier.getText()
      return (
        Node.isIdentifier(identifier) &&
        getUnsupportedBindingReason(identifier, importedName)
      )
    })
    if (unsafeElement) {
      const identifier = unsafeElement.getNameNode() as Identifier
      const importedName =
        unsafeElement.getPropertyNameNode()?.getText() ?? identifier.getText()
      unsupported.push({
        packageName,
        symbol: importedName,
        reason: getUnsupportedBindingReason(identifier, importedName)!,
      })
      continue
    }

    if (
      elements.every((element) => {
        const identifier = element.getNameNode()
        return (
          Node.isIdentifier(identifier) && !getLiveReferences(identifier).length
        )
      })
    ) {
      removeVariableDeclaration(declaration)
      migratedPackages.add(packageName)
      changes++
      continue
    }

    const importedNames = elements.map(
      (element) =>
        element.getPropertyNameNode()?.getText() ??
        element.getNameNode().getText()
    )
    const targetModules = new Set(
      importedNames.map(
        (importedName) =>
          getImportTarget(requiredPackage, importedName, false)
            ?.moduleSpecifier ?? null
      )
    )

    if (targetModules.size !== 1 || targetModules.has(null)) {
      unsupported.push({
        packageName,
        reason:
          "mixed or unsupported CommonJS exports require manual migration",
      })
      continue
    }

    initializer
      .getArguments()[0]
      .replaceWithText(JSON.stringify(Array.from(targetModules)[0]))

    for (const element of elements) {
      const importedName =
        element.getPropertyNameNode()?.getText() ??
        element.getNameNode().getText()
      const target = getImportTarget(requiredPackage, importedName, false)!
      if (target.importedName !== importedName) {
        element.replaceWithText(
          `${target.importedName}: ${element.getNameNode().getText()}`
        )
      }
    }

    migratedPackages.add(packageName)
    changes++
  }

  return changes
}

function removeVariableDeclaration(declaration: VariableDeclaration) {
  const statement = declaration.getVariableStatement()
  if (statement?.getDeclarations().length === 1) {
    statement.remove()
  } else {
    declaration.remove()
  }
}

function hasReferences(identifier: Identifier, externalContent: string) {
  return (
    getLiveReferences(identifier).length > 0 ||
    containsIdentifier(externalContent, identifier.getText())
  )
}

function containsIdentifier(content: string, identifier: string) {
  if (!content) {
    return false
  }

  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(^|[^a-zA-Z0-9_$])${escaped}(?=$|[^a-zA-Z0-9_$])`).test(
    content
  )
}

function getOldPackage(module: OldModule): OldPackage {
  return module.startsWith("clsx") ? "clsx" : "tailwind-merge"
}

function isOldModule(value: string): value is OldModule {
  return value === "clsx" || value === "clsx/lite" || value === "tailwind-merge"
}
