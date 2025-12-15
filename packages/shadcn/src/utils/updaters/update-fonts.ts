import { existsSync, promises as fs } from "fs"
import path from "path"
import { RegistryFontItem, registryResolvedItemsTreeSchema } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { ProjectInfo, getProjectInfo } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import {
  CallExpression,
  Project,
  ScriptKind,
  SyntaxKind,
  VariableDeclarationKind,
} from "ts-morph"
import z from "zod"

export async function massageTreeForFonts(
  tree: z.infer<typeof registryResolvedItemsTreeSchema>,
  config: Config
) {
  if (!tree.fonts?.length) {
    return tree
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  if (!projectInfo) {
    return tree
  }

  const [fontSans] = tree.fonts
  tree.cssVars ??= {}
  tree.cssVars.theme ??= {}

  if (
    projectInfo.framework.name === "next-app" ||
    projectInfo.framework.name === "next-pages"
  ) {
    tree.cssVars.theme[
      fontSans.font.variable
    ] = `var(${fontSans.font.variable})`
    return tree
  }

  // Other frameworks will use fontsource for now.
  const fontName = fontSans.name.replace("font-", "")
  const fontSourceDependency = `@fontsource-variable/${fontName}`
  tree.dependencies ??= []
  tree.dependencies.push(fontSourceDependency)
  tree.css ??= {}
  tree.css[`@import "${fontSourceDependency}"`] = {}
  tree.css["@layer base"] ??= {}
  tree.css["@layer base"].html = {
    "@apply font-sans": {},
  }
  tree.css["@layer base"].body = {
    "@apply font-sans bg-background text-foreground": {},
  }
  tree.cssVars.theme[fontSans.font.variable] = fontSans.font.family

  //   tree.docs += `## Fonts
  // The ${highlighter.info(
  //     fontSans.title ?? ""
  //   )} font has been added to your project.

  // If you have existing font-family declarations, you may need to update them to use the new ${highlighter.info(
  //     fontSans.font.variable
  //   )} variable.

  // @theme inline {
  //   ${fontSans.font.variable}: ${fontSans.font.family};
  // }
  //   `

  return tree
}

export async function updateFonts(
  fonts: RegistryFontItem[] | undefined,
  config: Config,
  options: {
    silent?: boolean
  }
) {
  if (!fonts?.length) {
    return
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  if (!projectInfo) {
    return
  }

  if (
    projectInfo.framework.name !== "next-app" &&
    projectInfo.framework.name !== "next-pages"
  ) {
    return
  }

  const fontsSpinner = spinner("Updating fonts.", {
    silent: options.silent,
  })?.start()

  try {
    await updateNextFonts(fonts, config, projectInfo)
    fontsSpinner?.succeed("Updating fonts.")
  } catch (error) {
    fontsSpinner?.fail(`Failed to update fonts.`)
    throw error
  }
}

async function updateNextFonts(
  fonts: RegistryFontItem[],
  config: Config,
  projectInfo: ProjectInfo
) {
  // Find layout file.
  const layoutPath = await findLayoutFile(config, projectInfo)

  if (!layoutPath) {
    return
  }

  const layoutContent = await fs.readFile(layoutPath, "utf-8")
  const updatedContent = await transformLayoutFonts(
    layoutContent,
    fonts,
    config
  )

  if (updatedContent !== layoutContent) {
    await fs.writeFile(layoutPath, updatedContent, "utf-8")
  }
}

async function findLayoutFile(
  config: Config,
  projectInfo: ProjectInfo
): Promise<string | null> {
  const cwd = config.resolvedPaths.cwd
  const isSrcDir = projectInfo.isSrcDir
  const isTsx = projectInfo.isTsx
  const ext = isTsx ? "tsx" : "jsx"

  const possiblePaths = isSrcDir
    ? [`src/app/layout.${ext}`, `app/layout.${ext}`]
    : [`app/layout.${ext}`]

  for (const relativePath of possiblePaths) {
    const fullPath = path.join(cwd, relativePath)
    if (existsSync(fullPath)) {
      return fullPath
    }
  }

  return null
}

export async function transformLayoutFonts(
  input: string,
  fonts: RegistryFontItem[],
  _config: Config
) {
  const project = new Project({
    compilerOptions: {},
  })

  const sourceFile = project.createSourceFile("layout.tsx", input, {
    scriptKind: ScriptKind.TSX,
  })

  // Only process Google fonts for now.
  const googleFonts = fonts.filter((f) => f.font.provider === "google")

  // Track which font variables we're adding.
  const fontVariableNames: string[] = []

  // Process Google fonts.
  for (const font of googleFonts) {
    const importName = font.font.import
    if (!importName) {
      continue
    }

    // Generate a variable name from the import (e.g., "Inter" -> "inter", "Geist_Mono" -> "geistMono").
    const varName = toCamelCase(importName)

    // Check if import already exists.
    const existingImport = sourceFile.getImportDeclaration((decl) => {
      const moduleSpecifier = decl.getModuleSpecifierValue()
      return moduleSpecifier === "next/font/google"
    })

    // Build font options.
    const fontOptions = buildFontOptions(font)

    if (existingImport) {
      // Check if this specific font is already imported.
      const namedImports = existingImport.getNamedImports()
      const hasImport = namedImports.some((imp) => imp.getName() === importName)

      if (!hasImport) {
        existingImport.addNamedImport(importName)
      }
    } else {
      // Add new import.
      sourceFile.addImportDeclaration({
        moduleSpecifier: "next/font/google",
        namedImports: [importName],
      })
    }

    // Check if variable declaration already exists with same variable CSS property.
    const existingVarDecl = findFontVariableDeclaration(
      sourceFile,
      font.font.variable
    )

    if (existingVarDecl) {
      // Replace the initializer of the existing declaration.
      existingVarDecl.setInitializer(`${importName}(${fontOptions})`)
      // Update the variable name if different.
      if (existingVarDecl.getName() !== varName) {
        existingVarDecl.rename(varName)
      }
    } else {
      // Find the last import or existing font declaration to insert after.
      const insertPosition = findInsertPosition(sourceFile)

      // Add variable declaration.
      const statement = sourceFile.insertVariableStatement(insertPosition, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: varName,
            initializer: `${importName}(${fontOptions})`,
          },
        ],
      })

      // Add a blank line after the declaration.
      statement.appendWhitespace("\n")
    }

    fontVariableNames.push(varName)
  }

  // Update html className to include font variables.
  if (fontVariableNames.length > 0) {
    updateHtmlClassName(sourceFile, fontVariableNames)
  }

  return sourceFile.getFullText()
}

