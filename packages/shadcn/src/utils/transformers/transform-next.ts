import path from "path"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { Transformer } from "@/src/utils/transformers"
import { SourceFile } from "ts-morph"

export const transformNext: Transformer = async ({
  sourceFile,
  config,
  filename,
}) => {
  return transformNextMiddleware(sourceFile, config, filename)
}

async function transformNextMiddleware(
  sourceFile: SourceFile,
  config: Config,
  filename: string
) {
  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)
  const isRootMiddleware =
    filename === path.join(config.resolvedPaths.cwd, "middleware.ts") ||
    filename === path.join(config.resolvedPaths.cwd, "middleware.js")
  const isNextJs =
    projectInfo?.framework.name === "next-app" ||
    projectInfo?.framework.name === "next-pages"

  if (!isRootMiddleware || !isNextJs || !projectInfo?.frameworkVersion) {
    return sourceFile
  }

  const majorVersion = parseInt(projectInfo.frameworkVersion.split(".")[0])
  const isNext16Plus = !isNaN(majorVersion) && majorVersion >= 16

  if (!isNext16Plus) {
    return sourceFile
  }

  // export function middleware.
  const functions = sourceFile.getFunctions()
  functions.forEach((func) => {
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
