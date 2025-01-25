import { Config } from "@/src/utils/get-config"
import { Transformer } from "@/src/utils/transformers"

const COMMON_CN_IMPORTS = {
  "@/lib/utils": /^@\/lib\/utils/,
  "@workspace/lib/utils": /^@workspace\/lib\/utils/,
}

export const transformImport: Transformer = async ({
  sourceFile,
  config,
  isRemote,
}) => {
  const importDeclarations = sourceFile.getImportDeclarations()

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = updateImportAliases(
      importDeclaration.getModuleSpecifierValue(),
      config,
      isRemote
    )

    importDeclaration.setModuleSpecifier(moduleSpecifier)

    // Replace `import { cn } from "@/lib/utils"`
    if (COMMON_CN_IMPORTS[moduleSpecifier as keyof typeof COMMON_CN_IMPORTS]) {
      const namedImports = importDeclaration.getNamedImports()
      const cnImport = namedImports.find((i) => i.getName() === "cn")
      if (cnImport) {
        importDeclaration.setModuleSpecifier(
          moduleSpecifier.replace(
            COMMON_CN_IMPORTS[
              moduleSpecifier as keyof typeof COMMON_CN_IMPORTS
            ],
            config.aliases.utils
          )
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