function buildFontOptions(font: RegistryFontItem) {
  const options: Record<string, unknown> = {}

  if (font.font.subsets?.length) {
    options.subsets = font.font.subsets
  }

  if (font.font.weight?.length) {
    options.weight = font.font.weight
  }

  options.variable = font.font.variable

  return JSON.stringify(options)
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes from keys.
    .replace(/"/g, "'") // Use single quotes for strings.
}

function toCamelCase(str: string) {
  // Convert "Geist_Mono" -> "geistMono", "Inter" -> "inter".
  return str
    .split("_")
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("")
}

function findFontVariableDeclaration(
  sourceFile: ReturnType<Project["createSourceFile"]>,
  variable: string
) {
  // Find variable declarations that call a font function with matching variable.
  const variableStatements = sourceFile.getVariableStatements()

  for (const statement of variableStatements) {
    for (const declaration of statement.getDeclarations()) {
      const initializer = declaration.getInitializer()
      if (!initializer) continue

      // Check if it's a call expression.
      if (initializer.getKind() !== SyntaxKind.CallExpression) continue

      const callExpr = initializer as CallExpression

      // Get the arguments.
      const args = callExpr.getArguments()
      if (args.length === 0) continue

      // Check if any argument contains our variable.
      const argText = args[0].getText()
      if (argText.includes(`variable:`) && argText.includes(variable)) {
        return declaration
      }
    }
  }

  return null
}

function findInsertPosition(
  sourceFile: ReturnType<Project["createSourceFile"]>
) {
  const imports = sourceFile.getImportDeclarations()
  if (imports.length > 0) {
    const lastImport = imports[imports.length - 1]
    return lastImport.getChildIndex() + 1
  }
  return 0
}

function updateHtmlClassName(
  sourceFile: ReturnType<Project["createSourceFile"]>,
  fontVariableNames: string[]
) {
  // Find the <html> JSX element.
  const jsxElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxOpeningElement
  )

  for (const element of jsxElements) {
    const tagName = element.getTagNameNode().getText()
    if (tagName !== "html") continue

    const classNameAttr = element.getAttribute("className")
    if (!classNameAttr) {
      // Add className attribute with font variables.
      const variableExpressions = fontVariableNames
        .map((name) => `${name}.variable`)
        .join(", ")

      if (fontVariableNames.length === 1) {
        element.addAttribute({
          name: "className",
          initializer: `{${variableExpressions}}`,
        })
      } else {
        // Need to use cn() for multiple fonts.
        ensureCnImport(sourceFile)
        element.addAttribute({
          name: "className",
          initializer: `{cn(${variableExpressions})}`,
        })
      }
      return
    }

    // Handle existing className.
    if (classNameAttr.getKind() !== SyntaxKind.JsxAttribute) {
      return
    }

    const jsxAttr = classNameAttr.asKindOrThrow(SyntaxKind.JsxAttribute)
    const initializer = jsxAttr.getInitializer()

    if (!initializer) return

    // Build the new variable expressions.
    const newVarExpressions = fontVariableNames.map(
      (name) => `${name}.variable`
    )

    if (initializer.getKind() === SyntaxKind.StringLiteral) {
      // className="some-class" -> className={cn("some-class", font.variable)}
      const currentValue = initializer.getText().slice(1, -1) // Remove quotes.
      ensureCnImport(sourceFile)
      jsxAttr.setInitializer(
        `{cn("${currentValue}", ${newVarExpressions.join(", ")})}`
      )
    } else if (initializer.getKind() === SyntaxKind.JsxExpression) {
      // className={...} - need to analyze the expression.
      const jsxExpr = initializer.asKindOrThrow(SyntaxKind.JsxExpression)
      const expr = jsxExpr.getExpression()
      if (!expr) return

      const exprText = expr.getText()

      // Check if it's already using cn().
      if (exprText.startsWith("cn(")) {
        // Check if cn() already has exactly our font variables.
        const hasAllFontVars = newVarExpressions.every((v) =>
          exprText.includes(v)
        )
        if (hasAllFontVars) {
          // Already has our font variables, skip.
          continue
        }

        // Remove existing font variables and add new ones.
        const cleanedExpr = removeFontVariablesFromCn(exprText)
        const newExpr = insertFontVariablesIntoCn(
          cleanedExpr,
          newVarExpressions
        )
        jsxExpr.replaceWithText(`{${newExpr}}`)
      } else if (/^\w+\.variable$/.test(exprText)) {
        // Single font variable like {inter.variable}.
        // Check if it's already one of our font variables.
        if (newVarExpressions.includes(exprText)) {
          // Already using our font variable, skip.
          continue
        }
        // Replace with our font variables.
        if (newVarExpressions.length === 1) {
          jsxExpr.replaceWithText(`{${newVarExpressions[0]}}`)
        } else {
          ensureCnImport(sourceFile)
          jsxExpr.replaceWithText(`{cn(${newVarExpressions.join(", ")})}`)
        }
      } else if (exprText.startsWith("`") && exprText.endsWith("`")) {
        // Template literal - parse and convert to cn() arguments.
        const cnArgs = parseTemplateLiteralToCnArgs(exprText)
        ensureCnImport(sourceFile)
        jsxExpr.replaceWithText(
          `{cn(${[...cnArgs, ...newVarExpressions].join(", ")})}`
        )
      } else {
        // Some other expression (variable, etc.), wrap with cn().
        ensureCnImport(sourceFile)
        jsxExpr.replaceWithText(
          `{cn(${exprText}, ${newVarExpressions.join(", ")})}`
        )
      }
    }
  }
}

