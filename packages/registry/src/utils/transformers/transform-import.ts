import { getText, parseTransformInput } from "@/src/utils/codemod/parse"
import {
  StringLiterals,
  type Literal,
} from "@/src/utils/codemod/string-literals"
import { Config } from "@/src/utils/get-config"
import { types as t } from "@babel/core"

import { fromTextTransformer } from "./text-transformer"

export const transformImport = fromTextTransformer(
  (code, { config, isRemote, filename }) => {
    const utilsAlias = config.aliases?.utils
    const workspaceAlias =
      typeof utilsAlias === "string"
        ? getWorkspaceAliasFromUtilsAlias(utilsAlias)
        : "@"
    const utilsImport = workspaceAlias
      ? `${workspaceAlias}/lib/utils`
      : "@/lib/utils"

    if (!hasImportStringLiterals(filename)) {
      return code
    }

    const file = parseTransformInput(code)
    if (!file) {
      return code
    }

    // ts-morph's setLiteralValue() writes each specifier again, even
    // unchanged, which drops the escapes in it.
    const literals = new StringLiterals(code, file)
    for (const { specifier, importDeclaration } of getImportStringLiterals(
      file.program
    )) {
      const updated = updateImportAliases(
        literals.getValue(specifier),
        config,
        isRemote
      )
      literals.setValue(specifier, updated)

      // Replace `import { cn } from "@/lib/utils"`
      if (utilsImport === updated || updated === "@/lib/utils") {
        const isCnImport = importDeclaration?.specifiers.some(
          (namedImport) =>
            namedImport.type === "ImportSpecifier" &&
            getImportedName(code, namedImport) === "cn"
        )

        if (!isCnImport || !config.aliases.utils) {
          continue
        }

        literals.setValue(
          specifier,
          utilsImport === updated
            ? updated.replace(utilsImport, config.aliases.utils)
            : config.aliases.utils
        )
      }
    }

    return literals.apply()
  }
)

// Whether TypeScript collects the file's imports: ts-morph's getExtension()
// is ".tsx" or ".ts", which it is not for a .d.ts file. The extension check
// also passes .js and .jsx, but the runner's Project does not allow JS, and
// TypeScript collects no imports from them.
function hasImportStringLiterals(filename: string) {
  const baseName = filename.split(/[\\/]/).pop()!
  return /.\.tsx?$/.test(baseName) && !/\.d\.ts$/i.test(baseName)
}

interface ImportStringLiteral {
  specifier: Literal
  // The import declaration the specifier is the source of.
  importDeclaration?: t.ImportDeclaration
}

// ts-morph's SourceFile#getImportStringLiterals(), TypeScript's imports of a
// .tsx file (collectExternalModuleReferences): the module specifiers of the
// top-level import, export and import-equals declarations, then of each
// import() call and import type. In a file that is not a module, that takes
// the non-relative specifiers of the declarations in a `declare module`
// block too.
function getImportStringLiterals(program: t.Program): ImportStringLiteral[] {
  const dynamicImports: Literal[] = []
  let usesImportMeta = false
  t.traverseFast(program, (node) => {
    if (node.type === "CallExpression" && node.callee.type === "Import") {
      const [argument] = node.arguments
      if (
        argument?.type === "StringLiteral" ||
        (argument?.type === "TemplateLiteral" &&
          argument.expressions.length === 0)
      ) {
        dynamicImports.push(argument)
      }
    } else if (node.type === "TSImportType") {
      dynamicImports.push(node.argument)
    } else if (node.type === "MetaProperty" && node.meta.name === "import") {
      usesImportMeta = true
    }
  })
  dynamicImports.sort((a, b) => a.start! - b.start!)

  // TypeScript's isFileProbablyExternalModule.
  const isModule = usesImportMeta || program.body.some(isModuleIndicator)

  const literals: ImportStringLiteral[] = []
  function collect(statement: t.Statement, inAmbientModule: boolean) {
    const specifier = getModuleSpecifier(statement)
    if (specifier) {
      if (!inAmbientModule || !isExternalModuleNameRelative(specifier.value)) {
        literals.push({
          specifier,
          importDeclaration:
            statement.type === "ImportDeclaration" ? statement : undefined,
        })
      }
    } else if (
      !isModule &&
      !inAmbientModule &&
      statement.type === "TSModuleDeclaration" &&
      statement.declare &&
      statement.id.type === "StringLiteral" &&
      statement.body?.type === "TSModuleBlock"
    ) {
      for (const child of statement.body.body) {
        collect(child, true)
      }
    }
  }
  for (const statement of program.body) {
    collect(statement, false)
  }

  return [...literals, ...dynamicImports.map((specifier) => ({ specifier }))]
}

function getModuleSpecifier(statement: t.Statement) {
  switch (statement.type) {
    case "ImportDeclaration":
    case "ExportAllDeclaration":
      return statement.source
    case "ExportNamedDeclaration":
      return statement.source ?? undefined
    case "TSImportEqualsDeclaration":
      return statement.moduleReference.type === "TSExternalModuleReference"
        ? statement.moduleReference.expression
        : undefined
    default:
      return undefined
  }
}

// TypeScript's isAnExternalModuleIndicatorNode.
function isModuleIndicator(statement: t.Statement) {
  switch (statement.type) {
    case "ImportDeclaration":
    case "ExportAllDeclaration":
    case "ExportNamedDeclaration":
    case "ExportDefaultDeclaration":
    case "TSExportAssignment":
      return true
    case "TSImportEqualsDeclaration":
      return (
        statement.isExport ||
        statement.moduleReference.type === "TSExternalModuleReference"
      )
    default:
      return false
  }
}

// TypeScript's isExternalModuleNameRelative: a relative path, or one that
// starts at a root or a drive.
function isExternalModuleNameRelative(name: string) {
  return /^\.\.?($|[\\/])|^[\\/]|^[a-zA-Z]:([\\/]|$)/.test(name)
}

// ts-morph's ImportSpecifier#getName(): the imported name, as written.
function getImportedName(code: string, specifier: t.ImportSpecifier) {
  return specifier.imported.type === "StringLiteral"
    ? specifier.imported.value
    : getText(code, specifier.imported)
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
