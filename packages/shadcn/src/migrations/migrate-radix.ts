import { promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import fg from "fast-glob"
import prompts from "prompts"

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function processNamedImports(
  namedImports: string,
  isTypeOnly: boolean,
  imports: Array<{ name: string; alias?: string; isType?: boolean }>,
  packageName: string
) {
  // Clean up multi-line imports.
  // Remove comments and whitespace.
  const cleanedImports = namedImports
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()

  const namedImportList = cleanedImports
    .split(",")
    .map((importItem) => importItem.trim())
    .filter(Boolean)

  for (const importItem of namedImportList) {
    const inlineTypeMatch = importItem.match(/^type\s+(\w+)(?:\s+as\s+(\w+))?$/)
    const aliasMatch = importItem.match(/^(\w+)\s+as\s+(\w+)$/)

    if (inlineTypeMatch) {
      // Inline type: "type DialogProps" or "type DialogProps as Props"
      const importName = inlineTypeMatch[1]
      const importAlias = inlineTypeMatch[2]

      if (packageName === "slot" && importName === "Slot" && !importAlias) {
        imports.push({
          name: "Slot",
          alias: "SlotPrimitive",
          isType: true,
        })
      } else {
        imports.push({
          name: importName,
          alias: importAlias,
          isType: true,
        })
      }
    } else if (aliasMatch) {
      // Regular import with alias: "Root as DialogRoot"
      const importName = aliasMatch[1]
      const importAlias = aliasMatch[2]

      if (
        packageName === "slot" &&
        importName === "Slot" &&
        importAlias === "Slot"
      ) {
        imports.push({
          name: "Slot",
          alias: "SlotPrimitive",
          isType: isTypeOnly,
        })
      } else {
        imports.push({
          name: importName,
          alias: importAlias,
          isType: isTypeOnly,
        })
      }
    } else {
      // Simple import: "Root"
      // Special handling for Slot: always alias it as SlotPrimitive
      if (packageName === "slot" && importItem === "Slot") {
        imports.push({
          name: "Slot",
          alias: "SlotPrimitive",
          isType: isTypeOnly,
        })
      } else {
        imports.push({
          name: importItem,
          isType: isTypeOnly,
        })
      }
    }
  }
}

export async function migrateRadix(
  config: Config,
  options: { yes?: boolean } = {}
) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const uiPath = config.resolvedPaths.ui
  const files = await fg("**/*.{js,ts,jsx,tsx}", {
    cwd: uiPath,
  })

  if (!options.yes) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      initial: true,
      message: `We will migrate ${highlighter.info(
        files.length
      )} files in ${highlighter.info(
        `./${path.relative(config.resolvedPaths.cwd, uiPath)}`
      )} to ${highlighter.info("radix-ui")}. Continue?`,
    })

    if (!confirm) {
      logger.info("Migration cancelled.")
      process.exit(0)
    }
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

    const foundPackagesArray = Array.from(foundPackages)

    // Remove packages from both dependencies and devDependencies if found in source files
    const dependencyTypes = ["dependencies", "devDependencies"] as const
    for (const depType of dependencyTypes) {
      if (packageJson[depType]) {
        for (const pkg of foundPackagesArray) {
          if (packageJson[depType]![pkg]) {
            delete packageJson[depType]![pkg]
          }
        }
      }
    }

    // Add radix-ui if we found any Radix packages.
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

      // Install radix-ui dependency.
      await updateDependencies(["radix-ui"], [], config, { silent: false })
    } else {
      packageSpinner.succeed("No packages found in source files.")
    }
  } catch (error) {
    packageSpinner.fail("Failed to update package.json")
    logger.warn(
      "You may need to manually replace @radix-ui/react-* packages with radix-ui"
    )
  }
}

