import { randomBytes } from "crypto"
import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { iconLibraries } from "@/src/icons/libraries"
import {
  getIconModuleSpecifier,
  parseImportTemplate,
  parseUsageTemplate,
  type ParsedUsage,
} from "@/src/icons/templates"
import { getRegistryIcons } from "@/src/registry/api"
import { iconsSchema } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import fg from "fast-glob"
import fsExtra from "fs-extra"
import prompts from "prompts"
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  Project,
  ScriptKind,
  SourceFile,
  SyntaxKind,
} from "ts-morph"
import { z } from "zod"

// Radix is a legacy icon library: still migratable (in both directions, with
// coverage limited to the legacy mapping entries) but not offered to new
// projects, so it lives here instead of in `iconLibraries`.
export const MIGRATION_ICON_LIBRARIES = {
  ...iconLibraries,
  radix: {
    name: "radix",
    title: "Radix Icons",
    packages: ["@radix-ui/react-icons"],
    import: "import { ICON } from '@radix-ui/react-icons'",
    usage: "<ICON />",
    export: "@radix-ui/react-icons",
  },
} as const

export type MigrationIconLibraryName = keyof typeof MIGRATION_ICON_LIBRARIES

type IconsMapping = z.infer<typeof iconsSchema>

export interface SkippedIcon {
  icon: string
  reason: string
}

export async function migrateIcons(
  config: Config,
  options: {
    from?: string
    to?: string
    path?: string
    yes?: boolean
  } = {}
) {
  // Determine files to migrate.
  let files: string[]
  let basePath: string

  if (options.path) {
    // User provided a path/glob.
    basePath = config.resolvedPaths.cwd
    const isGlob = options.path.includes("*")

    if (isGlob) {
      files = await fg(options.path, {
        cwd: basePath,
        onlyFiles: true,
        ignore: ["**/node_modules/**"],
      })
    } else {
      const fullPath = path.resolve(basePath, options.path)
      const stat = await fs.stat(fullPath).catch(() => null)

      if (!stat) {
        throw new Error(`File not found: ${options.path}`)
      }

      if (stat.isDirectory()) {
        basePath = fullPath
        files = await fg("**/*.{js,ts,jsx,tsx}", {
          cwd: basePath,
          onlyFiles: true,
          ignore: ["**/node_modules/**"],
        })
      } else if (stat.isFile()) {
        files = [options.path]
      } else {
        throw new Error(`Unsupported path type: ${options.path}`)
      }
    }

    if (files.length === 0) {
      throw new Error(`No files found matching: ${options.path}`)
    }
  } else {
    if (!config.resolvedPaths.ui) {
      throw new Error(
        "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
      )
    }

    basePath = config.resolvedPaths.ui
    files = await fg("**/*.{js,ts,jsx,tsx}", {
      cwd: basePath,
    })
  }

  const registryIcons = await getRegistryIcons()

  if (Object.keys(registryIcons).length === 0) {
    throw new Error("Something went wrong fetching the registry icons.")
  }

  const libraryChoices = Object.entries(MIGRATION_ICON_LIBRARIES).map(
    ([name, iconLibrary]) => ({
      title: iconLibrary.title,
      value: name,
    })
  )

  for (const libraryName of [options.from, options.to]) {
    if (libraryName && !(libraryName in MIGRATION_ICON_LIBRARIES)) {
      throw new Error(
        `Unknown icon library: ${libraryName}. Available libraries: ${Object.keys(
          MIGRATION_ICON_LIBRARIES
        ).join(", ")}.`
      )
    }
  }

  let sourceLibraryName = options.from
  let targetLibraryName = options.to

  if (!sourceLibraryName || !targetLibraryName) {
    const currentLibraryIndex = libraryChoices.findIndex(
      (choice) => choice.value === config.iconLibrary
    )
    const migrateOptions = await prompts([
      {
        type: sourceLibraryName ? null : "select",
        name: "sourceLibrary",
        message: `Which icon library would you like to ${highlighter.info(
          "migrate from"
        )}?`,
        choices: libraryChoices,
        initial: currentLibraryIndex === -1 ? 0 : currentLibraryIndex,
      },
      {
        type: targetLibraryName ? null : "select",
        name: "targetLibrary",
        message: `Which icon library would you like to ${highlighter.info(
          "migrate to"
        )}?`,
        choices: libraryChoices,
      },
    ])

    sourceLibraryName = sourceLibraryName ?? migrateOptions.sourceLibrary
    targetLibraryName = targetLibraryName ?? migrateOptions.targetLibrary
  }

  if (!sourceLibraryName || !targetLibraryName) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  if (sourceLibraryName === targetLibraryName) {
    throw new Error(
      "You cannot migrate to the same icon library. Please choose a different icon library."
    )
  }

  const sourceLibrary =
    MIGRATION_ICON_LIBRARIES[sourceLibraryName as MigrationIconLibraryName]
  const targetLibrary =
    MIGRATION_ICON_LIBRARIES[targetLibraryName as MigrationIconLibraryName]

  if (!options.yes) {
    const relativePath = options.path
      ? options.path
      : `./${path.relative(config.resolvedPaths.cwd, basePath)}`
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      initial: true,
      message: `We will migrate ${highlighter.info(
        files.length
      )} files in ${highlighter.info(relativePath)} from ${highlighter.info(
        sourceLibrary.title
      )} to ${highlighter.info(targetLibrary.title)}. Continue?`,
    })

    if (!confirm) {
      logger.info("Migration cancelled.")
      process.exit(0)
    }
  }

  await updateDependencies([...targetLibrary.packages], [], config, {
    silent: false,
  })

  const migrationSpinner = spinner(`Migrating icons...`)?.start()
  const skippedIcons = new Map<string, string>()

  await Promise.all(
    files.map(async (file) => {
      migrationSpinner.text = `Migrating ${file}...`

      const filePath = path.join(basePath, file)
      const fileContent = await fs.readFile(filePath, "utf-8")

      const { content, skipped } = await migrateIconsFileWithReport(
        fileContent,
        sourceLibraryName as MigrationIconLibraryName,
        targetLibraryName as MigrationIconLibraryName,
        registryIcons
      )

      for (const skippedIcon of skipped) {
        if (!skippedIcons.has(skippedIcon.icon)) {
          skippedIcons.set(skippedIcon.icon, skippedIcon.reason)
        }
      }

      await fs.writeFile(filePath, content)
    })
  )

  migrationSpinner.succeed("Migration complete.")

  // Keep components.json in sync so future `shadcn add` installs use the
  // new icon library. Skip for scoped runs: a partial migration should not
  // change project-wide config.
  if (!options.path) {
    await updateConfigIconLibrary(config, targetLibraryName)
  }

  if (skippedIcons.size > 0) {
    logger.break()
    logger.warn(
      `Skipped ${skippedIcons.size} icon${
        skippedIcons.size === 1 ? "" : "s"
      }. These were left untouched:`
    )
    for (const [icon, reason] of Array.from(skippedIcons)) {
      logger.warn(`  - ${icon}: ${reason}`)
    }
  }
}

