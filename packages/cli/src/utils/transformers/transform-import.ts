import { Transformer } from "@/src/utils/transformers"

export const transformImport: Transformer = async ({ sourceFile, config }) => {
  const importDeclarations = sourceFile.getImportDeclarations()

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue()

    // Replace @/registry/[style] with the components alias.
    if (moduleSpecifier.startsWith("@/registry/")) {
      if (moduleSpecifier.match(/^@\/registry\/(.+)\/ui/)) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(
            /^@\/registry\/(.+)\/ui/,
            config.aliases.ui ?? `${config.aliases.components}/ui`
          )
        )
      } else if (
        config.aliases.components &&
        moduleSpecifier.match(/^@\/registry\/(.+)\/components/)
      ) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(
            /^@\/registry\/(.+)\/components/,
            config.aliases.components
          )
        )
      }

      if (
        config.aliases.lib &&
        moduleSpecifier.match(/^@\/registry\/(.+)\/lib/)
      ) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(/^@\/registry\/(.+)\/lib/, config.aliases.lib)
        )
      }

      if (
        config.aliases.hooks &&
        moduleSpecifier.match(/^@\/registry\/(.+)\/hooks/)
      ) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(
            /^@\/registry\/(.+)\/hooks/,
            config.aliases.hooks
          )
        )
      }
    }

    // Replace `import { cn } from "@/lib/utils"`
    if (moduleSpecifier == "@/lib/utils") {
      const namedImports = importDeclaration.getNamedImports()
      const cnImport = namedImports.find((i) => i.getName() === "cn")
      if (cnImport) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(/^@\/lib\/utils/, config.aliases.utils)
        )
      }
    }
  }

  return sourceFile
}
