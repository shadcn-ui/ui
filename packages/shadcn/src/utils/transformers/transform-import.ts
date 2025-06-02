import { Config } from "@/src/utils/get-config"
import { Transformer } from "@/src/utils/transformers"

export const transformImport: Transformer = async ({
  sourceFile,
  config,
  isRemote,
}) => {
  const workspaceAlias = config.aliases?.utils?.split("/")[0]?.slice(1)
  const utilsImport = `@${workspaceAlias}/lib/utils`

  const importDeclarations = sourceFile.getImportDeclarations()

  if (![".tsx", ".ts", ".jsx", ".js"].includes(sourceFile.getExtension())) {
    return sourceFile
  }

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = updateImportAliases(
      importDeclaration.getModuleSpecifierValue(),
      config,
      isRemote
    )

    importDeclaration.setModuleSpecifier(moduleSpecifier)

    // Replace `import { cn } from "@/lib/utils"`
    if (utilsImport === moduleSpecifier || moduleSpecifier === "@/lib/utils") {
      const namedImports = importDeclaration.getNamedImports()
      const cnImport = namedImports.find((i) => i.getName() === "cn")
      if (cnImport) {
        importDeclaration.setModuleSpecifier(
          utilsImport === moduleSpecifier
            ? moduleSpecifier.replace(utilsImport, config.aliases.utils)
            : config.aliases.utils
        )
      }
    }
  }

  return sourceFile
}

function updateImportAliases(
  moduleSpecifier: string,
  config: Config,
  isRemote: boolean = false
) {
  // Not a local import.
  if (!moduleSpecifier.startsWith("@/") && !isRemote) {
    return moduleSpecifier
  }

  // This treats the remote as coming from a faux registry.
  if (isRemote && moduleSpecifier.startsWith("@/")) {
    moduleSpecifier = moduleSpecifier.replace(/^@\//, `@/registry/new-york/`)
  }

  // Not a registry import.
  if (!moduleSpecifier.startsWith("@/registry/")) {
    // We fix the alias and return.
    const alias = config.aliases.components.split("/")[0]
    return moduleSpecifier.replace(/^@\//, `${alias}/`)
  }

  if (moduleSpecifier.match(/^@\/registry\/(.+)\/ui/)) {
    return moduleSpecifier.replace(
      /^@\/registry\/(.+)\/ui/,
      config.aliases.ui ?? `${config.aliases.components}/ui`
    )
  }

  if (
    config.aliases.components &&
    moduleSpecifier.match(/^@\/registry\/(.+)\/components/)
  ) {
    return moduleSpecifier.replace(
      /^@\/registry\/(.+)\/components/,
      config.aliases.components
    )
  }

  if (config.aliases.lib && moduleSpecifier.match(/^@\/registry\/(.+)\/lib/)) {
    return moduleSpecifier.replace(
      /^@\/registry\/(.+)\/lib/,
      config.aliases.lib
    )
  }

  if (
    config.aliases.hooks &&
    moduleSpecifier.match(/^@\/registry\/(.+)\/hooks/)
  ) {
    return moduleSpecifier.replace(
      /^@\/registry\/(.+)\/hooks/,
      config.aliases.hooks
    )
  }

  return moduleSpecifier.replace(
    /^@\/registry\/[^/]+/,
    config.aliases.components
  )
}
