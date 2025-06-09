import { randomBytes } from "crypto"
import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import fg from "fast-glob"
import prompts from "prompts"
import { Project, ScriptKind } from "ts-morph"

export async function migrateRadix(config: Config) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const uiPath = config.resolvedPaths.ui
  const files = await fg("**/*.{js,ts,jsx,tsx}", {
    cwd: uiPath,
  })

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    initial: true,
    message: `We will migrate ${highlighter.info(
      files.length
    )} files in ${highlighter.info(
      `./${path.relative(config.resolvedPaths.cwd, uiPath)}`
    )} from individual Radix UI packages to the unified ${highlighter.info(
      "radix-ui"
    )} package. Continue?`,
  })

  if (!confirm) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  const migrationSpinner = spinner(`Migrating Radix UI imports...`)?.start()

  await Promise.all(
    files.map(async (file) => {
      migrationSpinner.text = `Migrating ${file}...`

      const filePath = path.join(uiPath, file)
      const fileContent = await fs.readFile(filePath, "utf-8")

      const content = await migrateRadixFile(fileContent)

      await fs.writeFile(filePath, content)
    })
  )

  migrationSpinner.succeed("Source files migrated.")

  // Update package.json dependencies
  const packageSpinner = spinner(`Updating package.json...`)?.start()

  try {
    const packageJson = getPackageInfo(config.resolvedPaths.cwd, false)
    
    if (!packageJson) {
      packageSpinner.fail("Could not read package.json")
      logger.warn("Could not update package.json. You may need to manually replace @radix-ui/react-* packages with radix-ui")
      return
    }

    const radixPackages: string[] = []

    // Check dependencies
    if (packageJson.dependencies) {
      for (const [pkg, version] of Object.entries(packageJson.dependencies)) {
        if (pkg.startsWith("@radix-ui/react-")) {
          radixPackages.push(pkg)
          delete packageJson.dependencies[pkg]
        }
      }
    }

    // Check devDependencies
    if (packageJson.devDependencies) {
      for (const [pkg, version] of Object.entries(packageJson.devDependencies)) {
        if (pkg.startsWith("@radix-ui/react-")) {
          radixPackages.push(pkg)
          delete packageJson.devDependencies[pkg]
        }
      }
    }

    // Add radix-ui if we found any Radix packages
    if (radixPackages.length > 0) {
      if (!packageJson.dependencies) {
        packageJson.dependencies = {}
      }
      packageJson.dependencies["radix-ui"] = "latest"

      const packageJsonPath = path.join(config.resolvedPaths.cwd, "package.json")
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
      
      packageSpinner.succeed(`Updated package.json: removed ${radixPackages.length} Radix packages, added radix-ui`)
      logger.info(`Removed packages: ${radixPackages.join(", ")}`)
      
      // Detect package manager and show appropriate install command
      const packageManager = await getPackageManager(config.resolvedPaths.cwd)
      const installCommand = getInstallCommand(packageManager)
      
      logger.info("Run your package manager to install the new dependency:")
      logger.info(`  ${installCommand}`)
    } else {
      packageSpinner.succeed("No Radix UI packages found in package.json")
    }
  } catch (error) {
    packageSpinner.fail("Failed to update package.json")
    logger.warn("Could not update package.json. You may need to manually replace @radix-ui/react-* packages with radix-ui")
  }

  logger.info("Migration complete!")
}

function getInstallCommand(packageManager: "yarn" | "pnpm" | "bun" | "npm" | "deno"): string {
  switch (packageManager) {
    case "yarn":
      return "yarn install"
    case "pnpm":
      return "pnpm install"
    case "bun":
      return "bun install"
    case "deno":
      return "deno install"
    case "npm":
    default:
      return "npm install"
  }
}

export async function migrateRadixFile(content: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const project = new Project({
    compilerOptions: {},
  })

  const tempFile = path.join(
    dir,
    `shadcn-radix-${randomBytes(4).toString("hex")}.tsx`
  )
  const sourceFile = project.createSourceFile(tempFile, content, {
    scriptKind: ScriptKind.TSX,
  })

  const radixImportsToAdd: Array<{ name: string; alias?: string }> = []
  const radixPackagePattern = /^@radix-ui\/react-(.+)$/
  let firstRadixImport: any = undefined
  const radixImportsToRemove: any[] = []

  // First pass: collect all imports and find first Radix import
  const importDeclarations = sourceFile.getImportDeclarations()
  for (const importDeclaration of importDeclarations) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier()?.getText()
    if (!moduleSpecifier) continue

    const cleanModuleSpecifier = moduleSpecifier.slice(1, -1) // Remove quotes
    const match = cleanModuleSpecifier.match(radixPackagePattern)

    if (!match) continue

    // Track the first Radix import node
    if (!firstRadixImport) {
      firstRadixImport = importDeclaration
    } else {
      // All subsequent Radix imports will be removed
      radixImportsToRemove.push(importDeclaration)
    }

    const componentName = match[1]
    
    // Handle namespace imports like "import * as DialogPrimitive from '@radix-ui/react-dialog'"
    const namespaceImport = importDeclaration.getNamespaceImport()
    if (namespaceImport) {
      const aliasName = namespaceImport.getText()
      
      // Map the component name (e.g., "dialog" -> "Dialog", "dropdown-menu" -> "DropdownMenu")
      const componentImportName = componentName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      
      radixImportsToAdd.push({ name: componentImportName, alias: aliasName })
    }

    // Handle named imports
    const namedImports = importDeclaration.getNamedImports()
    if (namedImports && namedImports.length > 0) {
      for (const namedImport of namedImports) {
        const importName = namedImport.getName()
        const alias = namedImport.getAliasNode()?.getText()
        
        radixImportsToAdd.push({ name: importName, alias })
      }
    }
  }

  // Second pass: replace imports
  if (radixImportsToAdd.length > 0 && firstRadixImport) {
    // Remove duplicates
    const uniqueImports = radixImportsToAdd.filter((imp, index, self) => 
      index === self.findIndex(i => i.name === imp.name && i.alias === imp.alias)
    )

    // Replace the first Radix import with the unified import
    const importText = `import { ${uniqueImports.map(imp => 
      imp.alias ? `${imp.name} as ${imp.alias}` : imp.name
    ).join(', ')} } from "radix-ui";`
    
    firstRadixImport.replaceWithText(importText)

    // Remove all other Radix imports
    for (const imp of radixImportsToRemove) {
      imp.remove()
    }
  }

  return sourceFile.getText()
}