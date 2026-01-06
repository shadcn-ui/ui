import { Transformer } from "@/src/utils/transformers"

/**
 * Transforms component names in a source file based on a rename map.
 * For example, renaming "Dialog" to "Modal" will rename:
 * - Dialog -> Modal
 * - DialogTitle -> ModalTitle
 * - DialogContent -> ModalContent
 * - etc.
 */
export const transformRename: Transformer = async ({
  sourceFile,
  renameMap,
}) => {
  if (!renameMap || Object.keys(renameMap).length === 0) {
    return sourceFile
  }

  // Get the base rename (e.g., "Dialog" -> "Modal")
  const [oldBase, newBase] = Object.entries(renameMap)[0]

  // Helper function to rename if name starts with oldBase
  const getNewName = (name: string): string | null => {
    if (name === oldBase) {
      return newBase
    }
    if (name.startsWith(oldBase)) {
      return newBase + name.slice(oldBase.length)
    }
    return null
  }

  // 1. Rename function declarations
  sourceFile.getFunctions().forEach((func) => {
    const oldName = func.getName()
    if (oldName) {
      const newName = getNewName(oldName)
      if (newName) {
        func.rename(newName)
      }
    }
  })

  // 2. Rename variable declarations (const Component = ...)
  sourceFile.getVariableDeclarations().forEach((variable) => {
    const oldName = variable.getName()
    const newName = getNewName(oldName)
    if (newName) {
      variable.rename(newName)
    }
  })

  // 3. Rename type aliases (type DialogProps = ...)
  sourceFile.getTypeAliases().forEach((typeAlias) => {
    const oldName = typeAlias.getName()
    const newName = getNewName(oldName)
    if (newName) {
      typeAlias.rename(newName)
    }
  })

  // 4. Rename interfaces (interface DialogProps { ... })
  sourceFile.getInterfaces().forEach((iface) => {
    const oldName = iface.getName()
    const newName = getNewName(oldName)
    if (newName) {
      iface.rename(newName)
    }
  })

  // 5. Rename export declarations
  sourceFile.getExportDeclarations().forEach((exportDecl) => {
    const namedExports = exportDecl.getNamedExports()
    namedExports.forEach((namedExport) => {
      const oldName = namedExport.getName()
      const newName = getNewName(oldName)
      if (newName) {
        namedExport.setName(newName)
      }
      const aliasNode = namedExport.getAliasNode()
      if (aliasNode) {
        const aliasText = aliasNode.getText()
        const newAlias = getNewName(aliasText)
        if (newAlias) {
          namedExport.setAlias(newAlias)
        }
      }
    })
  })

  return sourceFile
}

/**
 * Creates a rename map from the base component name.
 * E.g., "dialog" with newName "modal" creates { "Dialog": "Modal" }
 */
export function createRenameMapFromComponentName(
  componentName: string,
  newName: string
): Record<string, string> {
  // Convert to PascalCase for the component name
  const oldPascal = toPascalCase(componentName)
  const newPascal = toPascalCase(newName)

  return {
    [oldPascal]: newPascal,
  }
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}
