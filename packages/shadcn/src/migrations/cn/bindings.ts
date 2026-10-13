import {
  Node,
  SyntaxKind,
  type ArrowFunction,
  type CallExpression,
  type FunctionDeclaration,
  type FunctionExpression,
  type Identifier,
  type SourceFile,
  type VariableStatement,
} from "ts-morph"

import type { Binding, OldPackage } from "./types"

export function collapseCanonicalWrappers(
  sourceFile: SourceFile,
  bindings: Binding[],
  migratedPackages: Set<OldPackage>
) {
  const clsxBindings = getClsxBindings(bindings).filter(
    (binding) => binding.kind === "esm"
  )
  const twMergeBindings = getTwMergeBindings(bindings).filter(
    (binding) => binding.kind === "esm"
  )
  let changes = 0
  const candidates: Array<{
    statement: FunctionDeclaration | VariableStatement
    name: Identifier
    expression: Node
    restName: string
    isInlineExport: boolean
    isDefaultExport: boolean
  }> = []

  for (const declaration of sourceFile.getFunctions()) {
    const name = declaration.getNameNode()
    if (!name) {
      continue
    }

    const data = getFunctionWrapperData(declaration)
    if (data) {
      candidates.push({
        statement: declaration,
        name,
        ...data,
        isInlineExport:
          declaration.isExported() && !declaration.isDefaultExport(),
        isDefaultExport: declaration.isDefaultExport(),
      })
    }
  }

  for (const statement of sourceFile.getVariableStatements()) {
    if (statement.getDeclarations().length !== 1) {
      continue
    }

    const declaration = statement.getDeclarations()[0]
    const name = declaration.getNameNode()
    const initializer = declaration.getInitializer()
    if (
      !Node.isIdentifier(name) ||
      (!Node.isArrowFunction(initializer) &&
        !Node.isFunctionExpression(initializer))
    ) {
      continue
    }

    const data = getFunctionWrapperData(initializer)
    if (data) {
      candidates.push({
        statement,
        name,
        ...data,
        isInlineExport: statement.isExported(),
        isDefaultExport: false,
      })
    }
  }

  for (const candidate of candidates) {
    if (
      !isCanonicalComposition(
        candidate.expression,
        candidate.restName,
        clsxBindings,
        twMergeBindings
      )
    ) {
      continue
    }

    const references = candidate.name.findReferencesAsNodes()
    const exportSpecifiers = references
      .map((reference) => reference.getParentIfKind(SyntaxKind.ExportSpecifier))
      .filter((specifier) => specifier !== undefined)

    if (references.length !== exportSpecifiers.length) {
      continue
    }

    if (
      !candidate.isInlineExport &&
      !candidate.isDefaultExport &&
      !exportSpecifiers.length
    ) {
      continue
    }

    const exportedNames = new Set<string>()
    if (candidate.isInlineExport) {
      exportedNames.add(candidate.name.getText())
    }
    if (candidate.isDefaultExport) {
      exportedNames.add("default")
    }

    for (const specifier of exportSpecifiers) {
      exportedNames.add(
        specifier.getAliasNode()?.getText() ?? specifier.getNameNode().getText()
      )
      const exportDeclaration = specifier.getExportDeclaration()
      if (exportDeclaration.getNamedExports().length === 1) {
        exportDeclaration.remove()
      } else {
        specifier.remove()
      }
    }

    const statementIndex = sourceFile
      .getStatements()
      .findIndex((statement) => statement === candidate.statement)
    candidate.statement.remove()
    sourceFile.insertExportDeclaration(Math.max(statementIndex, 0), {
      moduleSpecifier: "cn",
      namedExports: Array.from(exportedNames).map((exportedName) => ({
        name: "cn",
        alias: exportedName === "cn" ? undefined : exportedName,
      })),
    })
    migratedPackages.add("clsx")
    migratedPackages.add("tailwind-merge")
    changes++
  }

  return changes
}

