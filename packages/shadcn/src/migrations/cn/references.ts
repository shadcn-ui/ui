import { Node, SyntaxKind, type Identifier, type SourceFile } from "ts-morph"

import type { OldModule } from "./types"

export function getLiveReferences(identifier: Identifier) {
  const symbol = identifier.getSymbol()?.compilerSymbol
  const candidates = identifier
    .getSourceFile()
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((candidate) => candidate !== identifier)
  const references = candidates.filter(
    (candidate) => symbol && candidate.getSymbol()?.compilerSymbol === symbol
  )

  for (const reference of identifier.findReferencesAsNodes()) {
    const candidate = candidates.find(
      (current) =>
        current.getStart() === reference.getStart() &&
        current.getText() === reference.getText()
    )
    if (candidate && !references.includes(candidate)) {
      references.push(candidate)
    }
  }

  return references
}

export function getUnsupportedBindingReason(
  identifier: Identifier,
  importedName: string
) {
  const references = getLiveReferences(identifier)

  if (importedName === "validators") {
    const hasUnsupportedUsage = references.some((reference) => {
      const access = reference.getParentIfKind(
        SyntaxKind.PropertyAccessExpression
      )
      if (access) {
        const call = access.getParentIfKind(SyntaxKind.CallExpression)
        if (
          call !== undefined &&
          call.getExpression().getStart() === access.getStart()
        ) {
          return true
        }
      }

      const declaration = reference.getParentIfKind(
        SyntaxKind.VariableDeclaration
      )
      return (
        declaration !== undefined &&
        Node.isObjectBindingPattern(declaration.getNameNode()) &&
        declaration.getInitializer()?.getStart() === reference.getStart()
      )
    })

    if (hasUnsupportedUsage) {
      return "callable validators are not supported by cn"
    }
  }

  if (importedName === "createTailwindMerge") {
    const hasVariadicCall = references.some((reference) => {
      const call = reference.getParentIfKind(SyntaxKind.CallExpression)
      return (
        call !== undefined &&
        call.getExpression().getStart() === reference.getStart() &&
        call.getArguments().length > 1
      )
    })

    if (hasVariadicCall) {
      return "variadic createTailwindMerge calls are not supported by cn"
    }
  }

  return null
}

export function getAvailableLocalName(
  sourceFile: SourceFile,
  preferred: string,
  fallback: string
) {
  const names = new Set(
    sourceFile
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((identifier) => identifier.getText())
  )

  if (!names.has(preferred)) {
    return preferred
  }
  if (!names.has(fallback)) {
    return fallback
  }

  let index = 2
  while (names.has(`${fallback}${index}`)) {
    index++
  }
  return `${fallback}${index}`
}

export function getRequiredPackage(call: Node) {
  if (
    !Node.isCallExpression(call) ||
    call.getExpression().getText() !== "require"
  ) {
    return null
  }

  const args = call.getArguments()
  if (args.length !== 1 || !Node.isStringLiteral(args[0])) {
    return null
  }

  const value = args[0].getLiteralValue()
  return isOldModule(value) ? value : null
}

function isOldModule(value: string): value is OldModule {
  return value === "clsx" || value === "clsx/lite" || value === "tailwind-merge"
}
