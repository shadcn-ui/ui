import { type Transformer } from "@/src/utils/transformers"
import { transformFromAstSync } from "@babel/core"
import { ParserOptions, parse } from "@babel/parser"
// @ts-ignore
import transformTypescript from "@babel/plugin-transform-typescript"
import * as recast from "recast"

// TODO.
// I'm using recast for the AST here.
// Figure out if ts-morph AST is compatible with Babel.

// This is a copy of the babel options from recast/parser.
// The goal here is to tolerate as much syntax as possible.
// We want to be able to parse any valid tsx code.
// See https://github.com/benjamn/recast/blob/master/parsers/_babel_options.ts.
const PARSE_OPTIONS: ParserOptions = {
  sourceType: "module",
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    "asyncGenerators",
    "bigInt",
    "classPrivateMethods",
    "classPrivateProperties",
    "classProperties",
    "classStaticBlock",
    "decimal",
    "decorators-legacy",
    "doExpressions",
    "dynamicImport",
    "exportDefaultFrom",
    "exportNamespaceFrom",
    "functionBind",
    "functionSent",
    "importAssertions",
    "importMeta",
    "nullishCoalescingOperator",
    "numericSeparator",
    "objectRestSpread",
    "optionalCatchBinding",
    "optionalChaining",
    [
      "pipelineOperator",
      {
        proposal: "minimal",
      },
    ],
    [
      "recordAndTuple",
      {
        syntaxType: "hash",
      },
    ],
    "throwExpressions",
    "topLevelAwait",
    "v8intrinsic",
    "typescript",
    "jsx",
  ],
}

export const transformJsx: Transformer<string> = async ({
  sourceFile,
  config,
}) => {
  const output = sourceFile.getFullText()

  if (config.tsx) {
    return output
  }

  const ast = recast.parse(output, {
    parser: {
      parse: (code: string) => {
        return parse(code, PARSE_OPTIONS)
      },
    },
  })

  const result = transformFromAstSync(ast, output, {
    cloneInputAst: false,
    code: false,
    ast: true,
    plugins: [transformTypescript],
    configFile: false,
  })

  if (!result || !result.ast) {
    throw new Error("Failed to transform JSX")
  }

  return recast.print(result.ast).code
}
