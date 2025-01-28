import { getRegistryIcons } from "@/src/registry/api"
import { ICON_LIBRARIES } from "@/src/utils/icon-libraries"
import { Transformer } from "@/src/utils/transformers"
import { SourceFile, SyntaxKind } from "ts-morph"

// Lucide is the default icon library in the registry.
const SOURCE_LIBRARY = "lucide"

export const transformIcons: Transformer = async ({ sourceFile, config }) => {
  // No transform if we cannot read the icon library.
  if (!config.iconLibrary || !(config.iconLibrary in ICON_LIBRARIES)) {
    return sourceFile
  }

  const registryIcons = await getRegistryIcons()
  const sourceLibrary = SOURCE_LIBRARY
  const targetLibrary = config.iconLibrary

  if (sourceLibrary === targetLibrary) {
    return sourceFile
  }

  let targetedIcons: string[] = []
  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    if (
      importDeclaration.getModuleSpecifier()?.getText() !==
      `"${ICON_LIBRARIES[SOURCE_LIBRARY].import}"`
    ) {
      continue
    }

    for (const specifier of importDeclaration.getNamedImports() ?? []) {
      const iconName = specifier.getName()

      const targetedIcon = registryIcons[iconName]?.[targetLibrary]

      if (!targetedIcon || targetedIcons.includes(targetedIcon)) {
        continue
      }

      targetedIcons.push(targetedIcon)

      // Remove the named import.
      specifier.remove()

      // Replace with the targeted icon.
      sourceFile
        .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
        .filter((node) => node.getTagNameNode()?.getText() === iconName)
        .forEach((node) => node.getTagNameNode()?.replaceWithText(targetedIcon))
    }

    // If the named import is empty, remove the import declaration.
    if (importDeclaration.getNamedImports()?.length === 0) {
      importDeclaration.remove()
    }
  }

  if (targetedIcons.length > 0) {
    const iconImportDeclaration = sourceFile.addImportDeclaration({
      moduleSpecifier:
        ICON_LIBRARIES[targetLibrary as keyof typeof ICON_LIBRARIES]?.import,
      namedImports: targetedIcons.map((icon) => ({
        name: icon,
      })),
    })

    if (!_useSemicolon(sourceFile)) {
      iconImportDeclaration.replaceWithText(
        iconImportDeclaration.getText().replace(";", "")
      )
    }
  }

  return sourceFile
}

function _useSemicolon(sourceFile: SourceFile) {
  return (
    sourceFile.getImportDeclarations()?.[0]?.getText().endsWith(";") ?? false
  )
}
