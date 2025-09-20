import { Config } from "@/src/utils/get-config"
import { Transformer } from "@/src/utils/transformers"
import { updateImportAliases } from "@/src/utils/transformers/transform-import"
import { Node, SyntaxKind } from "ts-morph"

function isInImportOrExport(node: Node) {
  const parent = node.getParent()
  if (!parent) return false
  const kind = parent.getKind()
  return (
    kind === SyntaxKind.ImportDeclaration ||
    kind === SyntaxKind.ExportDeclaration
  )
}

export const transformStringAliases: Transformer = async ({
  sourceFile,
  config,
  isRemote,
}) => {
  // Process normal string literals
  sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((lit) => {
    if (isInImportOrExport(lit)) return
    const raw = lit.getText() // includes quotes
    const value = raw.replace(/^['"`]|['"`]$/g, "")
    if (!value.startsWith("@/")) return

    const next = updateImportAliases(value, config as Config, isRemote)
    if (next !== value) {
      lit.replaceWithText(`"${next}"`)
    }
  })

  // Process template literals without substitutions
  sourceFile
    .getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral)
    .forEach((lit) => {
      if (isInImportOrExport(lit)) return
      const raw = lit.getText() // includes backticks
      const value = raw.slice(1, -1)
      if (!value.startsWith("@/")) return

      const next = updateImportAliases(value, config as Config, isRemote)
      if (next !== value) {
        lit.replaceWithText("`" + next + "`")
      }
    })

  return sourceFile
}
