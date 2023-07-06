import { Transformer } from "@/src/utils/transformers"

export const transformPrefix: Transformer = async ({ sourceFile, config }) => {
  if (!config.prefix) {
    return sourceFile
  }

  const exportDeclaration = sourceFile.getExportDeclarations()[0]

  if (!exportDeclaration) {
    return sourceFile
  }

  // Add alias to named exports
  const namedExports = exportDeclaration.getNamedExports()
  if (namedExports.length) {
    namedExports.forEach((namedExport) => {
      // Skip type only exports
      if (namedExport.isTypeOnly()) return

      const componentName = namedExport.getNameNode().getText()

      // Skip lowercase exports
      if (componentName[0] === componentName[0].toLowerCase()) return

      const newComponentName = `${config.prefix}${componentName}`
      namedExport.renameAlias(newComponentName)
    })
  }

  // Add prefix to types
  const typeAliases = sourceFile
    .getTypeAliases()
    .filter((typeAlias) => typeAlias.isExported())

  if (typeAliases.length) {
    typeAliases.forEach((typeAlias) => {
      const typeName = typeAlias.getNameNode().getText()
      const newTypeName = `${config.prefix}${typeName}`
      typeAlias.rename(newTypeName)
    })
  }

  // Add prefix to interfaces
  const interfaces = sourceFile
    .getInterfaces()
    .filter((interfaceDeclaration) => interfaceDeclaration.isExported())

  if (interfaces.length) {
    interfaces.forEach((interfaceDeclaration) => {
      const interfaceName = interfaceDeclaration.getNameNode().getText()
      const newInterfaceName = `${config.prefix}${interfaceName}`
      interfaceDeclaration.rename(newInterfaceName)
    })
  }

  return sourceFile
}
