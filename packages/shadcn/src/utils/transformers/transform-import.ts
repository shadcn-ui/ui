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

export function updateImportAliases(
  moduleSpecifier: string,
  config: Config,
  isRemote: boolean = false
) {
  // Not a local import.
  if (!moduleSpecifier.startsWith("@/") && !isRemote) {
    return moduleSpecifier
  }

  // Treat remote source imports as coming from a faux registry.
  if (
    isRemote &&
    moduleSpecifier.startsWith("@/") &&
    !moduleSpecifier.startsWith("@/registry/")
  ) {
    const style = config.style || "new-york"
    moduleSpecifier = moduleSpecifier.replace(/^@\//, `@/registry/${style}/`)
  }

  // Not a registry import.
  if (!moduleSpecifier.startsWith("@/registry/")) {
    // Rewrite bare alias buckets (e.g. @/ui, @/lib, @/hooks, @/components, @/utils)
    const knownAliasKeys = Object.keys(config.aliases) as Array<
      keyof Config["aliases"]
    >
    for (const key of knownAliasKeys) {
      const target = (config.aliases as any)[key]
      if (!target) continue
      const re = new RegExp(`^@\\/${key}(?=(/|$))`)
      if (re.test(moduleSpecifier)) {
        if (key === "ui") {
          const replacement =
            config.aliases.ui ?? `${config.aliases.components}/ui`
          return moduleSpecifier.replace(re, replacement)
        }
        return moduleSpecifier.replace(re, target)
      }
    }

    // Otherwise, only adjust the alias scope (e.g. @/ -> @acme/)
    const aliasScope = config.aliases.components.split("/")[0]
    return moduleSpecifier.replace(/^@\//, `${aliasScope}/`)
  }

  // Registry import with optional style segment.
  if (moduleSpecifier.startsWith("@/registry/")) {
    const withoutPrefix = moduleSpecifier.replace(/^@\/registry\//, "")
    const parts = withoutPrefix.split("/")

    // Determine bucket with or without style
    const aliasKeys = new Set([
      ...Object.keys(config.aliases),
      "components",
      "ui",
      "lib",
      "hooks",
      "utils",
    ])

    let bucket = ""
    let rest = ""

    const styleCandidates = new Set([
      config.style,
      "new-york",
      "new-york-v4",
      "default",
    ]) as Set<string>
    const hasStyle =
      parts.length >= 2 &&
      (aliasKeys.has(parts[1]) || styleCandidates.has(parts[0]))

    if (hasStyle) {
      bucket = parts[1]
      rest = parts.slice(2).join("/")
    } else {
      bucket = parts[0]
      rest = parts.slice(1).join("/")
    }

    rest = rest ? `/${rest}` : ""

    if (bucket === "ui") {
      const replacement = config.aliases.ui ?? `${config.aliases.components}/ui`
      return `${replacement}${rest}`
    }

    if ((config.aliases as any)[bucket]) {
      return `${(config.aliases as any)[bucket]}${rest}`
    }

    // Unknown bucket: fall back to components alias while preserving the rest
    return `${config.aliases.components}/${bucket}${rest}`.replace(/\/$/, "")
  }

  return moduleSpecifier
}
