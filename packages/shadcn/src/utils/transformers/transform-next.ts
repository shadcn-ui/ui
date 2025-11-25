import { Transformer } from "@/src/utils/transformers"

export const transformNext: Transformer = async ({ sourceFile }) => {
  // export function middleware.
  sourceFile.getFunctions().forEach((func) => {
    if (func.getName() === "middleware") {
      func.rename("proxy")
    }
  })

  // export const middleware.
  sourceFile.getVariableDeclarations().forEach((variable) => {
    if (variable.getName() === "middleware") {
      variable.rename("proxy")
    }
  })

  // export { handler as middleware }.
  sourceFile.getExportDeclarations().forEach((exportDecl) => {
    const namedExports = exportDecl.getNamedExports()
    namedExports.forEach((namedExport) => {
      if (namedExport.getName() === "middleware") {
        namedExport.setName("proxy")
      }
      const aliasNode = namedExport.getAliasNode()
      if (aliasNode?.getText() === "middleware") {
        namedExport.setAlias("proxy")
      }
    })
  })

  return sourceFile
}
