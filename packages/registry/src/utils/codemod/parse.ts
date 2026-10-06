import { types as t } from "@babel/core"
import {
  parse,
  type ParseResult,
  type ParserOptions,
  type ParserPlugin,
} from "@babel/parser"

import { isLineBreak, skipTrivia } from "./trivia"

// TypeScript parses any file and reports problems as diagnostics, so these
// options accept as much as Babel can and recover from errors instead of
// throwing on them.
const PARSER_OPTIONS: ParserOptions = {
  sourceType: "module",
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowUndeclaredExports: true,
  allowNewTargetOutsideFunction: true,
  allowSuperOutsideMethod: true,
  errorRecovery: true,
  // TypeScript keeps parentheses as ParenthesizedExpression nodes.
  createParenthesizedExpressions: true,
}

const PLUGINS: ParserPlugin[] = [
  "typescript",
  "decorators-legacy",
  // TypeScript 4.9's `accessor` class fields.
  "decoratorAutoAccessors",
]

// With errorRecovery, Babel also reports these, which TypeScript reports as
// semantic errors. They never make ts-morph reject an edit.
const SEMANTIC_ERROR_CODES = new Set([
  "VarRedeclaration",
  "DuplicateExport",
  "ModuleExportUndefined",
])

// How a file is parsed. TypeScript parses a .ts file without JSX, where
// `<Config>{}` is a type assertion, and other files with it.
export interface ParseOptions {
  // Defaults to true, as for a .tsx file.
  jsx?: boolean
}

type ParseModuleOptions = ParseOptions & { tokens?: boolean }

// ts-morph's SourceFile: the whole file, parsed even with syntax errors.
//
// TypeScript also parses past a comma where it expects an object literal
// member, as in `{ a: 1,, b: 2 }`: its parseDelimitedList reports "Property
// assignment expected." and skips the comma, so the tree has the members
// around it as if it were not there. ts-morph's edits write such commas (see
// insertIntoCommaSeparatedNodes), and only reject an edit whose tree is not
// the one they expect, so those edits go through, and a later edit often
// takes the comma out again. Babel throws on these commas, so each one is
// blanked out, which keeps every position, and the code parsed again. They
// are still syntax errors: see countSyntaxErrors.
export function parseModule(code: string, options: ParseModuleOptions = {}) {
  return parsePastSkippedCommas(code, code, options)
}

// text is code with the commas found so far blanked out. Each one is checked
// once the rest of the code parses.
function parsePastSkippedCommas(
  code: string,
  text: string,
  options: ParseModuleOptions
): ParseResult<t.File> {
  try {
    return parseAsWritten(text, options)
  } catch (error) {
    const pos = getErrorPos(error)
    if (pos === undefined || text[pos] !== ",") {
      throw error
    }

    const file = parsePastSkippedCommas(
      code,
      text.slice(0, pos) + " " + text.slice(pos + 1),
      options
    )
    if (!isSkippedComma(code, file, pos)) {
      throw error
    }
    return file
  }
}

function parseAsWritten(code: string, options: ParseModuleOptions) {
  const { jsx = true, tokens } = options
  return parse(code, {
    ...PARSER_OPTIONS,
    plugins: jsx ? [...PLUGINS, "jsx"] : PLUGINS,
    tokens,
  })
}

// Babel throws a SyntaxError with the position it gave up at.
function getErrorPos(error: unknown) {
  return error instanceof SyntaxError &&
    "pos" in error &&
    typeof error.pos === "number"
    ? error.pos
    : undefined
}

// Whether TypeScript skips the comma at pos, where Babel threw. In file, the
// code parsed with the comma blanked out, the comma goes between an object
// literal's members when the object is the innermost node around it.
// TypeScript skips it there unless a list the object is in takes the comma as
// its own, which ends the object: its isInSomeParsingContext.
function isSkippedComma(code: string, file: t.File, pos: number) {
  const nodes = getNodesAround(file.program, pos)
  const object = nodes[nodes.length - 1]
  if (object.type !== "ObjectExpression") {
    return false
  }

  return !nodes.some((node, index) => {
    switch (node.type) {
      // An array literal or pattern takes a comma between its elements.
      case "ArrayExpression":
      case "ArrayPattern":
        return true
      // JSX children take any token.
      case "JSXElement":
      case "JSXFragment":
        return node.children.some((child) => child === nodes[index + 1])
      // A variable declaration list ends at a token that starts a line,
      // where a semicolon could go.
      case "VariableDeclaration":
        return hasPrecedingLineBreak(code, object, pos)
      default:
        return false
    }
  })
}

// The nodes that contain pos, from node in.
function getNodesAround(node: t.Node, pos: number) {
  const nodes: t.Node[] = []
  for (
    let current: t.Node | undefined = node;
    current;
    current = getChildNodes(current).find(
      (child) => child.start! <= pos && pos < child.end!
    )
  ) {
    nodes.push(current)
  }

  return nodes
}

// TypeScript's scanner.hasPrecedingLineBreak() at the comma at pos in object:
// whether a line break comes after the token before it, which is the `{`,
// the end of a member, or a comma.
function hasPrecedingLineBreak(
  code: string,
  object: t.ObjectExpression,
  pos: number
) {
  const membersBefore = object.properties.filter((member) => member.end! <= pos)
  let tokenEnd = membersBefore.at(-1)?.end ?? object.start! + 1
  // Only trivia and commas come between them.
  for (
    let next = skipTrivia(code, tokenEnd);
    next < pos;
    next = skipTrivia(code, tokenEnd)
  ) {
    tokenEnd = next + 1
  }

  return Array.from(code.slice(tokenEnd, pos)).some(isLineBreak)
}

// The Babel nodes directly under node, in no particular order.
export function getChildNodes(node: t.Node) {
  // Babel's node types have no index signature for VISITOR_KEYS.
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

// Babel's recoverable parse errors, without those TypeScript reports as
// semantic errors, or Infinity when Babel cannot recover from one and throws.
function countErrors(parseFile: () => ParseResult<t.File>) {
  try {
    const errors = parseFile().errors ?? []
    return errors.filter((error) => !SEMANTIC_ERROR_CODES.has(error.reasonCode))
      .length
  } catch {
    return Infinity
  }
}

// The syntax errors in code as written: close enough to TypeScript's
// syntactic diagnostics to tell whether a file is broken. Babel cannot parse a
// comma TypeScript skips (see parseModule), so it counts as Infinity.
export function countSyntaxErrors(code: string, options: ParseOptions = {}) {
  return countErrors(() => parseAsWritten(code, options))
}

// The syntax errors that can change the tree TypeScript parses code into,
// which is what ts-morph rejects an edit for: countSyntaxErrors's, except the
// commas TypeScript skips (see parseModule), which change no node.
export function countTreeErrors(code: string, options: ParseOptions = {}) {
  return countErrors(() => parseModule(code, options))
}

// ts-morph's Node#getText().
export function getText(code: string, node: t.Node) {
  return code.slice(node.start!, node.end!)
}

// The node of a type that starts at start. ts-morph's nodes outlive edits,
// and an edit returns new code, so the editors find a node again by where it
// starts, which edits inside it never move.
export function findNodeAt<T extends t.Node>(
  code: string,
  start: number,
  isType: (node: t.Node) => node is T,
  options: ParseOptions
) {
  let found: T | undefined
  t.traverseFast(parseModule(code, options), (node) => {
    if (node.start === start && isType(node)) {
      found = node
    }
  })

  return found
}