function ensureCnImport(sourceFile: ReturnType<Project["createSourceFile"]>) {
  const existingImport = sourceFile.getImportDeclaration((decl) => {
    const namedImports = decl.getNamedImports()
    return namedImports.some((imp) => imp.getName() === "cn")
  })

  if (!existingImport) {
    // Try to find the lib/utils import pattern.
    const utilsImport = sourceFile.getImportDeclaration((decl) => {
      const moduleSpecifier = decl.getModuleSpecifierValue()
      return moduleSpecifier.includes("/lib/utils")
    })

    if (utilsImport) {
      const namedImports = utilsImport.getNamedImports()
      if (!namedImports.some((imp) => imp.getName() === "cn")) {
        utilsImport.addNamedImport("cn")
      }
    } else {
      // Add a new import for cn.
      sourceFile.addImportDeclaration({
        moduleSpecifier: "@/lib/utils",
        namedImports: ["cn"],
      })
    }
  }
}

function parseTemplateLiteralToCnArgs(templateLiteral: string) {
  // Parse template literal like `${geistSans.variable} ${geistMono.variable} antialiased`
  // into cn() arguments with static strings first, then variables:
  // ["antialiased", geistSans.variable, geistMono.variable]
  const staticArgs: string[] = []
  const variableArgs: string[] = []

  // Remove the backticks.
  const content = templateLiteral.slice(1, -1)

  // Split by ${...} expressions and static parts.
  const parts = content.split(/(\$\{[^}]+\})/)

  for (const part of parts) {
    if (!part) continue

    if (part.startsWith("${") && part.endsWith("}")) {
      // Expression like ${geistSans.variable}.
      const expr = part.slice(2, -1).trim()
      if (expr) {
        variableArgs.push(expr)
      }
    } else {
      // Static string - split by whitespace and add non-empty parts as quoted strings.
      const staticParts = part.trim().split(/\s+/).filter(Boolean)
      for (const staticPart of staticParts) {
        staticArgs.push(`"${staticPart}"`)
      }
    }
  }

  // Return static strings first, then variables.
  return [...staticArgs, ...variableArgs]
}

function removeFontVariablesFromCn(cnExpr: string) {
  // Remove patterns like "fontName.variable" from cn() call.
  // This is a simple regex-based approach.
  return cnExpr.replace(/,?\s*\w+\.variable/g, "").replace(/cn\(\s*,/, "cn(")
}

function insertFontVariablesIntoCn(cnExpr: string, fontVars: string[]) {
  // Insert font variables at the end of cn() arguments.
  const varsStr = fontVars.join(", ")
  return cnExpr.replace(/\)$/, `, ${varsStr})`)
}
