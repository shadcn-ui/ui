import { iconLibraries, type IconLibraryName } from "@/src/icons/libaries"
import { icons } from "@/src/icons/mapping"
import { InvalidConfigIconLibraryError } from "@/src/registry/errors"
import { Transformer } from "@/src/utils/transformers"
import { SourceFile, SyntaxKind } from "ts-morph"

const ICON_PLACEHOLDER_IMPORT_PATH =
  "@/app/(app)/design/components/icon-placeholder"

export const transformIcons: Transformer = async ({ sourceFile, config }) => {
  const iconLibrary = config.iconLibrary
  if (!iconLibrary) {
    return sourceFile
  }

  if (!(iconLibrary in iconLibraries)) {
    throw new InvalidConfigIconLibraryError(
      iconLibrary,
      Object.keys(iconLibraries)
    )
  }

  const targetLibrary = iconLibrary as IconLibraryName
  const libraryConfig = iconLibraries[targetLibrary]
  let transformedIcons: string[] = []

  for (const element of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement
  )) {
    if (element.getTagNameNode()?.getText() !== "IconPlaceholder") {
      continue
    }

    const iconAttr = element.getAttributes().find((attr) => {
      if (attr.getKind() !== SyntaxKind.JsxAttribute) {
        return false
      }
      const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
      return jsxAttr.getNameNode().getText() === "icon"
    })

    if (!iconAttr) {
      continue
    }

    const jsxIconAttr = iconAttr.asKindOrThrow(SyntaxKind.JsxAttribute)
    const iconValue = jsxIconAttr
      .getInitializer()
      ?.getText()
      .replace(/^["']|["']$/g, "")

    if (!iconValue || !(iconValue in icons)) {
      continue
    }

    const targetIconName = icons[iconValue as keyof typeof icons][targetLibrary]

    if (!targetIconName) {
      continue
    }

    if (!transformedIcons.includes(targetIconName)) {
      transformedIcons.push(targetIconName)
    }

    const usage = libraryConfig.usage
    const usageMatch = usage.match(/<(\w+)([^>]*)\s*\/>/)

    if (!usageMatch) {
      jsxIconAttr.remove()
      element.getTagNameNode()?.replaceWithText(targetIconName)
      continue
    }

    const [, componentName, defaultPropsStr] = usageMatch

    if (componentName === "ICON") {
      jsxIconAttr.remove()
      element.getTagNameNode()?.replaceWithText(targetIconName)
    } else {
      const existingPropNames = new Set(
        element
          .getAttributes()
          .filter((attr) => attr.getKind() === SyntaxKind.JsxAttribute)
          .map((attr) =>
            attr.asKindOrThrow(SyntaxKind.JsxAttribute).getNameNode().getText()
          )
      )

      const defaultPropsToAdd = defaultPropsStr
        .trim()
        .split(/\s+(?=\w+=)/)
        .filter((prop) => prop)
        .map((prop) => {
          const propName = prop.split("=")[0]
          return propName && !existingPropNames.has(propName) ? prop : null
        })
        .filter(Boolean)

      const userAttributes = element
        .getAttributes()
        .filter((attr) => {
          if (attr.getKind() !== SyntaxKind.JsxAttribute) {
            return true
          }
          const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
          return jsxAttr.getNameNode().getText() !== "icon"
        })
        .map((attr) => attr.getText())
        .join(" ")

      const iconProp = `icon={${targetIconName}}`
      const allProps = [iconProp, ...defaultPropsToAdd, userAttributes]
        .filter(Boolean)
        .join(" ")

      element.replaceWithText(`<${componentName} ${allProps} />`)
    }
  }

  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier()?.getText()
    if (moduleSpecifier === `"${ICON_PLACEHOLDER_IMPORT_PATH}"`) {
      const namedImports = importDeclaration.getNamedImports() ?? []
      const iconPlaceholderImport = namedImports.find(
        (specifier) => specifier.getName() === "IconPlaceholder"
      )

      if (iconPlaceholderImport) {
        iconPlaceholderImport.remove()
      }

      if (importDeclaration.getNamedImports()?.length === 0) {
        importDeclaration.remove()
      }
    }
  }

  if (transformedIcons.length > 0) {
    const importStatements = libraryConfig.import.split("\n")
    const addedImports = []

    for (const importStmt of importStatements) {
      const importMatch = importStmt.match(
        /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/
      )

      if (!importMatch) continue

      const [, importedNames, modulePath] = importMatch
      const namedImports = importedNames
        .split(",")
        .map((name) => name.trim())
        .map((name) => {
          if (name === "ICON") {
            return transformedIcons.map((icon) => ({ name: icon }))
          }
          return { name }
        })
        .flat()

      const newImport = sourceFile.addImportDeclaration({
        moduleSpecifier: modulePath,
        namedImports,
      })

      addedImports.push(newImport)
    }

    if (!_useSemicolon(sourceFile)) {
      for (const importDecl of addedImports) {
        importDecl.replaceWithText(importDecl.getText().replace(";", ""))
      }
    }
  }

  return sourceFile
}

function _useSemicolon(sourceFile: SourceFile) {
  return (
    sourceFile.getImportDeclarations()?.[0]?.getText().endsWith(";") ?? false
  )
}