async function updateConfigIconLibrary(config: Config, iconLibrary: string) {
  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")

  if (!fsExtra.existsSync(targetPath)) {
    return
  }

  const rawConfig = await fsExtra.readJson(targetPath)

  if (rawConfig.iconLibrary === iconLibrary) {
    return
  }

  rawConfig.iconLibrary = iconLibrary
  await fsExtra.writeJson(targetPath, rawConfig, { spaces: 2 })
  logger.info(
    `Updated ${highlighter.info("iconLibrary")} in components.json to ${highlighter.info(
      iconLibrary
    )}.`
  )
}

export async function migrateIconsFile(
  content: string,
  sourceLibrary: MigrationIconLibraryName,
  targetLibrary: MigrationIconLibraryName,
  iconsMapping: IconsMapping
) {
  const result = await migrateIconsFileWithReport(
    content,
    sourceLibrary,
    targetLibrary,
    iconsMapping
  )

  return result.content
}

export async function migrateIconsFileWithReport(
  content: string,
  sourceLibraryName: MigrationIconLibraryName,
  targetLibraryName: MigrationIconLibraryName,
  iconsMapping: IconsMapping
): Promise<{ content: string; skipped: SkippedIcon[] }> {
  const sourceLibrary = MIGRATION_ICON_LIBRARIES[sourceLibraryName]
  const targetLibrary = MIGRATION_ICON_LIBRARIES[targetLibraryName]

  const sourceIconModule = getIconModuleSpecifier(sourceLibrary.import)
  const sourceUsage = parseUsageTemplate(sourceLibrary.usage)
  const targetUsage = parseUsageTemplate(targetLibrary.usage)

  if (!sourceIconModule) {
    throw new Error(
      `Could not resolve the icon import for ${sourceLibrary.title}.`
    )
  }

  const reverseIndex = buildReverseIconIndex(iconsMapping, sourceLibraryName)
  const skipped: SkippedIcon[] = []

  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const project = new Project({
    compilerOptions: {},
  })

  const tempFile = path.join(
    dir,
    `shadcn-icons-${randomBytes(4).toString("hex")}.tsx`
  )
  const sourceFile = project.createSourceFile(tempFile, content, {
    scriptKind: ScriptKind.TSX,
  })

  let migratedIcons: string[] = []

  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    if (
      importDeclaration.getModuleSpecifier()?.getLiteralValue() !==
        sourceIconModule ||
      importDeclaration.isTypeOnly()
    ) {
      continue
    }

    for (const specifier of [...(importDeclaration.getNamedImports() ?? [])]) {
      // Type imports (e.g. LucideIcon) are not icons.
      if (specifier.isTypeOnly()) {
        continue
      }

      const importedName = specifier.getName()
      const localName = specifier.getAliasNode()?.getText() ?? importedName

      const canonical = reverseIndex.get(importedName)
      const targetIcon = canonical
        ? iconsMapping[canonical]?.[targetLibraryName]
        : undefined

      if (!targetIcon) {
        skipped.push({
          icon: importedName,
          reason: `no ${targetLibrary.title} equivalent found`,
        })
        continue
      }

      const usages = findIconUsages(sourceFile, localName, sourceUsage)

      if (usages.complex) {
        skipped.push({
          icon: importedName,
          reason: "unsupported usage (e.g. referenced outside JSX)",
        })
        continue
      }

      const targetIsWrapper = targetUsage.componentName !== "ICON"
      if (targetIsWrapper && (usages.references > 0 || usages.paired > 0)) {
        skipped.push({
          icon: importedName,
          reason: `cannot be wrapped in <${targetUsage.componentName} />`,
        })
        continue
      }

      specifier.remove()
      rewriteIconUsages(
        sourceFile,
        localName,
        targetIcon,
        sourceUsage,
        targetUsage
      )

      if (!migratedIcons.includes(targetIcon)) {
        migratedIcons.push(targetIcon)
      }
    }

    // If the named import is empty, remove the import declaration.
    if (
      importDeclaration.getNamedImports()?.length === 0 &&
      !importDeclaration.getDefaultImport() &&
      !importDeclaration.getNamespaceImport()
    ) {
      importDeclaration.remove()
    }
  }

  // If the source library renders through a wrapper component (e.g.
  // HugeiconsIcon) and no usages remain, remove the wrapper import too.
  if (sourceUsage.componentName !== "ICON" && migratedIcons.length > 0) {
    removeUnusedWrapperImport(sourceFile, sourceLibrary.import, sourceUsage)
  }

  if (migratedIcons.length > 0) {
    for (const parsedImport of parseImportTemplate(targetLibrary.import)) {
      const namedImports = parsedImport.namedImports.flatMap((name) =>
        name === "ICON" ? migratedIcons : [name]
      )

      // Non-icon imports (e.g. the wrapper component) may already exist.
      const alreadyImported =
        !parsedImport.namedImports.includes("ICON") &&
        sourceFile
          .getImportDeclarations()
          .some(
            (declaration) =>
              declaration.getModuleSpecifier()?.getLiteralValue() ===
                parsedImport.moduleSpecifier &&
              declaration
                .getNamedImports()
                .some((named) => namedImports.includes(named.getName()))
          )

      if (alreadyImported) {
        continue
      }

      sourceFile.addImportDeclaration({
        moduleSpecifier: parsedImport.moduleSpecifier,
        namedImports: namedImports.map((name) => ({
          name,
        })),
      })
    }
  }

  return { content: sourceFile.getText(), skipped }
}

