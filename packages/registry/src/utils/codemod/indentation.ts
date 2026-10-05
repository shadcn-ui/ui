import { types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import { parseModule } from "./parse"
import { isLineBreak, isWhiteSpaceSingleLine } from "./trivia"

// ts-morph indents with four spaces, and TypeScript counts a tab as four.
const INDENT_SIZE = 4
const TAB_SIZE = 4

// The parents nodeWillIndentChild indents any child of.
const ALWAYS_INDENTING_PARENTS = new Set([
  "ExpressionStatement",
  "ClassDeclaration",
  "ClassExpression",
  "InterfaceDeclaration",
  "EnumDeclaration",
  "TypeAliasDeclaration",
  "ArrayLiteralExpression",
  "Block",
  "ModuleBlock",
  "ObjectLiteralExpression",
  "TypeLiteral",
  "MappedType",
  "TupleType",
  "ParenthesizedExpression",
  "PropertyAccessExpression",
  "CallExpression",
  "NewExpression",
  "VariableStatement",
  "ExportAssignment",
  "ReturnStatement",
  "ConditionalExpression",
  "ArrayBindingPattern",
  "ObjectBindingPattern",
  "JsxOpeningElement",
  "JsxOpeningFragment",
  "JsxSelfClosingElement",
  "JsxExpression",
  "MethodSignature",
  "CallSignature",
  "ConstructSignature",
  "Parameter",
  "FunctionType",
  "ConstructorType",
  "ParenthesizedType",
  "TaggedTemplateExpression",
  "AwaitExpression",
  "NamedExports",
  "NamedImports",
  "ExportSpecifier",
  "ImportSpecifier",
  "PropertyDeclaration",
  "CaseClause",
  "DefaultClause",
  "CaseBlock",
])

// TypeScript's isDeclaration.
const DECLARATION_KINDS = new Set([
  "ArrowFunction",
  "BindingElement",
  "ClassDeclaration",
  "ClassExpression",
  "ClassStaticBlockDeclaration",
  "Constructor",
  "EnumDeclaration",
  "EnumMember",
  "ExportSpecifier",
  "FunctionDeclaration",
  "FunctionExpression",
  "GetAccessor",
  "ImportClause",
  "ImportEqualsDeclaration",
  "ImportSpecifier",
  "InterfaceDeclaration",
  "JsxAttribute",
  "MethodDeclaration",
  "MethodSignature",
  "ModuleDeclaration",
  "NamespaceImport",
  "Parameter",
  "PropertyAssignment",
  "PropertyDeclaration",
  "PropertySignature",
  "SetAccessor",
  "ShorthandPropertyAssignment",
  "TypeAliasDeclaration",
  "TypeParameter",
  "VariableDeclaration",
])

// TypeScript's isStatementButNotDeclaration.
const STATEMENT_KINDS = new Set([
  "BreakStatement",
  "ContinueStatement",
  "DebuggerStatement",
  "DoStatement",
  "ExpressionStatement",
  "EmptyStatement",
  "ForInStatement",
  "ForOfStatement",
  "ForStatement",
  "IfStatement",
  "LabeledStatement",
  "ReturnStatement",
  "SwitchStatement",
  "ThrowStatement",
  "TryStatement",
  "VariableStatement",
  "WhileStatement",
  "WithStatement",
])

// The nodes getListByRange looks for a list in.
const LIST_CONTAINER_KINDS = new Set([
  "ObjectLiteralExpression",
  "ArrayLiteralExpression",
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunction",
  "MethodDeclaration",
  "Constructor",
  "GetAccessor",
  "CallExpression",
  "NewExpression",
  "VariableDeclarationList",
  "ObjectBindingPattern",
  "ArrayBindingPattern",
])

const CONTROL_FLOW_ENDING_KINDS = new Set([
  "ReturnStatement",
  "ThrowStatement",
  "ContinueStatement",
  "BreakStatement",
])

// A node of the TypeScript syntax tree, rebuilt from Babel's AST with what
// the smart indenter reads. kind is a TypeScript SyntaxKind name.
interface SyntaxNode {
  kind: string
  start: number
  end: number
  parent?: SyntaxNode
  children: SyntaxNode[]
  lists: NodeList[]
  // Set on a CallExpression.
  callee?: SyntaxNode
  arguments?: SyntaxNode[]
}

// A TypeScript NodeArray, such as a call's arguments. getVisualListRange
// places it between its delimiters.
interface NodeList {
  pos: number
  visibleStart: number
  visibleEnd: number
  items: SyntaxNode[]
}

interface Token {
  label: string
  start: number
  end: number
}

// Comments are tokens too, with a string type.
interface BabelToken {
  type: string | { label: string }
  start: number
  end: number
}

interface LineAndCharacter {
  line: number
  character: number
}

interface Source {
  code: string
  // Without comments and whitespace-only JSX text.
  tokens: Token[]
  lineStarts: number[]
}

// ts-morph's Node#replaceWithText(text) writes text through a code-block-writer
// with the node's indentation queued, so the lines after the first are
// indented to the node at position.
export function getReplacementText(
  code: string,
  position: number,
  text: string
) {
  if (!text.includes("\n")) {
    return text
  }

  const writer = new CodeBlockWriter()
  writer.queueIndentationLevel(
    getIndentationAtPosition(code, position) / INDENT_SIZE
  )
  writer.write(text)

  return writer.toString()
}

// TypeScript's SmartIndenter.getIndentation, which ts-morph calls through the
// language service's getIndentationAtPosition. Ported for positions at the
// start of a node inside JSX: the comment and literal special cases are left
// out, and getSmartIndent never assumes a new line before a closing brace.
function getIndentationAtPosition(code: string, position: number) {
  const file = parseModule(code, { tokens: true })
  const source: Source = {
    code,
    tokens: getTokens(code, file),
    lineStarts: getLineStarts(code),
  }

  const precedingTokenIndex = findPrecedingTokenIndex(source, position)
  if (precedingTokenIndex === -1) {
    return 0
  }

  const precedingToken = getTokenNode(
    buildSyntaxTree(source, file.program),
    source.tokens[precedingTokenIndex]
  )
  const tokenParent = precedingToken.parent!

  if (
    precedingToken.kind === "CommaToken" &&
    tokenParent.kind !== "BinaryExpression"
  ) {
    const indentation = getIndentationForListItemBeforeComma(
      source,
      precedingToken
    )
    if (indentation !== -1) {
      return indentation
    }
  }

  const containerList = getListByRange(position, position, tokenParent)
  if (containerList && !isInList(containerList, precedingToken)) {
    return getListStartIndentation(source, containerList) + INDENT_SIZE
  }

  return getSmartIndent(
    source,
    position,
    precedingToken,
    source.tokens[precedingTokenIndex + 1]
  )
}

function getSmartIndent(
  source: Source,
  position: number,
  precedingToken: SyntaxNode,
  nextToken: Token | undefined
) {
  const lineAtPosition = getLine(source, position)

  let previous: SyntaxNode | undefined
  let current: SyntaxNode | undefined = precedingToken
  while (current) {
    if (
      positionBelongsToNode(current, position) &&
      shouldIndentChildNode(source, current, previous)
    ) {
      const currentStart = getLineAndCharacter(source, current.start)
      const indentationDelta =
        isNextTokenCurlyBraceOnSameLineAsCursor(
          source,
          nextToken,
          current,
          lineAtPosition
        ) || lineAtPosition === currentStart.line
          ? 0
          : INDENT_SIZE
      return getIndentationForNodeWorker(
        source,
        current,
        currentStart,
        indentationDelta
      )
    }

    const indentation = getIndentationForListItem(source, current, true)
    if (indentation !== -1) {
      return indentation
    }

    previous = current
    current = current.parent
  }

  return 0
}

function getIndentationForNodeWorker(
  source: Source,
  current: SyntaxNode,
  currentStart: LineAndCharacter,
  indentationDelta: number
) {
  let parent = current.parent
  while (parent) {
    const containingList = getContainingList(current)
    const containingListOrParentStart = getLineAndCharacter(
      source,
      containingList ? containingList.pos : parent.start
    )
    const parentAndChildShareLine =
      containingListOrParentStart.line === currentStart.line

    const firstListItem = containingList?.items[0]
    const listIndentsChild =
      !!firstListItem &&
      getLine(source, firstListItem.start) > containingListOrParentStart.line
    const indentation = getIndentationForListItem(
      source,
      current,
      listIndentsChild
    )
    if (indentation !== -1) {
      return indentation + indentationDelta
    }

    // getActualIndentationForNode.
    if (
      (DECLARATION_KINDS.has(current.kind) ||
        STATEMENT_KINDS.has(current.kind)) &&
      (parent.kind === "SourceFile" || !parentAndChildShareLine)
    ) {
      return getLineIndentation(source, currentStart) + indentationDelta
    }

    if (
      shouldIndentChildNode(source, parent, current) &&
      !parentAndChildShareLine
    ) {
      indentationDelta += INDENT_SIZE
    }

    const useTrueStart = isArgumentAndStartLineOverlapsExpressionBeingCalled(
      source,
      parent,
      current,
      currentStart.line
    )
    current = parent
    parent = current.parent
    currentStart = useTrueStart
      ? getLineAndCharacter(source, current.start)
      : containingListOrParentStart
  }

  return indentationDelta
}

function getIndentationForListItemBeforeComma(
  source: Source,
  comma: SyntaxNode
) {
  const list = comma.parent!.lists.find((list) => isInList(list, comma))
  if (!list) {
    return -1
  }

  const itemsBeforeComma = list.items.filter(
    (item) => item.end <= comma.start
  ).length
  if (itemsBeforeComma === 0) {
    return -1
  }

  return deriveIndentationFromList(source, list.items, itemsBeforeComma - 1)
}

// getActualIndentationForListItem.
function getIndentationForListItem(
  source: Source,
  node: SyntaxNode,
  listIndentsChild: boolean
) {
  if (node.parent?.kind === "VariableDeclarationList") {
    return -1
  }

  const list = getContainingList(node)
  if (!list) {
    return -1
  }

  const index = list.items.indexOf(node)
  if (index !== -1) {
    const indentation = deriveIndentationFromList(source, list.items, index)
    if (indentation !== -1) {
      return indentation
    }
  }

  return (
    getListStartIndentation(source, list) + (listIndentsChild ? INDENT_SIZE : 0)
  )
}

// deriveActualIndentationFromList: the indentation of the first item on the
// item's line, when an earlier item ends on another line.
function deriveIndentationFromList(
  source: Source,
  items: SyntaxNode[],
  index: number
) {
  let lineAndCharacter = getLineAndCharacter(source, items[index].start)
  for (let i = index - 1; i >= 0; i--) {
    if (getLine(source, items[i].end) !== lineAndCharacter.line) {
      return getLineIndentation(source, lineAndCharacter)
    }
    lineAndCharacter = getLineAndCharacter(source, items[i].start)
  }

  return -1
}

function getListStartIndentation(source: Source, list: NodeList) {
  return getLineIndentation(source, getLineAndCharacter(source, list.pos))
}

// findColumnForFirstNonWhitespaceCharacterInLine.
function getLineIndentation(
  source: Source,
  { line, character }: LineAndCharacter
) {
  const lineStart = source.lineStarts[line]

  let column = 0
  for (let pos = lineStart; pos < lineStart + character; pos++) {
    const char = source.code[pos]
    if (!isWhiteSpaceSingleLine(char)) {
      break
    }
    // TypeScript's own formula for a tab.
    column += char === "\t" ? TAB_SIZE + (column % TAB_SIZE) : 1
  }

  return column
}

function getContainingList(node: SyntaxNode) {
  return node.parent && getListByRange(node.start, node.end, node.parent)
}

function getListByRange(start: number, end: number, node: SyntaxNode) {
  if (!LIST_CONTAINER_KINDS.has(node.kind)) {
    return undefined
  }

  return node.lists.find(
    (list) => list.visibleStart <= start && end <= list.visibleEnd
  )
}

function isInList(list: NodeList, node: SyntaxNode) {
  return list.visibleStart <= node.start && node.end <= list.visibleEnd
}

// A case clause is never complete, since more statements can follow.
function positionBelongsToNode(node: SyntaxNode, position: number) {
  return (
    position < node.end ||
    node.kind === "CaseClause" ||
    node.kind === "DefaultClause"
  )
}

// shouldIndentChildNode for the next child, which is the only kind of child
// getSmartIndent asks about.
function shouldIndentChildNode(
  source: Source,
  parent: SyntaxNode,
  child: SyntaxNode | undefined
) {
  const isControlFlowEnding =
    !!child &&
    CONTROL_FLOW_ENDING_KINDS.has(child.kind) &&
    parent.kind !== "Block"

  return nodeWillIndentChild(source, parent, child) && !isControlFlowEnding
}

function nodeWillIndentChild(
  source: Source,
  parent: SyntaxNode,
  child: SyntaxNode | undefined
) {
  if (ALWAYS_INDENTING_PARENTS.has(parent.kind)) {
    return true
  }

  switch (parent.kind) {
    case "VariableDeclaration":
    case "PropertyAssignment":
    case "BinaryExpression":
      if (child?.kind === "ObjectLiteralExpression") {
        return isOnOneLine(source, child)
      }
      if (parent.kind === "BinaryExpression" && child?.kind === "JsxElement") {
        return getLine(source, parent.start) !== getLine(source, child.start)
      }
      return parent.kind !== "BinaryExpression"
    case "DoStatement":
    case "WhileStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "ForStatement":
    case "IfStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "MethodDeclaration":
    case "Constructor":
    case "GetAccessor":
    case "SetAccessor":
      return child?.kind !== "Block"
    case "ArrowFunction":
      if (child?.kind === "ParenthesizedExpression") {
        return isOnOneLine(source, child)
      }
      return child?.kind !== "Block"
    case "JsxElement":
      return child?.kind !== "JsxClosingElement"
    case "JsxFragment":
      return child?.kind !== "JsxClosingFragment"
    default:
      return false
  }
}

function isNextTokenCurlyBraceOnSameLineAsCursor(
  source: Source,
  nextToken: Token | undefined,
  current: SyntaxNode,
  lineAtPosition: number
) {
  if (!nextToken || nextToken.end > current.end) {
    return false
  }

  return (
    nextToken.label === "{" ||
    (nextToken.label === "}" &&
      getLine(source, nextToken.start) === lineAtPosition)
  )
}

function isArgumentAndStartLineOverlapsExpressionBeingCalled(
  source: Source,
  parent: SyntaxNode,
  child: SyntaxNode,
  childStartLine: number
) {
  return (
    parent.kind === "CallExpression" &&
    parent.arguments!.includes(child) &&
    getLine(source, parent.callee!.end) === childStartLine
  )
}

function isOnOneLine(source: Source, node: SyntaxNode) {
  return getLine(source, node.start) === getLine(source, node.end)
}

function getTokens(code: string, file: t.File) {
  const babelTokens: BabelToken[] = file.tokens ?? []
  const tokens: Token[] = []

  for (const { type, start, end } of babelTokens) {
    if (typeof type === "string") {
      continue
    }
    if (type.label === "jsxText" && /^\s*$/.test(code.slice(start, end))) {
      continue
    }
    tokens.push({ label: type.label, start, end })
  }

  return tokens
}

// The index of the last token that ends at or before position.
function findPrecedingTokenIndex(source: Source, position: number) {
  let index = -1
  for (let i = 0; i < source.tokens.length; i++) {
    const token = source.tokens[i]
    if (token.start >= position) {
      break
    }
    if (token.end <= position) {
      index = i
    }
  }

  return index
}

function findToken(source: Source, from: number, label: string) {
  return source.tokens.find(
    (token) => token.start >= from && token.label === label
  )
}

// The node findPrecedingToken returns for a token: the leaf node that is the
// token, or a token node under the deepest node that contains it.
function getTokenNode(root: SyntaxNode, token: Token): SyntaxNode {
  let node = root
  for (;;) {
    const child = node.children.find(
      (child) => child.start <= token.start && token.end <= child.end
    )
    if (!child) {
      break
    }
    if (
      child.start === token.start &&
      child.end === token.end &&
      child.children.length === 0
    ) {
      return child
    }
    node = child
  }

  return {
    kind: token.label === "," ? "CommaToken" : "Token",
    start: token.start,
    end: token.end,
    parent: node,
    children: [],
    lists: [],
  }
}

// TypeScript's computeLineStarts.
function getLineStarts(code: string) {
  const lineStarts = [0]
  for (let pos = 0; pos < code.length; pos++) {
    if (code[pos] === "\r" && code[pos + 1] === "\n") {
      continue
    }
    if (isLineBreak(code[pos])) {
      lineStarts.push(pos + 1)
    }
  }

  return lineStarts
}

function getLine(source: Source, pos: number) {
  let low = 0
  let high = source.lineStarts.length - 1
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if (source.lineStarts[middle] <= pos) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

function getLineAndCharacter(source: Source, pos: number): LineAndCharacter {
  const line = getLine(source, pos)
  return { line, character: pos - source.lineStarts[line] }
}

function buildSyntaxTree(source: Source, program: t.Program) {
  const root = createNode("SourceFile", 0, source.code.length)
  const statements = [...program.directives, ...program.body].sort(
    (a, b) => a.start! - b.start!
  )
  addChildren(source, root, statements)
  sortChildren(root)

  return root
}

function sortChildren(node: SyntaxNode) {
  node.children.sort((a, b) => a.start - b.start || b.end - a.end)
  for (const child of node.children) {
    sortChildren(child)
  }
}

function createNode(kind: string, start: number, end: number): SyntaxNode {
  return { kind, start, end, children: [], lists: [] }
}

function addChild(parent: SyntaxNode, child: SyntaxNode) {
  child.parent = parent
  parent.children.push(child)
  return child
}

// Converts the nodes and adds them to the parent. Returns the converted nodes.
function addChildren(
  source: Source,
  parent: SyntaxNode,
  nodes: (t.Node | null | undefined)[]
) {
  const children: SyntaxNode[] = []
  for (const node of nodes) {
    const child = node && convertNode(source, node)
    if (child) {
      children.push(addChild(parent, child))
    }
  }

  return children
}

function addList(
  parent: SyntaxNode,
  items: SyntaxNode[],
  open?: number,
  close?: number
) {
  const itemsStart = items.length > 0 ? items[0].start : parent.start
  const itemsEnd = items.length > 0 ? items[items.length - 1].end : parent.start
  // Without both delimiters, the list spans its items.
  const hasDelimiters = open !== undefined && close !== undefined

  parent.lists.push({
    pos: open ?? itemsStart,
    visibleStart: hasDelimiters ? open : itemsStart,
    visibleEnd: hasDelimiters ? close : itemsEnd,
    items,
  })
}

// The Babel nodes directly under node, in no particular order.
function getChildNodes(node: t.Node) {
  const fields = node as unknown as Record<string, unknown>
  const children: t.Node[] = []
  for (const key of t.VISITOR_KEYS[node.type]) {
    const value = fields[key]
    for (const child of Array.isArray(value) ? value : [value]) {
      if (t.isNode(child)) {
        children.push(child)
      }
    }
  }

  return children
}

// A node of kind with the TypeScript nodes for all of node's children.
function convertWithChildren(
  source: Source,
  node: t.Node,
  kind: string,
  start: number
) {
  const converted = createNode(kind, start, node.end!)
  addChildren(source, converted, getChildNodes(node))
  return converted
}

// Babel and TypeScript trees differ in shape, so each Babel node becomes the
// TypeScript node the indenter expects. start overrides node.start for a
// declaration whose `export` keyword TypeScript treats as a modifier.
function convertNode(
  source: Source,
  node: t.Node,
  start = node.start!
): SyntaxNode | null {
  switch (node.type) {
    case "Directive":
      return createNode("ExpressionStatement", start, node.end!)
    case "ExportNamedDeclaration":
      return node.declaration
        ? convertNode(source, node.declaration, start)
        : convertWithChildren(source, node, "ExportDeclaration", start)
    case "ExportDefaultDeclaration":
      return convertExportDefault(source, node, start)
    case "VariableDeclaration":
      return convertVariableStatement(source, node, start)
    case "VariableDeclarator":
      return convertWithChildren(source, node, "VariableDeclaration", start)
    case "FunctionDeclaration":
    case "TSDeclareFunction":
    case "FunctionExpression":
    case "ArrowFunctionExpression":
    case "ObjectMethod":
    case "ClassMethod":
      return convertFunction(source, node, start)
    case "BlockStatement": {
      const block = createNode("Block", start, node.end!)
      addChildren(source, block, node.body)
      return block
    }
    case "ClassDeclaration":
    case "ClassExpression": {
      const classNode = createNode(node.type, start, node.end!)
      addChildren(source, classNode, [node.id, node.superClass])
      addChildren(source, classNode, node.body.body)
      return classNode
    }
    case "CallExpression":
    case "OptionalCallExpression":
    case "NewExpression":
      return convertCall(source, node, start)
    case "MemberExpression":
    case "OptionalMemberExpression":
      return convertWithChildren(
        source,
        node,
        node.computed ? "ElementAccessExpression" : "PropertyAccessExpression",
        start
      )
    case "LogicalExpression":
    case "BinaryExpression":
    case "AssignmentExpression":
    case "SequenceExpression":
      return convertWithChildren(source, node, "BinaryExpression", start)
    case "ArrayExpression": {
      const array = createNode("ArrayLiteralExpression", start, node.end!)
      const elements = addChildren(source, array, node.elements)
      addList(array, elements, start + 1, node.end! - 1)
      return array
    }
    case "ObjectExpression": {
      const object = createNode("ObjectLiteralExpression", start, node.end!)
      const properties = addChildren(source, object, node.properties)
      addList(object, properties, start + 1, node.end! - 1)
      return object
    }
    case "ObjectProperty":
      return convertWithChildren(
        source,
        node,
        node.shorthand ? "ShorthandPropertyAssignment" : "PropertyAssignment",
        start
      )
    case "ClassProperty":
      return convertWithChildren(source, node, "PropertyDeclaration", start)
    case "ObjectPattern":
    case "ArrayPattern":
      return convertBindingPattern(source, node, start)
    case "SwitchStatement": {
      const statement = createNode("SwitchStatement", start, node.end!)
      addChildren(source, statement, [node.discriminant])
      const caseBlock = addChild(
        statement,
        createNode("CaseBlock", node.discriminant.end!, node.end!)
      )
      addChildren(source, caseBlock, node.cases)
      return statement
    }
    case "SwitchCase":
      return convertWithChildren(
        source,
        node,
        node.test ? "CaseClause" : "DefaultClause",
        start
      )
    case "JSXElement":
      return convertJsxElement(source, node, start)
    case "JSXFragment": {
      const fragment = createNode("JsxFragment", start, node.end!)
      addChild(
        fragment,
        createNode(
          "JsxOpeningFragment",
          node.openingFragment.start!,
          node.openingFragment.end!
        )
      )
      addChildren(source, fragment, node.children)
      addChild(
        fragment,
        createNode(
          "JsxClosingFragment",
          node.closingFragment.start!,
          node.closingFragment.end!
        )
      )
      return fragment
    }
    case "JSXText":
      return convertJsxText(source, node, start)
    case "JSXExpressionContainer":
    case "JSXSpreadChild": {
      const expression = createNode("JsxExpression", start, node.end!)
      if (node.expression.type !== "JSXEmptyExpression") {
        addChildren(source, expression, [node.expression])
      }
      return expression
    }
    case "JSXAttribute":
      return convertWithChildren(source, node, "JsxAttribute", start)
    case "JSXSpreadAttribute":
      return convertWithChildren(source, node, "JsxSpreadAttribute", start)
    case "TSAsExpression":
      return convertWithChildren(source, node, "AsExpression", start)
    case "TSSatisfiesExpression":
      return convertWithChildren(source, node, "SatisfiesExpression", start)
    case "TemplateLiteral":
      return convertWithChildren(
        source,
        node,
        node.expressions.length > 0
          ? "TemplateExpression"
          : "NoSubstitutionTemplateLiteral",
        start
      )
    case "DoWhileStatement":
      return convertWithChildren(source, node, "DoStatement", start)
    default:
      // Babel's name is TypeScript's for most statements and expressions.
      return convertWithChildren(source, node, node.type, start)
  }
}

function convertExportDefault(
  source: Source,
  node: t.ExportDefaultDeclaration,
  start: number
) {
  const { declaration } = node
  // Babel's types leave out the interface its TypeScript plugin parses here.
  if (
    declaration.type === "FunctionDeclaration" ||
    declaration.type === "ClassDeclaration" ||
    t.isTSInterfaceDeclaration(declaration)
  ) {
    return convertNode(source, declaration, start)
  }

  const exportAssignment = createNode("ExportAssignment", start, node.end!)
  addChildren(source, exportAssignment, [declaration])
  return exportAssignment
}

function convertVariableStatement(
  source: Source,
  node: t.VariableDeclaration,
  start: number
) {
  const statement = createNode("VariableStatement", start, node.end!)
  const declarationList = addChild(
    statement,
    createNode("VariableDeclarationList", node.start!, node.end!)
  )
  const declarations = addChildren(source, declarationList, node.declarations)
  addList(declarationList, declarations)

  return statement
}

type FunctionNode =
  | t.FunctionDeclaration
  | t.TSDeclareFunction
  | t.FunctionExpression
  | t.ArrowFunctionExpression
  | t.ObjectMethod
  | t.ClassMethod

function convertFunction(source: Source, node: FunctionNode, start: number) {
  const fn = createNode(getFunctionKind(node), start, node.end!)
  const body = node.type === "TSDeclareFunction" ? null : node.body

  let parametersSearchStart = start
  if (node.type === "ObjectMethod" || node.type === "ClassMethod") {
    addChildren(source, fn, [node.key])
    parametersSearchStart = node.key.end!
  } else if (node.type !== "ArrowFunctionExpression" && node.id) {
    addChildren(source, fn, [node.id])
    parametersSearchStart = node.id.end!
  }

  const { typeParameters } = node
  if (typeParameters) {
    const [declaration] = addChildren(source, fn, [typeParameters])
    addList(
      fn,
      declaration.children,
      typeParameters.start! + 1,
      typeParameters.end! - 1
    )
    parametersSearchStart = typeParameters.end!
  }

  const parameters = node.params.map((param) => {
    const parameter = addChild(
      fn,
      createNode("Parameter", param.start!, param.end!)
    )
    addChildren(
      source,
      parameter,
      param.type === "AssignmentPattern" ? [param.left, param.right] : [param]
    )
    return parameter
  })
  const openParen = findToken(source, parametersSearchStart, "(")
  if (openParen && openParen.start < (body ? body.start! : node.end!)) {
    const lastParameter = parameters[parameters.length - 1]
    const closeParen = findToken(
      source,
      lastParameter ? lastParameter.end : openParen.end,
      ")"
    )
    addList(fn, parameters, openParen.end, closeParen?.start)
  } else {
    addList(fn, parameters)
  }

  addChildren(source, fn, [node.returnType, body])

  return fn
}

function getFunctionKind(node: FunctionNode) {
  switch (node.type) {
    case "ArrowFunctionExpression":
      return "ArrowFunction"
    case "FunctionExpression":
      return "FunctionExpression"
    case "ObjectMethod":
    case "ClassMethod":
      if (node.kind === "constructor") {
        return "Constructor"
      }
      if (node.kind === "get") {
        return "GetAccessor"
      }
      if (node.kind === "set") {
        return "SetAccessor"
      }
      return "MethodDeclaration"
    default:
      return "FunctionDeclaration"
  }
}

function convertCall(
  source: Source,
  node: t.CallExpression | t.OptionalCallExpression | t.NewExpression,
  start: number
) {
  const call = createNode(
    node.type === "NewExpression" ? "NewExpression" : "CallExpression",
    start,
    node.end!
  )
  const typeArguments = node.typeParameters ?? node.typeArguments
  call.callee = addChildren(source, call, [node.callee])[0]
  addChildren(source, call, [typeArguments])
  call.arguments = addChildren(source, call, node.arguments)

  // A call ends with the closing parenthesis.
  const openParen = findToken(
    source,
    typeArguments ? typeArguments.end! : node.callee.end!,
    "("
  )
  if (openParen && openParen.start < node.end!) {
    addList(call, call.arguments, openParen.end, node.end! - 1)
  }

  return call
}

function convertBindingPattern(
  source: Source,
  node: t.ObjectPattern | t.ArrayPattern,
  start: number
) {
  const pattern = createNode(
    node.type === "ObjectPattern"
      ? "ObjectBindingPattern"
      : "ArrayBindingPattern",
    start,
    node.end!
  )

  const elements: SyntaxNode[] = []
  const babelElements: (t.Node | null)[] =
    node.type === "ObjectPattern" ? node.properties : node.elements
  for (const element of babelElements) {
    if (!element) {
      continue
    }
    const bindingElement = addChild(
      pattern,
      createNode("BindingElement", element.start!, element.end!)
    )
    addChildren(source, bindingElement, getBindingElementChildren(element))
    elements.push(bindingElement)
  }

  // With a type annotation, the pattern ends after it, not at its closing
  // brace or bracket.
  const close = node.typeAnnotation
    ? findLastClosingBracket(source, node.typeAnnotation.start!)
    : node.end! - 1
  addList(pattern, elements, start + 1, close)
  addChildren(source, pattern, [node.typeAnnotation])

  return pattern
}

// The name and initializer of a binding element.
function getBindingElementChildren(element: t.Node) {
  let parts: t.Node[] = [element]
  if (element.type === "ObjectProperty") {
    parts = element.shorthand ? [element.value] : [element.key, element.value]
  } else if (element.type === "RestElement") {
    parts = [element.argument]
  }

  const children: t.Node[] = []
  for (const part of parts) {
    if (part.type === "AssignmentPattern") {
      children.push(part.left, part.right)
    } else {
      children.push(part)
    }
  }

  return children
}

function findLastClosingBracket(source: Source, before: number) {
  let start: number | undefined
  for (const token of source.tokens) {
    if (token.end <= before && (token.label === "}" || token.label === "]")) {
      start = token.start
    }
  }

  return start
}

function convertJsxElement(source: Source, node: t.JSXElement, start: number) {
  const { openingElement } = node

  if (openingElement.selfClosing) {
    const element = createNode("JsxSelfClosingElement", start, node.end!)
    addJsxTagChildren(source, element, openingElement)
    return element
  }

  const element = createNode("JsxElement", start, node.end!)
  const opening = addChild(
    element,
    createNode("JsxOpeningElement", openingElement.start!, openingElement.end!)
  )
  addJsxTagChildren(source, opening, openingElement)
  addChildren(source, element, node.children)
  addChild(
    element,
    createNode(
      "JsxClosingElement",
      node.closingElement!.start!,
      node.closingElement!.end!
    )
  )

  return element
}

function addJsxTagChildren(
  source: Source,
  tag: SyntaxNode,
  openingElement: t.JSXOpeningElement
) {
  addChildren(source, tag, [openingElement.name])

  const { attributes } = openingElement
  if (attributes.length > 0) {
    const jsxAttributes = addChild(
      tag,
      createNode(
        "JsxAttributes",
        attributes[0].start!,
        attributes[attributes.length - 1].end!
      )
    )
    addChildren(source, jsxAttributes, attributes)
  }
}

// TypeScript has no node for whitespace-only JSX text, and JSX text starts
// after its leading whitespace.
function convertJsxText(source: Source, node: t.JSXText, start: number) {
  if (/^\s*$/.test(node.value)) {
    return null
  }

  while (/\s/.test(source.code[start])) {
    start++
  }

  return createNode("JsxText", start, node.end!)
}
