import { transformFileName } from "@/src/utils/transformers/transform-file-name"
import { DEFAULT_CASE } from "@/src/utils/get-config"
import { CASE_CONVENTION } from "@/src/utils/registry"
import { Transformer } from "@/src/utils/transformers"

export const transformImport: Transformer = async ({ sourceFile, config }) => {
  const importDeclarations = sourceFile.getImportDeclarations()

  for (const importDeclaration of importDeclarations) {
    let moduleSpecifier = importDeclaration.getModuleSpecifierValue()

    // Replace @/registry/[style] with the components alias.
    if (moduleSpecifier.startsWith("@/registry/")) {
      if (config.aliases.ui) {
        moduleSpecifier = moduleSpecifier.replace(
          /^@\/registry\/[^/]+\/ui/,
          config.aliases.ui
        )
      } else {
        moduleSpecifier = moduleSpecifier.replace(
          /^@\/registry\/[^/]+/,
          config.aliases.components
        )
      }

      if (config.case !== DEFAULT_CASE) {
        moduleSpecifier = moduleSpecifier.replace(/[^\/]+$/, (name) =>
          transformFileName(name, config.case as CASE_CONVENTION)
        )
      }
    }

    // Replace `import { cn } from "@/lib/utils"`
    if (moduleSpecifier == "@/lib/utils") {
      const namedImports = importDeclaration.getNamedImports()
      const cnImport = namedImports.find((i) => i.getName() === "cn")
      if (cnImport) {
        moduleSpecifier = moduleSpecifier.replace(
          /^@\/lib\/utils/,
          config.aliases.utils
        )
      }
    }

    importDeclaration.setModuleSpecifier(moduleSpecifier)
  }

  return sourceFile
}
