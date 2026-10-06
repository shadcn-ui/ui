import { type types as t } from "@babel/core"
import { parse, type ParserOptions, type ParserPlugin } from "@babel/parser"

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

// ts-morph's SourceFile: the whole file, parsed even with syntax errors.
export function parseModule(
  code: string,
  options: ParseOptions & { tokens?: boolean } = {}
) {
  const { jsx = true, tokens } = options
  return parse(code, {
    ...PARSER_OPTIONS,
    plugins: jsx ? [...PLUGINS, "jsx"] : PLUGINS,
    tokens,
  })
}

// Babel's recoverable parse errors, without those TypeScript reports as
// semantic errors: close enough to TypeScript's syntactic diagnostics to
// tell whether an edit broke the file.
export function countSyntaxErrors(code: string, options: ParseOptions = {}) {
  try {
    const errors = parseModule(code, options).errors ?? []
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
