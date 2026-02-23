import { iconLibraries, type IconLibraryName } from "@/src/icons/libraries"
import { Transformer } from "@/src/utils/transformers"
import { SourceFile, SyntaxKind } from "ts-morph"

export const transformIcons: Transformer = async ({ sourceFile, config }) => {
  const iconLibrary = config.iconLibrary

  // Fail silently if the icon library is not supported.
  // This is for legacy icon libraries.
  if (!iconLibrary || !(iconLibrary in iconLibraries)) {
    return sourceFile
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

    // Find the library-specific prop (e.g., "lucide", "tabler", "hugeicons")
    const libraryPropAttr = element.getAttributes().find((attr) => {
      if (attr.getKind() !== SyntaxKind.JsxAttribute) {
        return false
      }
      const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
      return jsxAttr.getNameNode().getText() === targetLibrary
    })

    if (!libraryPropAttr) {
      continue // No icon specified for this library
    }

    const jsxIconAttr = libraryPropAttr.asKindOrThrow(SyntaxKind.JsxAttribute)
    const targetIconName = jsxIconAttr
      .getInitializer()
      ?.getText()
      .replace(/^["']|["']$/g, "")

    if (!targetIconName) {
      continue
    }

    if (!transformedIcons.includes(targetIconName)) {
      transformedIcons.push(targetIconName)
    }

    const usage = libraryConfig.usage
    const usageMatch = usage.match(/<(\w+)([^>]*)\s*\/>/)

    // Remove the library-specific prop
    jsxIconAttr.remove()

    // Remove all other library-specific props
    for (const attr of element.getAttributes()) {
      if (attr.getKind() !== SyntaxKind.JsxAttribute) {
        continue
      }
      const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
      const attrName = jsxAttr.getNameNode().getText()
      // Filter out library-specific props (lucide, tabler, hugeicons, etc.)
      if (attrName in iconLibraries) {
        jsxAttr.remove()
      }
    }

    if (!usageMatch) {
      element.getTagNameNode()?.replaceWithText(targetIconName)
      continue
    }

    const [, componentName, defaultPropsStr] = usageMatch

    if (componentName === "ICON") {
      // Get remaining user attributes (non-library props)
      const userAttributes = element
        .getAttributes()
        .filter((attr) => {
          if (attr.getKind() !== SyntaxKind.JsxAttribute) {
            return true
          }
          const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
          const attrName = jsxAttr.getNameNode().getText()
          // Filter out library-specific props (lucide, tabler, hugeicons, etc.)
          return !(attrName in iconLibraries)
        })
        .map((attr) => attr.getText())
        .join(" ")

      if (userAttributes.trim()) {
        element.replaceWithText(`<${targetIconName} ${userAttributes} />`)
      } else {
        element.getTagNameNode()?.replaceWithText(targetIconName)
      }
    } else {
      const existingPropNames = new Set(
        element
          .getAttributes()
          .filter((attr) => attr.getKind() === SyntaxKind.JsxAttribute)
          .map((attr) =>
            attr.asKindOrThrow(SyntaxKind.JsxAttribute).getNameNode().getText()
          )
      )

      // Replace ICON placeholder in defaultPropsStr with actual icon name
      const defaultPropsWithIcon = defaultPropsStr.replace(
        /\{ICON\}/g,
        `{${targetIconName}}`
      )

      const defaultPropsToAdd = defaultPropsWithIcon
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
          const attrName = jsxAttr.getNameNode().getText()
          // Filter out library-specific props (lucide, tabler, hugeicons, etc.)
          return !(attrName in iconLibraries)
        })
        .map((attr) => attr.getText())
        .join(" ")

      const allProps = [...defaultPropsToAdd, userAttributes]
        .filter(Boolean)
        .join(" ")

      element.replaceWithText(`<${componentName} ${allProps} />`)
    }
  }

  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier()?.getText()
    if (moduleSpecifier?.includes("icon-placeholder")) {
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
