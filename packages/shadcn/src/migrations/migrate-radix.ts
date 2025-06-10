import { promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import fg from "fast-glob"
import prompts from "prompts"

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
    )} from to ${highlighter.info("radix-ui")}. Continue?`,
  })

  if (!confirm) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  const migrationSpinner = spinner(`Migrating imports...`)?.start()
  const foundPackages = new Set<string>()

  await Promise.all(
    files.map(async (file) => {
      migrationSpinner.text = `Migrating ${file}...`

      const filePath = path.join(uiPath, file)
      const fileContent = await fs.readFile(filePath, "utf-8")

      const { content, replacedPackages } = await migrateRadixFile(fileContent)

      // Track which packages we found
      replacedPackages.forEach((pkg) => foundPackages.add(pkg))

      await fs.writeFile(filePath, content)
    })
  )

  migrationSpinner.succeed("Migrating imports.")

  // Update package.json dependencies
  const packageSpinner = spinner(`Updating package.json...`)?.start()

  try {
    const packageJson = getPackageInfo(config.resolvedPaths.cwd, false)

    if (!packageJson) {
      packageSpinner.fail("Could not read package.json")
      logger.warn(
        "Could not update package.json. You may need to manually replace @radix-ui/react-* packages with radix-ui"
      )
      return
    }

    const removedPackages: string[] = []
    const foundPackagesArray = Array.from(foundPackages)

    // Only remove packages that we actually found in source files
    // Check dependencies
    if (packageJson.dependencies) {
      for (const pkg of foundPackagesArray) {
        if (packageJson.dependencies[pkg]) {
          removedPackages.push(pkg)
          delete packageJson.dependencies[pkg]
        }
      }
    }

    // Check devDependencies
    if (packageJson.devDependencies) {
      for (const pkg of foundPackagesArray) {
        if (packageJson.devDependencies[pkg]) {
          removedPackages.push(pkg)
          delete packageJson.devDependencies[pkg]
        }
      }
    }

    // Add radix-ui if we found any Radix packages
    if (foundPackagesArray.length > 0) {
      if (!packageJson.dependencies) {
        packageJson.dependencies = {}
      }
      packageJson.dependencies["radix-ui"] = "latest"

      const packageJsonPath = path.join(
        config.resolvedPaths.cwd,
        "package.json"
      )
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n"
      )

      packageSpinner.succeed(`Updated package.json.`)

      // Detect package manager and show appropriate install command
      const packageManager = await getPackageManager(config.resolvedPaths.cwd)
      const installCommand = getInstallCommand(packageManager)

      logger.break()
      logger.info("  Run the following command to install the new dependency:")
      logger.info(`    ${installCommand}`)
      logger.break()
    } else {
      packageSpinner.succeed("No packages found in source files.")
    }
  } catch (error) {
    packageSpinner.fail("Failed to update package.json")
    logger.warn(
      "Could not update package.json. You may need to manually replace @radix-ui/react-* packages with radix-ui"
    )
  }
}

function getInstallCommand(
  packageManager: "yarn" | "pnpm" | "bun" | "npm" | "deno"
): string {
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

export async function migrateRadixFile(
  content: string
): Promise<{ content: string; replacedPackages: string[] }> {
  // Enhanced regex to handle type-only imports, but exclude react-icons
  const radixImportPattern =
    /import\s+(?:(type)\s+)?(?:\*\s+as\s+(\w+)|{([^}]+)})\s+from\s+(["'])@radix-ui\/react-([^"']+)\4/g

  const imports: Array<{ name: string; alias?: string; isType?: boolean }> = []
  const linesToRemove: string[] = []
  const replacedPackages: string[] = []
  let quoteStyle = '"' // Default to double quotes

  let result = content
  let match

  // Find all Radix imports
  while ((match = radixImportPattern.exec(content)) !== null) {
    const [fullMatch, typeKeyword, namespaceAlias, namedImports, quote, packageName] = match
    
    // Skip react-icons package and any sub-paths (like react-icons/dist/types)
    if (packageName === 'icons' || packageName.startsWith('icons/')) {
      continue
    }
    
    linesToRemove.push(fullMatch)

    // Use the quote style from the first import
    if (linesToRemove.length === 1) {
      quoteStyle = quote
    }

    // Track which package we're replacing
    replacedPackages.push(`@radix-ui/react-${packageName}`)

    const isTypeOnly = Boolean(typeKeyword)

    if (namespaceAlias) {
      // Handle namespace imports: import * as DialogPrimitive from "@radix-ui/react-dialog"
      // Note: type-only namespace imports are not common, but we'll handle them
      const componentName = packageName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")

      imports.push({ name: componentName, alias: namespaceAlias, isType: isTypeOnly })
    } else if (namedImports) {
      // Handle named imports: import { Root, Trigger } from "@radix-ui/react-dialog"
      // or import type { DialogProps } from "@radix-ui/react-dialog"
      // or import { type DialogProps, Root } from "@radix-ui/react-dialog"
      
      // Clean up multi-line imports by removing comments and extra whitespace
      const cleanedImports = namedImports
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
      
      const namedImportList = cleanedImports.split(",").map((imp) => imp.trim()).filter(Boolean)
      for (const imp of namedImportList) {
        // Check for inline type keyword: "type DialogProps"
        const inlineTypeMatch = imp.match(/^type\s+(\w+)(?:\s+as\s+(\w+))?$/)
        if (inlineTypeMatch) {
          imports.push({ 
            name: inlineTypeMatch[1], 
            alias: inlineTypeMatch[2], 
            isType: true 
          })
        } else {
          // Regular import with possible alias: "Root as DialogRoot"
          const aliasMatch = imp.match(/^(\w+)\s+as\s+(\w+)$/)
          if (aliasMatch) {
            imports.push({ 
              name: aliasMatch[1], 
              alias: aliasMatch[2], 
              isType: isTypeOnly 
            })
          } else {
            imports.push({ 
              name: imp, 
              isType: isTypeOnly 
            })
          }
        }
      }
    }
  }

  if (imports.length === 0) {
    return {
      content,
      replacedPackages: [],
    }
  }

  // Remove duplicates (considering name, alias, and type status)
  const uniqueImports = imports.filter(
    (imp, index, self) =>
      index ===
      self.findIndex((i) => i.name === imp.name && i.alias === imp.alias && i.isType === imp.isType)
  )

  // Create the unified import with preserved quote style and type annotations
  const importList = uniqueImports
    .map((imp) => {
      const typePrefix = imp.isType ? "type " : ""
      if (imp.alias) {
        return `${typePrefix}${imp.name} as ${imp.alias}`
      } else {
        return `${typePrefix}${imp.name}`
      }
    })
    .join(", ")

  const unifiedImport = `import { ${importList} } from ${quoteStyle}radix-ui${quoteStyle};`

  // Remove all Radix imports and replace the first one with unified import
  for (let i = 0; i < linesToRemove.length; i++) {
    if (i === 0) {
      // Replace first import with unified import
      result = result.replace(linesToRemove[i], unifiedImport)
    } else {
      // Remove subsequent imports
      result = result.replace(linesToRemove[i], "")
    }
  }

  // Clean up extra blank lines
  result = result.replace(/\n\s*\n\s*\n/g, "\n\n")

  // Remove duplicate packages
  const uniqueReplacedPackages = [...new Set(replacedPackages)]

  return {
    content: result,
    replacedPackages: uniqueReplacedPackages,
  }
}
