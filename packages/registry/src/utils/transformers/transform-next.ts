import { applyEdits, type TextEdit } from "@/src/utils/codemod/edits"
import { parseModule } from "@/src/utils/codemod/parse"
import { renameFunction, renameVariable } from "@/src/utils/codemod/rename"
import { type Transformer } from "@/src/utils/transformers"
import { type types as t } from "@babel/core"

// Next.js 16 renamed the middleware export to proxy.
export const transformNext: Transformer = (code) => {
  // A file Babel cannot parse is left as it is, where ts-morph renamed in the
  // tree TypeScript recovers.
  try {
    parseModule(code)
  } catch {
    return code
  }

  // export function middleware.
  code = renameEach(code, getFunctionNames, renameFunction)

  // export const middleware.
  code = renameEach(code, getVariableNames, renameVariable)

  // export { handler as middleware }.
  return applyEdits(code, getExportEdits(code, parseModule(code).program))
}

// ts-morph renames one declaration after the other, each on the code the one
// before left, so each rename parses the code again. The declarations keep
// their order, and their index, through a rename.
function renameEach(
  code: string,
  getNames: (program: t.Program) => t.Identifier[],
  rename: (code: string, declarationStart: number, newName: string) => string
) {
  let names = getNames(parseModule(code).program)
  for (let index = 0; index < names.length; index++) {
    if (isMiddleware(code, names[index])) {
      code = rename(code, names[index].start!, "proxy")
      names = getNames(parseModule(code).program)
    }
  }
  return code
}

// Whether getName() is middleware: the name as written, which TypeScript ends
// before a type annotation and Babel's range does not.
function isMiddleware(code: string, name: t.Identifier) {
  return (
    name.name === "middleware" && code.startsWith("middleware", name.start!)
  )
}

// The names of ts-morph's SourceFile#getFunctions(): the top-level function
// declarations with a body. A function without one is an overload, which the
// rename of its implementation renames too, or an ambient `declare function`,
// which ts-morph also renamed and Babel binds to nothing, so it keeps its name.
function getFunctionNames(program: t.Program) {
  return getDeclarations(program).flatMap((declaration) =>
    declaration.type === "FunctionDeclaration" && declaration.id
      ? [declaration.id]
      : []
  )
}

// The names of ts-morph's SourceFile#getVariableDeclarations(): the
// declarations of the top-level variable statements. A destructuring pattern
// is never named middleware.
function getVariableNames(program: t.Program) {
  return getDeclarations(program).flatMap((declaration) =>
    declaration.type === "VariableDeclaration"
      ? declaration.declarations.flatMap(({ id }) =>
          id.type === "Identifier" ? [id] : []
        )
      : []
  )
}

// The top-level declarations, exported or not.
function getDeclarations(program: t.Program) {
  return program.body.map((statement) =>
    (statement.type === "ExportNamedDeclaration" ||
      statement.type === "ExportDefaultDeclaration") &&
    statement.declaration
      ? statement.declaration
      : statement
  )
}

// ts-morph's ExportSpecifier#setName("proxy") on each export specifier of the
// top-level export declarations named middleware, and setAlias("proxy") on
// each alias written middleware. Both replace the name as written, without
// renaming anything else.
function getExportEdits(code: string, program: t.Program) {
  const edits: TextEdit[] = []

  for (const statement of program.body) {
    if (statement.type !== "ExportNamedDeclaration") {
      continue
    }

    for (const specifier of statement.specifiers) {
      if (specifier.type !== "ExportSpecifier") {
        continue
      }

      // Babel's types leave out that the local name can be a string literal,
      // as in `export { "a b" as name } from "./module"`.
      const local = specifier.local as t.Identifier | t.StringLiteral
      const { exported } = specifier
      // getName() reads a string literal's value, and an identifier as
      // written.
      if (
        local.type === "StringLiteral"
          ? local.value === "middleware"
          : isMiddleware(code, local)
      ) {
        edits.push({ start: local.start!, end: local.end!, text: "proxy" })
      }

      // Babel gives `export { name }` an exported name of its own, at the
      // same position. ts-morph has an alias node only after `as`.
      if (
        exported.start !== local.start &&
        exported.type === "Identifier" &&
        isMiddleware(code, exported)
      ) {
        edits.push({
          start: exported.start!,
          end: exported.end!,
          text: "proxy",
        })
      }
    }
  }

  return edits
}