function buildReverseIconIndex(
  iconsMapping: IconsMapping,
  sourceLibraryName: MigrationIconLibraryName
) {
  const index = new Map<string, string>()

  for (const [canonical, entry] of Object.entries(iconsMapping)) {
    const iconName = entry[sourceLibraryName]
    if (iconName && !index.has(iconName)) {
      index.set(iconName, canonical)
    }
  }

  // Lucide exports every icon under two names (e.g. Check and CheckIcon).
  // The mapping only records one of them, so index both.
  if (sourceLibraryName === "lucide") {
    for (const [iconName, canonical] of Array.from(index)) {
      const alias = iconName.endsWith("Icon")
        ? iconName.slice(0, -"Icon".length)
        : `${iconName}Icon`
      if (alias && !index.has(alias)) {
        index.set(alias, canonical)
      }
    }
  }

  return index
}

interface IconUsages {
  selfClosing: number
  paired: number
  references: number
  complex: boolean
}

function findIconUsages(
  sourceFile: SourceFile,
  localName: string,
  sourceUsage: ParsedUsage
): IconUsages {
  const usages: IconUsages = {
    selfClosing: 0,
    paired: 0,
    references: 0,
    complex: false,
  }

  for (const identifier of sourceFile.getDescendantsOfKind(
    SyntaxKind.Identifier
  )) {
    if (identifier.getText() !== localName) {
      continue
    }

    if (identifier.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) {
      continue
    }

    const parent = identifier.getParent()
    const parentKind = parent?.getKind()

    if (sourceUsage.componentName === "ICON") {
      if (parentKind === SyntaxKind.JsxSelfClosingElement) {
        usages.selfClosing++
      } else if (parentKind === SyntaxKind.JsxOpeningElement) {
        usages.paired++
      } else if (parentKind === SyntaxKind.JsxClosingElement) {
        // Counted via the opening element.
      } else if (
        parentKind === SyntaxKind.JsxExpression &&
        parent?.getParent()?.getKind() === SyntaxKind.JsxAttribute
      ) {
        usages.references++
      } else {
        usages.complex = true
      }
      continue
    }

    // Wrapper-style source (e.g. <HugeiconsIcon icon={ICON} />): the icon
    // only ever appears inside the wrapper's icon attribute.
    const jsxAttribute = identifier.getFirstAncestorByKind(
      SyntaxKind.JsxAttribute
    )
    const wrapperElement = identifier.getFirstAncestorByKind(
      SyntaxKind.JsxSelfClosingElement
    )

    if (
      parentKind === SyntaxKind.JsxExpression &&
      jsxAttribute?.getNameNode().getText() === sourceUsage.iconAttribute &&
      wrapperElement?.getTagNameNode()?.getText() === sourceUsage.componentName
    ) {
      usages.selfClosing++
    } else {
      usages.complex = true
    }
  }

  return usages
}

