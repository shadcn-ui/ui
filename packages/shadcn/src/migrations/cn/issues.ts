import { Node, SyntaxKind, type SourceFile } from "ts-morph"

import {
  OLD_PACKAGES,
  type CnMigrationIssue,
  type OldModule,
  type OldPackage,
} from "./types"

export function reportUnsupportedReferences(
  sourceFile: SourceFile,
  unsupported: CnMigrationIssue[]
) {
  reportDynamicImports(sourceFile, unsupported)
  reportExportDeclarations(sourceFile, unsupported)
}

function reportDynamicImports(
  sourceFile: SourceFile,
  unsupported: CnMigrationIssue[]
) {
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getKind() !== SyntaxKind.ImportKeyword) {
      continue
    }

    const argument = call.getArguments()[0]
    if (!argument || !Node.isStringLiteral(argument)) {
      continue
    }

    const moduleSpecifier = argument.getLiteralValue()
    if (isOldModule(moduleSpecifier)) {
      unsupported.push({
        packageName: getOldPackage(moduleSpecifier),
        reason: "dynamic imports require manual migration",
      })
    }
  }
}

function reportExportDeclarations(
  sourceFile: SourceFile,
  unsupported: CnMigrationIssue[]
) {
  for (const declaration of sourceFile.getExportDeclarations()) {
    const moduleSpecifier = declaration.getModuleSpecifierValue()
    if (!moduleSpecifier || !isOldModule(moduleSpecifier)) {
      continue
    }

    const packageName = getOldPackage(moduleSpecifier)
    const namedExports = declaration.getNamedExports()
    if (!namedExports.length) {
      unsupported.push({
        packageName,
        reason: "export-from declarations require manual migration",
      })
      continue
    }

    for (const specifier of namedExports) {
      unsupported.push({
        packageName,
        symbol: specifier.getName(),
        reason: "export-from declarations require manual migration",
      })
    }
  }
}

export function getRemainingPackages(content: string) {
  return OLD_PACKAGES.filter((packageName) => {
    const escaped = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(
      `(?:from\\s*|import\\s*\\(|require\\s*\\()\\s*["']${escaped}(?:/lite)?["']`
    ).test(content)
  })
}

export function dedupeIssues(issues: CnMigrationIssue[]) {
  return issues.filter(
    (issue, index) =>
      issues.findIndex(
        (candidate) =>
          candidate.packageName === issue.packageName &&
          candidate.symbol === issue.symbol &&
          candidate.reason === issue.reason
      ) === index
  )
}

function getOldPackage(module: OldModule): OldPackage {
  return module.startsWith("clsx") ? "clsx" : "tailwind-merge"
}

function isOldModule(value: string): value is OldModule {
  return value === "clsx" || value === "clsx/lite" || value === "tailwind-merge"
}
