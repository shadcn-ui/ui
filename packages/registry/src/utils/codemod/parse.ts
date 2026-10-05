import { type types as t } from "@babel/core"
import { parse, type ParserOptions } from "@babel/parser"

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
  plugins: ["typescript", "jsx", "decorators-legacy"],
}

// With errorRecovery, Babel also reports these, which TypeScript reports as
// semantic errors. They never make ts-morph reject an edit.
const SEMANTIC_ERROR_CODES = new Set([
  "VarRedeclaration",
  "DuplicateExport",
  "ModuleExportUndefined",
])

// ts-morph's SourceFile: the whole file as TSX, parsed even with syntax errors.
export function parseModule(code: string, options: { tokens?: boolean } = {}) {
  return parse(code, { ...PARSER_OPTIONS, tokens: options.tokens })
}

// How many syntactic diagnostics TypeScript would report for the file.
export function countSyntaxErrors(code: string) {
  try {
    const errors = parseModule(code).errors ?? []
    return errors.filter((error) => !SEMANTIC_ERROR_CODES.has(error.reasonCode))
      .length
  } catch {
    // Babel cannot recover from some syntax errors and throws instead.
    return Infinity
  }
}

// ts-morph's Node#getText().
export function getText(code: string, node: t.Node) {
  return code.slice(node.start!, node.end!)
}