function getFunctionWrapperData(
  declaration: FunctionDeclaration | ArrowFunction | FunctionExpression
) {
  const parameters = declaration.getParameters()
  if (parameters.length !== 1 || !parameters[0].isRestParameter()) {
    return null
  }

  const parameterName = parameters[0].getNameNode()
  const body = declaration.getBody()
  if (!Node.isIdentifier(parameterName) || !body) {
    return null
  }

  if (!Node.isBlock(body)) {
    return { expression: body, restName: parameterName.getText() }
  }

  const statements = body.getStatements()
  if (statements.length !== 1 || !Node.isReturnStatement(statements[0])) {
    return null
  }

  const expression = statements[0].getExpression()
  return expression ? { expression, restName: parameterName.getText() } : null
}

function isCanonicalComposition(
  node: Node,
  restName: string,
  clsxBindings: Binding[],
  twMergeBindings: Binding[]
) {
  if (!Node.isCallExpression(node) || !isBoundCall(node, twMergeBindings)) {
    return false
  }

  const args = node.getArguments()
  if (
    args.length !== 1 ||
    !Node.isCallExpression(args[0]) ||
    !isBoundCall(args[0], clsxBindings)
  ) {
    return false
  }

  const clsxArgs = args[0].getArguments()
  if (clsxArgs.length !== 1) {
    return false
  }

  const argument = clsxArgs[0]
  if (Node.isIdentifier(argument)) {
    return argument.getText() === restName
  }

  return (
    Node.isSpreadElement(argument) &&
    Node.isIdentifier(argument.getExpression()) &&
    argument.getExpression().getText() === restName
  )
}

export function findCompositions(sourceFile: SourceFile, bindings: Binding[]) {
  const clsxBindings = getClsxBindings(bindings)
  const twMergeBindings = getTwMergeBindings(bindings)
  const compositions: Array<{
    outerCall: CallExpression
    argumentsText: string
    kind: Binding["kind"]
  }> = []

  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    const twMergeBinding = findBindingForCall(call, twMergeBindings)
    if (!twMergeBinding) {
      continue
    }

    let hasClsxCall = false
    const args = call.getArguments().flatMap((argument) => {
      const clsxBinding = findBindingForCall(argument, clsxBindings)
      if (!clsxBinding || clsxBinding.kind !== twMergeBinding.kind) {
        return [argument.getText()]
      }

      hasClsxCall = true
      const innerArguments = formatCnArguments(argument)
      return innerArguments ? [innerArguments] : []
    })

    if (hasClsxCall) {
      compositions.push({
        outerCall: call,
        argumentsText: args.join(", "),
        kind: twMergeBinding.kind,
      })
    }
  }

  return compositions
}

function getClsxBindings(bindings: Binding[]) {
  return bindings.filter(
    (binding) =>
      binding.module.startsWith("clsx") &&
      (binding.importedName === "default" || binding.importedName === "clsx")
  )
}

function getTwMergeBindings(bindings: Binding[]) {
  return bindings.filter(
    (binding) =>
      binding.module === "tailwind-merge" && binding.importedName === "twMerge"
  )
}

function isBoundCall(call: Node, bindings: Binding[]) {
  return findBindingForCall(call, bindings) !== null
}

function findBindingForCall(call: Node, bindings: Binding[]) {
  if (!Node.isCallExpression(call)) {
    return null
  }

  const expression = call.getExpression()
  if (!Node.isIdentifier(expression)) {
    return null
  }

  return (
    bindings.find(
      (binding) =>
        binding.localName === expression.getText() &&
        binding.identifier
          .findReferencesAsNodes()
          .some((reference) => reference.getStart() === expression.getStart())
    ) ?? null
  )
}

function formatCnArguments(call: Node) {
  if (!Node.isCallExpression(call)) {
    return ""
  }

  return call
    .getArguments()
    .map((argument) => {
      if (!Node.isIdentifier(argument)) {
        return argument.getText()
      }

      const functionLike = argument.getFirstAncestor((ancestor) =>
        Node.isFunctionLikeDeclaration(ancestor)
      )
      const restParameter = functionLike
        ?.getParameters()
        .find(
          (parameter) =>
            parameter.isRestParameter() &&
            parameter.getNameNode().getText() === argument.getText()
        )

      return restParameter ? `...${argument.getText()}` : argument.getText()
    })
    .join(", ")
}
