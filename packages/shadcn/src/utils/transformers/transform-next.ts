import { getProjectInfo } from "@/src/utils/get-project-info"
import { Transformer } from "@/src/utils/transformers"
import { SourceFile } from "ts-morph"

export const transformNext: Transformer = async ({
  sourceFile,
  config,
  filename,
}) => {
  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  if (!projectInfo?.frameworkVersion) {
    return sourceFile
  }

  return transformNextMiddleware(
    sourceFile,
    filename,
    projectInfo.frameworkVersion
  )
}

function transformNextMiddleware(
  sourceFile: SourceFile,
  filename: string,
  frameworkVersion: string
) {
  const majorVersion = parseInt(frameworkVersion.split(".")[0])
  const isNext16Plus = !isNaN(majorVersion) && majorVersion >= 16
  if (!isNext16Plus) {
    return sourceFile
  }

  if (filename !== "middleware.ts" && filename !== "middleware.js") {
    return sourceFile
  }

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