function rewriteIconUsages(
  sourceFile: SourceFile,
  localName: string,
  targetIcon: string,
  sourceUsage: ParsedUsage,
  targetUsage: ParsedUsage
) {
  if (sourceUsage.componentName === "ICON") {
    // Direct-style source: the icon is the JSX tag.
    for (const element of sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement
    )) {
      if (element.getTagNameNode()?.getText() !== localName) {
        continue
      }
      rewriteElement(element, targetIcon, sourceUsage, targetUsage)
    }

    for (const element of sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxElement
    )) {
      const openingElement = element.getOpeningElement()
      if (openingElement.getTagNameNode()?.getText() !== localName) {
        continue
      }
      // Wrapper targets are filtered out before we get here.
      applyUsageAttributes(openingElement, sourceUsage, targetUsage)
      openingElement.getTagNameNode()?.replaceWithText(targetIcon)
      element.getClosingElement().getTagNameNode()?.replaceWithText(targetIcon)
    }

    for (const identifier of sourceFile.getDescendantsOfKind(
      SyntaxKind.Identifier
    )) {
      if (identifier.getText() !== localName) {
        continue
      }
      if (identifier.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) {
        continue
      }
      const parent = identifier.getParent()
      if (
        parent?.getKind() === SyntaxKind.JsxExpression &&
        parent?.getParent()?.getKind() === SyntaxKind.JsxAttribute
      ) {
        identifier.replaceWithText(targetIcon)
      }
    }

    return
  }

  // Wrapper-style source: rewrite each wrapper element using this icon.
  for (const element of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement
  )) {
    if (
      element.getTagNameNode()?.getText() !== sourceUsage.componentName ||
      !sourceUsage.iconAttribute
    ) {
      continue
    }

    const iconAttribute = element.getAttribute(sourceUsage.iconAttribute)
    if (!iconAttribute || iconAttribute.getKind() !== SyntaxKind.JsxAttribute) {
      continue
    }

    const iconExpression = iconAttribute
      .asKindOrThrow(SyntaxKind.JsxAttribute)
      .getInitializer()
      ?.getText()

    if (iconExpression !== `{${localName}}`) {
      continue
    }

    rewriteElement(element, targetIcon, sourceUsage, targetUsage, {
      excludeAttribute: sourceUsage.iconAttribute,
    })
  }
}