export async function migrateRadixFile(
  content: string
): Promise<{ content: string; replacedPackages: string[] }> {
  // Enhanced regex to handle type-only imports, but exclude react-icons
  // Also capture optional semicolon at the end
  const radixImportPattern =
    /import\s+(?:(type)\s+)?(?:\*\s+as\s+(\w+)|{([^}]+)})\s+from\s+(["'])@radix-ui\/react-([^"']+)\4(;?)/g

  const imports: Array<{ name: string; alias?: string; isType?: boolean }> = []
  const linesToRemove: string[] = []
  const replacedPackages: string[] = []
  let quoteStyle = '"' // Default to double quotes
  let hasSemicolon = false // Track if any import had a semicolon

  let result = content
  let match

  // Find all Radix imports
  while ((match = radixImportPattern.exec(content)) !== null) {
    const [
      fullMatch,
      typeKeyword,
      namespaceAlias,
      namedImports,
      quote,
      packageName,
      semicolon,
    ] = match

    // Skip react-icons package and any sub-paths (like react-icons/dist/types)
    if (packageName === "icons" || packageName.startsWith("icons/")) {
      continue
    }

    linesToRemove.push(fullMatch)

    // Use the quote style and semicolon style from the first import
    if (linesToRemove.length === 1) {
      quoteStyle = quote
      hasSemicolon = semicolon === ";"
    }

    // Track which package we're replacing
    replacedPackages.push(`@radix-ui/react-${packageName}`)

    const isTypeOnly = Boolean(typeKeyword)

    if (namespaceAlias) {
      // Handle namespace imports: import * as DialogPrimitive from "@radix-ui/react-dialog"
      const componentName = toPascalCase(packageName)
      imports.push({
        name: componentName,
        alias: namespaceAlias,
        isType: isTypeOnly,
      })
    } else if (namedImports) {
      // Handle named imports: import { Root, Trigger } from "@radix-ui/react-dialog"
      // or import type { DialogProps } from "@radix-ui/react-dialog"
      // or import { type DialogProps, Root } from "@radix-ui/react-dialog"

      processNamedImports(namedImports, isTypeOnly, imports, packageName)
    }
  }

  if (imports.length === 0) {
    return {
      content,
      replacedPackages: [],
    }
  }

  // Remove duplicates.
  // Considering name, alias, and type status.
  const uniqueImports = imports.filter(
    (importName, index, self) =>
      index ===
      self.findIndex(
        (i) =>
          i.name === importName.name &&
          i.alias === importName.alias &&
          i.isType === importName.isType
      )
  )

  // Create the unified import with preserved quote style and type annotations
  const importList = uniqueImports
    .map((imp) => {
      const typePrefix = imp.isType ? "type " : ""
      return imp.alias
        ? `${typePrefix}${imp.name} as ${imp.alias}`
        : `${typePrefix}${imp.name}`
    })
    .join(", ")

  const unifiedImport = `import { ${importList} } from ${quoteStyle}radix-ui${quoteStyle}${
    hasSemicolon ? ";" : ""
  }`

  // Replace first import with unified import, remove the rest
  result = linesToRemove.reduce((acc, line, index) => {
    return acc.replace(line, index === 0 ? unifiedImport : "")
  }, result)

  // Clean up extra blank lines
  result = result.replace(/\n\s*\n\s*\n/g, "\n\n")

  // Handle special case for Slot usage transformation
  // Now that we import { Slot as SlotPrimitive }, we need to:
  // 1. Transform: const Comp = asChild ? Slot : [ANYTHING] -> const Comp = asChild ? SlotPrimitive.Slot : [ANYTHING]
  // 2. Transform: React.ComponentProps<typeof Slot> -> React.ComponentProps<typeof SlotPrimitive.Slot>
  const hasSlotImport = uniqueImports.some(
    (imp) => imp.name === "Slot" && imp.alias === "SlotPrimitive"
  )

  if (hasSlotImport) {
    // Find all lines that are NOT import lines to avoid transforming the import statement itself
    const lines = result.split("\n")
    const transformedLines = lines.map((line) => {
      // Skip import lines
      if (line.trim().startsWith("import ")) {
        return line
      }

      let transformedLine = line

      // Handle all Slot references in one comprehensive pass
      // Use placeholders to avoid double replacements

      // First, mark specific patterns with placeholders
      transformedLine = transformedLine.replace(
        /\b(asChild\s*\?\s*)Slot(\s*:)/g,
        "$1__SLOT_PLACEHOLDER__$2"
      )

      transformedLine = transformedLine.replace(
        /\bReact\.ComponentProps<typeof\s+Slot>/g,
        "React.ComponentProps<typeof __SLOT_PLACEHOLDER__>"
      )

      transformedLine = transformedLine.replace(
        /\bComponentProps<typeof\s+Slot>/g,
        "ComponentProps<typeof __SLOT_PLACEHOLDER__>"
      )

      transformedLine = transformedLine.replace(
        /(<\/?)Slot(\s*\/?>)/g,
        "$1__SLOT_PLACEHOLDER__$2"
      )

      // Handle any other standalone Slot usage
      transformedLine = transformedLine.replace(
        /\bSlot\b/g,
        (match, offset, string) => {
          // Don't transform if it's inside quotes
          const beforeMatch = string.substring(0, offset)
          const openQuotes = (beforeMatch.match(/"/g) || []).length
          const openSingleQuotes = (beforeMatch.match(/'/g) || []).length

          // If we're inside quotes, don't transform
          if (openQuotes % 2 !== 0 || openSingleQuotes % 2 !== 0) {
            return match
          }

          return "__SLOT_PLACEHOLDER__"
        }
      )

      // Finally, replace all placeholders with SlotPrimitive.Slot
      transformedLine = transformedLine.replace(
        /__SLOT_PLACEHOLDER__/g,
        "SlotPrimitive.Slot"
      )

      return transformedLine
    })

    result = transformedLines.join("\n")
  }

  // Remove duplicate packages
  const uniqueReplacedPackages = Array.from(new Set(replacedPackages))

  return {
    content: result,
    replacedPackages: uniqueReplacedPackages,
  }
}
