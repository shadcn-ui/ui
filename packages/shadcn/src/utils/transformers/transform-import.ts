import { Config } from "@/src/utils/get-config"
import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

export const transformImport: Transformer = async ({
  sourceFile,
  config,
  isRemote,
}) => {
  const workspaceAlias = config.aliases?.utils?.split("/")[0]?.slice(1)
  const utilsImport = `@${workspaceAlias}/lib/utils`

  if (![".tsx", ".ts", ".jsx", ".js"].includes(sourceFile.getExtension())) {
    return sourceFile
  }

  for (const specifier of sourceFile.getImportStringLiterals()) {
    const originalValue = specifier.getLiteralValue()

    // Check if this is a cn import from utils before transforming aliases
    let isCnImport = false
    // Check for exports first (re-exports don't have import declarations)
    const isExport = specifier
      .getFirstAncestorByKind(SyntaxKind.ExportDeclaration)
      ?.getNamedExports()
      .some((namedExport) => namedExport.getName() === "cn") ?? false
    
    if (
      originalValue === "@/lib/utils" ||
      originalValue === "@/src/utils" ||
      originalValue === utilsImport ||
      originalValue.match(/^@\/registry\/[^/]+\/lib\/utils$/) ||
      originalValue.match(/^\/lib\/utils$/) ||
      originalValue.match(/^\/src\/utils$/) ||
      (config.aliases?.utils && originalValue === config.aliases.utils) ||
      (originalValue.startsWith("/") && originalValue.endsWith("/lib/utils")) ||
      (originalValue.startsWith("/") && originalValue.endsWith("/src/utils"))
    ) {
      const importDeclaration = specifier.getFirstAncestorByKind(
        SyntaxKind.ImportDeclaration
      )
      isCnImport = (importDeclaration
        ?.getNamedImports()
        .some((namedImport) => namedImport.getName() === "cn") ?? false) || isExport
    }

    // Handle sub-path imports from utils (e.g., @/lib/utils/bar or @/src/utils/bar)
    const utilsSubPathMatch = originalValue.match(/^(@\/|\/)(lib|src)\/utils\/(.+)$/)
    if (utilsSubPathMatch && config.aliases?.utils) {
      const [, , , subPath] = utilsSubPathMatch
      let utilsPath = config.aliases.utils
      const originalAlias = utilsPath
      if (!utilsPath.endsWith('/utils')) {
        utilsPath += '/utils'
      }
      // Replace /lib/utils with /src/utils, but preserve user-configured absolute paths like /app/function/lib/utils
      if (utilsPath.includes('/lib/utils')) {
        const isAbsoluteWithLibUtils = originalAlias.startsWith('/') && originalAlias.endsWith('/lib/utils')
        if (!isAbsoluteWithLibUtils) {
          utilsPath = utilsPath.replace(/\/lib\/utils$/, '/src/utils')
        }
      }
      specifier.setLiteralValue(`${utilsPath}/${subPath}`)
    } else {
      const updated = updateImportAliases(originalValue, config, isRemote)
      specifier.setLiteralValue(updated)

      // Replace `import { cn } from "@/lib/utils"` or `@/src/utils` with configured utils alias
      if (isCnImport && config.aliases?.utils) {
        let utilsPath = config.aliases.utils
        const originalAlias = utilsPath
        // If the alias doesn't end with /utils, append it
        if (!utilsPath.endsWith('/utils')) {
          utilsPath += '/utils'
        }
        // Replace /lib/utils with /src/utils, but preserve user-configured absolute paths like /app/function/lib/utils
        // Only replace if:
        // 1. The original alias doesn't end with /lib/utils (user didn't explicitly configure /lib/utils), OR
        // 2. It's a relative path pattern (starts with @/ or similar, not absolute /path)
        if (utilsPath.includes('/lib/utils')) {
          // Preserve absolute paths that user explicitly configured with /lib/utils
          const isAbsoluteWithLibUtils = originalAlias.startsWith('/') && originalAlias.endsWith('/lib/utils')
          if (!isAbsoluteWithLibUtils) {
            utilsPath = utilsPath.replace(/\/lib\/utils$/, '/src/utils')
          }
        }
        specifier.setLiteralValue(utilsPath)
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
