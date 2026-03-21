import { Config } from "@/src/utils/get-config"
import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

export const transformImport: Transformer = async ({
  sourceFile,
  config,
  isRemote,
}) => {
  const utilsAlias = config.aliases?.utils
  const workspaceAlias =
    typeof utilsAlias === "string" && utilsAlias.includes("/")
      ? utilsAlias.split("/")[0]
      : "@"
  const utilsImport = `${workspaceAlias}/lib/utils`

  if (![".tsx", ".ts", ".jsx", ".js"].includes(sourceFile.getExtension())) {
    return sourceFile
  }

  for (const specifier of sourceFile.getImportStringLiterals()) {
    const updated = updateImportAliases(
      specifier.getLiteralValue(),
      config,
      isRemote
    )
    specifier.setLiteralValue(updated)

    // Replace `import { cn } from "@/lib/utils"`
    if (utilsImport === updated || updated === "@/lib/utils") {
      const importDeclaration = specifier.getFirstAncestorByKind(
        SyntaxKind.ImportDeclaration
      )
      const isCnImport = importDeclaration
        ?.getNamedImports()
        .some((namedImport) => namedImport.getName() === "cn")

      if (!isCnImport || !config.aliases.utils) {
        continue
      }

      specifier.setLiteralValue(
        utilsImport === updated
          ? updated.replace(utilsImport, config.aliases.utils)
          : config.aliases.utils
      )
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
