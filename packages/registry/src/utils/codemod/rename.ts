import {
  traverse,
  type NodePath,
  type types as t,
  type Visitor,
} from "@babel/core"

import { applyManipulation } from "./edits"
import { parseModule } from "./parse"

type Scope = NodePath["scope"]

// ts-morph's VariableDeclaration#rename(newName), which renames through
// TypeScript's language service: the declaration and every reference that
// resolves to it. Shorthand properties and `export { name }` take the new name
// as is, since ts-morph does not ask for prefix and suffix text.
export function renameVariable(
  code: string,
  declarationStart: number,
  newName: string
) {
  const declarators: NodePath<t.VariableDeclarator>[] = []
  const identifiers: NodePath<t.Identifier | t.JSXIdentifier>[] = []

  traverseWithoutCollisionChecks(parseModule(code), {
    VariableDeclarator(path) {
      declarators.push(path)
    },
    Identifier(path) {
      identifiers.push(path)
    },
    JSXIdentifier(path) {
      identifiers.push(path)
    },
  })

  const declaration = declarators.find(
    (path) => path.node.id.start === declarationStart
  )!
  const { id } = declaration.node
  if (id.type !== "Identifier") {
    // ts-morph's own message, with TypeScript's names for the patterns.
    const patternKind =
      id.type === "ArrayPattern"
        ? "ArrayBindingPattern"
        : "ObjectBindingPattern"
    throw new Error(`Not implemented renameable scenario for ${patternKind}.`)
  }

  const binding = declaration.scope.getBinding(id.name)!
  // TypeScript gives a redeclaration a symbol of its own, so it keeps its
  // name. Babel records it like an assignment to the first declaration.
  const redeclarations = new Set<t.Node>(
    binding.constantViolations
      .filter(
        (violation) =>
          violation.isVariableDeclarator() || violation.isDeclaration()
      )
      .flatMap(
        (violation) => violation.getBindingIdentifiers(true)[id.name] ?? []
      )
  )
  const edits = identifiers
    .filter(
      (path) =>
        path.node.name === id.name &&
        isReference(path) &&
        path.scope.getBinding(id.name) === binding &&
        !redeclarations.has(path.node)
    )
    .map((path) => ({
      start: path.node.start!,
      // An identifier's range includes its type annotation.
      end: path.node.start! + id.name.length,
      text: newName,
    }))

  return applyManipulation(code, edits)
}

// Whether the identifier refers to a binding, as opposed to a property or
// member name, a type, a label or an intrinsic JSX element.
function isReference(path: NodePath<t.Identifier | t.JSXIdentifier>) {
  const { parent, key } = path

  switch (parent.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      return key !== "property" || parent.computed
    case "JSXMemberExpression":
      return key === "object"
    // A shorthand property has a key and a value at the same position. The
    // value is the reference.
    case "ObjectProperty":
    case "ObjectMethod":
    case "ClassMethod":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "TSPropertySignature":
    case "TSMethodSignature":
      return key !== "key" || parent.computed
    case "ExportSpecifier":
      // In `export { name }`, the exported name is the same token as the local.
      return key === "local"
    case "TSQualifiedName":
      return key === "left"
    case "JSXOpeningElement":
    case "JSXClosingElement":
      // TypeScript treats a lowercase or dashed tag name as an intrinsic
      // element, not a reference.
      return !/^[a-z]|-/.test(path.node.name)
    // An import declares a binding of its own.
    case "ImportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
      return false
    // A type name, a #private name, an attribute or namespaced JSX name, or a
    // label.
    case "TSTypeReference":
    case "PrivateName":
    case "JSXAttribute":
    case "JSXNamespacedName":
    case "LabeledStatement":
    case "BreakStatement":
    case "ContinueStatement":
      return false
    default:
      return true
  }
}

// Babel's scope tracker throws on a redeclared binding, such as a layout that
// imports `cn` twice, while TypeScript's rename tolerates it. Babel has no
// option to skip the check, so it is turned off while the file is traversed.
function traverseWithoutCollisionChecks(file: t.File, visitor: Visitor) {
  const scopePrototype = getScopePrototype()
  const checkBlockScopedCollisions = scopePrototype.checkBlockScopedCollisions
  scopePrototype.checkBlockScopedCollisions = () => {}

  try {
    traverse(file, visitor)
  } finally {
    scopePrototype.checkBlockScopedCollisions = checkBlockScopedCollisions
  }
}

// @babel/core does not export the Scope class, so take it from a scope.
function getScopePrototype(): Scope {
  const programs: NodePath<t.Program>[] = []
  traverse(parseModule(""), {
    Program(path) {
      programs.push(path)
    },
  })
  return Object.getPrototypeOf(programs[0].scope)
}
