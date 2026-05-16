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
    typeof utilsAlias === "string"
      ? getWorkspaceAliasFromUtilsAlias(utilsAlias)
      : "@"
  const utilsImport = workspaceAlias
    ? `${workspaceAlias}/lib/utils`
    : "@/lib/utils"

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
  moduleSpecifier = normalizeImportSpecifier(moduleSpecifier, config)

  // Not a local import.
  if (!moduleSpecifier.startsWith("@/") && !isRemote) {
    return moduleSpecifier
  }

  // This treats the remote as coming from a faux registry.
  if (isRemote && moduleSpecifier.startsWith("@/")) {
    moduleSpecifier = moduleSpecifier.replace(/^@\//, `@/registry/new-york/`)
  }

  if (moduleSpecifier === "@/registry") {
    return config.aliases.components
  }

  // Not a registry import.
  if (!moduleSpecifier.startsWith("@/registry/")) {
    if (moduleSpecifier === "@/lib/utils" && config.aliases.utils) {
      return config.aliases.utils
    }

    if (
      config.aliases.ui &&
      moduleSpecifier.match(/^@\/components\/ui(?=\/|$)/)
    ) {
      return moduleSpecifier.replace(/^@\/components\/ui/, config.aliases.ui)
    }

    if (
      config.aliases.components &&
      moduleSpecifier.match(/^@\/components(?=\/|$)/)
    ) {
      return moduleSpecifier.replace(
        /^@\/components/,
        config.aliases.components
      )
    }

    if (config.aliases.hooks && moduleSpecifier.match(/^@\/hooks(?=\/|$)/)) {
      return moduleSpecifier.replace(/^@\/hooks/, config.aliases.hooks)
    }

    if (config.aliases.lib && moduleSpecifier.match(/^@\/lib(?=\/|$)/)) {
      return moduleSpecifier.replace(/^@\/lib/, config.aliases.lib)
    }

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
    config.aliases.utils &&
    moduleSpecifier.match(/^@\/registry\/(.+)\/lib\/utils$/)
  ) {
    return config.aliases.utils
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

function getWorkspaceAliasFromUtilsAlias(utilsAlias: string) {
  // `#...` utils aliases are handled by package-import normalization and should
  // not be treated as workspace package roots.
  if (utilsAlias.startsWith("#")) {
    return ""
  }

  if (utilsAlias.endsWith("/lib/utils")) {
    return utilsAlias.slice(0, -"/lib/utils".length)
  }

  if (utilsAlias.startsWith("@")) {
    const [scope, name] = utilsAlias.split("/")
    return scope && name ? `${scope}/${name}` : utilsAlias
  }

  const slashIndex = utilsAlias.indexOf("/")
  return slashIndex === -1 ? utilsAlias : utilsAlias.slice(0, slashIndex)
}

function normalizeImportSpecifier(moduleSpecifier: string, config: Config) {
  if (moduleSpecifier === "#registry") {
    return "@/registry"
  }

  if (moduleSpecifier.startsWith("#/")) {
    return moduleSpecifier.replace(/^#\//, "@/")
  }

  if (moduleSpecifier.startsWith("#registry/")) {
    return moduleSpecifier.replace(/^#registry\//, "@/registry/")
  }

  // We only normalize the standard shadcn alias slots here so the rest of the
  // transformer can keep operating on the canonical `@/...` forms it already
  // understands.
  for (const { alias, normalized } of getConfigAliasNormalizations(config)) {
    if (moduleSpecifier === alias) {
      return normalized
    }

    if (moduleSpecifier.startsWith(`${alias}/`)) {
      return `${normalized}${moduleSpecifier.slice(alias.length)}`
    }
  }

  return moduleSpecifier
}

function getConfigAliasNormalizations(config: Config) {
  if (!config.aliases) {
    return []
  }

  return [
    { alias: config.aliases.ui, normalized: "@/components/ui" },
    { alias: config.aliases.components, normalized: "@/components" },
    { alias: config.aliases.hooks, normalized: "@/hooks" },
    { alias: config.aliases.lib, normalized: "@/lib" },
    { alias: config.aliases.utils, normalized: "@/lib/utils" },
  ]
    .filter(
      (entry): entry is { alias: string; normalized: string } =>
        typeof entry.alias === "string" && entry.alias.startsWith("#")
    )
    .sort((a, b) => b.alias.length - a.alias.length)
}