function rewriteElement(
  element: JsxSelfClosingElement,
  targetIcon: string,
  sourceUsage: ParsedUsage,
  targetUsage: ParsedUsage,
  options: { excludeAttribute?: string } = {}
) {
  const sourceIsPlain =
    sourceUsage.componentName === "ICON" &&
    Object.keys(sourceUsage.attributes).length === 0
  const targetIsPlain =
    targetUsage.componentName === "ICON" &&
    Object.keys(targetUsage.attributes).length === 0

  // Plain tag to plain tag (e.g. lucide -> radix): rename in place to
  // preserve the original formatting.
  if (sourceIsPlain && targetIsPlain) {
    element.getTagNameNode()?.replaceWithText(targetIcon)
    return
  }

  const userAttributes = element
    .getAttributes()
    .filter((attribute) => {
      if (attribute.getKind() !== SyntaxKind.JsxAttribute) {
        return true
      }
      const jsxAttribute = attribute.asKindOrThrow(SyntaxKind.JsxAttribute)
      const name = jsxAttribute.getNameNode().getText()

      if (name === options.excludeAttribute) {
        return false
      }

      // Drop defaults the source library's template added at install time,
      // but only on an exact match (a customized value is user intent).
      return (
        sourceUsage.attributes[name] !==
        (jsxAttribute.getInitializer()?.getText() ?? "")
      )
    })
    .map((attribute) => attribute.getText())

  const userAttributeNames = new Set(
    element
      .getAttributes()
      .filter((attribute) => attribute.getKind() === SyntaxKind.JsxAttribute)
      .map((attribute) =>
        attribute.asKindOrThrow(SyntaxKind.JsxAttribute).getNameNode().getText()
      )
  )

  const defaultAttributes = Object.entries(targetUsage.attributes)
    .filter(([name]) => !userAttributeNames.has(name))
    .map(([name, value]) => `${name}=${value}`)

  const parts =
    targetUsage.componentName === "ICON"
      ? [targetIcon, ...defaultAttributes, ...userAttributes]
      : [
          targetUsage.componentName,
          `${targetUsage.iconAttribute}={${targetIcon}}`,
          ...defaultAttributes,
          ...userAttributes,
        ]

  element.replaceWithText(`<${parts.join(" ")} />`)
}

function applyUsageAttributes(
  element: JsxOpeningElement | JsxSelfClosingElement,
  sourceUsage: ParsedUsage,
  targetUsage: ParsedUsage
) {
  for (const [name, value] of Object.entries(sourceUsage.attributes)) {
    const attribute = element.getAttribute(name)
    if (
      attribute?.getKind() === SyntaxKind.JsxAttribute &&
      (attribute
        .asKindOrThrow(SyntaxKind.JsxAttribute)
        .getInitializer()
        ?.getText() ?? "") === value
    ) {
      attribute.remove()
    }
  }

  for (const [name, value] of Object.entries(targetUsage.attributes)) {
    if (!element.getAttribute(name)) {
      element.addAttribute({ name, initializer: value })
    }
  }
}

function removeUnusedWrapperImport(
  sourceFile: SourceFile,
  importTemplate: string,
  sourceUsage: ParsedUsage
) {
  const wrapperName = sourceUsage.componentName

  const wrapperStillUsed =
    sourceFile
      .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
      .some((element) => element.getTagNameNode()?.getText() === wrapperName) ||
    sourceFile
      .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
      .some((element) => element.getTagNameNode()?.getText() === wrapperName)

  if (wrapperStillUsed) {
    return
  }

  const wrapperModules = parseImportTemplate(importTemplate)
    .filter((parsed) => !parsed.namedImports.includes("ICON"))
    .map((parsed) => parsed.moduleSpecifier)

  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    if (
      !wrapperModules.includes(
        importDeclaration.getModuleSpecifier()?.getLiteralValue() ?? ""
      )
    ) {
      continue
    }

    for (const specifier of [...(importDeclaration.getNamedImports() ?? [])]) {
      if (specifier.getName() === wrapperName) {
        specifier.remove()
      }
    }

    if (
      importDeclaration.getNamedImports()?.length === 0 &&
      !importDeclaration.getDefaultImport() &&
      !importDeclaration.getNamespaceImport()
    ) {
      importDeclaration.remove()
    }
  }
}
