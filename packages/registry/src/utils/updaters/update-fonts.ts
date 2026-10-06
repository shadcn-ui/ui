import { existsSync, promises as fs } from "fs"
import path from "path"
import {
  RegistryFontItem,
  registryResolvedItemsTreeSchema,
} from "@/src/registry/schema"
import {
  applyEdits,
  applyManipulation,
  SyntaxErrorInsertedError,
} from "@/src/utils/codemod/edits"
import { getReplacementText } from "@/src/utils/codemod/indentation"
import { addNamedImport } from "@/src/utils/codemod/named-imports"
import {
  countSyntaxErrors,
  getText,
  parseModule,
} from "@/src/utils/codemod/parse"
import { renameVariable } from "@/src/utils/codemod/rename"
import {
  addImportDeclaration,
  getStatementsWithComments,
  insertStatement,
  isImportDeclaration,
  type Statement,
} from "@/src/utils/codemod/statements"
import { setInitializer } from "@/src/utils/codemod/variables"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo, ProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { types as t } from "@babel/core"
import z from "zod"

const ROOT_FONT_VARIABLES = new Set([
  "--font-sans",
  "--font-serif",
  "--font-mono",
])

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

  tree.cssVars ??= {}
  tree.cssVars.theme ??= {}

  const isNext =
    projectInfo.framework.name === "next-app" ||
    projectInfo.framework.name === "next-pages"

  for (const font of tree.fonts) {
    if (isNext) {
      // Next.js sets the CSS variable via next/font on the <html> element.
      // The font utility class is added to <html> className in updateHtmlClassName.
      // We update the theme CSS variable to reference itself so it resolves
      // to the value injected by next/font on <html>.
      tree.cssVars.theme[font.font.variable] = `var(${font.font.variable})`
    } else {
      // Other frameworks will use fontsource for now.
      const fontName = font.name.replace("font-", "")
      const fontSourceDependency =
        font.font.dependency ?? `@fontsource-variable/${fontName}`
      tree.dependencies ??= []
      tree.dependencies.push(fontSourceDependency)
      tree.css ??= {}
      tree.css[`@import "${fontSourceDependency}"`] = {}
      tree.cssVars.theme[font.font.variable] = font.font.family
    }
  }

  // Apply font utility classes grouped by selector.
  if (tree.fonts.length > 0) {
    const groups = new Map<string, string[]>()

    for (const font of tree.fonts) {
      const selector =
        font.font.selector ?? getDefaultFontSelector(font.font.variable)
      if (!selector) {
        continue
      }

      const cls = font.font.variable.replace("--", "")
      if (!groups.has(selector)) {
        groups.set(selector, [])
      }
      groups.get(selector)!.push(cls)
    }

    tree.css ??= {}
    tree.css["@layer base"] ??= {}

    for (const [selector, classes] of Array.from(groups.entries())) {
      const fontClasses = classes.join(" ")
      tree.css["@layer base"][selector] ??= {}
      // Find existing @apply key and merge, or create new.
      const existingApplyKey = Object.keys(
        tree.css["@layer base"][selector]
      ).find((key) => key.startsWith("@apply "))
      if (existingApplyKey) {
        delete tree.css["@layer base"][selector][existingApplyKey]
        tree.css["@layer base"][selector][
          `${existingApplyKey} ${fontClasses}`
        ] = {}
      } else {
        tree.css["@layer base"][selector][`@apply ${fontClasses}`] = {}
      }
    }
  }

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
    const skippedLayout = await updateNextFonts(fonts, config, projectInfo)
    if (!skippedLayout) {
      fontsSpinner?.succeed("Updating fonts.")
      return
    }

    // Stop without a check mark, since the layout was left as it was, and
    // return the warning so callers that pass silent can still report it.
    fontsSpinner?.stop()
    const warning = getSkippedLayoutWarning(skippedLayout, fonts, config)
    if (!options.silent) {
      logger.warn(warning)
    }
    return warning
  } catch (error) {
    fontsSpinner?.fail(`Failed to update fonts.`)
    throw error
  }
}

// A layout updateNextFonts left as it was, and why.
interface SkippedLayout {
  path: string
  reason: "unparsable" | "syntax-error-inserted"
}

function getSkippedLayoutWarning(
  skippedLayout: SkippedLayout,
  fonts: RegistryFontItem[],
  config: Config
) {
  const layout = path.relative(config.resolvedPaths.cwd, skippedLayout.path)
  const fontNames = fonts.map((font) => font.name).join(", ")
  const problem =
    skippedLayout.reason === "unparsable"
      ? `could not parse it to add ${fontNames}`
      : `adding ${fontNames} would leave it with a syntax error`

  return `Skipped ${layout}: ${problem}. Add the fonts to it manually.`
}

async function updateNextFonts(
  fonts: RegistryFontItem[],
  config: Config,
  projectInfo: ProjectInfo
): Promise<SkippedLayout | undefined> {
  // Find layout file.
  const layoutPath = await findLayoutFile(config, projectInfo)

  if (!layoutPath) {
    return
  }

  const layoutContent = await fs.readFile(layoutPath, "utf-8")

  // Babel gives up on some syntax errors that TypeScript, and so ts-morph,
  // parsed through.
  if (countSyntaxErrors(layoutContent) === Infinity) {
    return { path: layoutPath, reason: "unparsable" }
  }

  let updatedContent: string
  try {
    updatedContent = await transformLayoutFonts(layoutContent, fonts, config)
  } catch (error) {
    if (error instanceof SyntaxErrorInsertedError) {
      return { path: layoutPath, reason: "syntax-error-inserted" }
    }
    throw error
  }

  // ts-morph writes some edits that break a layout the editor does not
  // expect, like a cn() className with only font arguments, which becomes
  // `cn(, ...)`.
  if (countSyntaxErrors(updatedContent) > countSyntaxErrors(layoutContent)) {
    return { path: layoutPath, reason: "syntax-error-inserted" }
  }

  if (updatedContent !== layoutContent) {
    await fs.writeFile(layoutPath, updatedContent, "utf-8")
  }
}

export async function findLayoutFile(
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
  config: Config
) {
  // Each edit returns new code, which the next step parses again. ts-morph
  // drops a leading byte order mark from the text.
  let code = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input

  // Only process Google fonts for now.
  const googleFonts = fonts.filter((f) => f.font.provider === "google")

  // Track which font variables and utility classes we're adding.
  const fontVariableNames: string[] = []
  const fontUtilityClasses: string[] = []

  // Process Google fonts.
  for (const font of googleFonts) {
    const importName = font.font.import
    if (!importName) {
      continue
    }

    // Check if import already exists.
    const existingImport = getImportDeclarations(parseModule(code)).find(
      (decl) => decl.source.value === "next/font/google"
    )
    let hasExistingImport = false

    if (existingImport) {
      hasExistingImport =
        getNamedImportNames(existingImport).includes(importName)
      if (!hasExistingImport) {
        code = addNamedImport(code, existingImport, importName)
      }
    } else {
      // Add new import.
      code = addImportDeclaration(code, "next/font/google", importName)
    }

    const varName = getFontVariableName(importName, font.font.variable)

    // Build font options.
    const fontOptions = buildFontOptions(font)

    // Check if variable declaration already exists with same variable CSS property.
    const file = parseModule(code)
    const existingVarDecl = findFontVariableDeclaration(
      code,
      file,
      font.font.variable
    )
    let resolvedVarName = varName

    if (
      hasExistingImport &&
      !existingVarDecl &&
      isRootFontVariable(font.font.variable) &&
      !hasHeadingFontDeclaration(code, file, importName)
    ) {
      continue
    }

    if (existingVarDecl) {
      const { id } = existingVarDecl
      // Replace the initializer of the existing declaration.
      code = setInitializer(
        code,
        existingVarDecl,
        `${importName}(${fontOptions})`
      )
      // Update the variable name if different. The name comes before the
      // initializer, so it has not moved.
      if (id.type !== "Identifier" || id.name !== varName) {
        code = renameVariable(code, id.start!, varName)
      }
      resolvedVarName = varName
    } else {
      // Find the last import or existing font declaration to insert after.
      const statements = getStatementsWithComments(code, file.program)
      const insertPosition = findInsertPosition(statements)

      // Add variable declaration.
      const inserted = insertStatement(
        code,
        statements,
        insertPosition,
        `const ${varName} = ${importName}(${fontOptions});`,
        isVariableStatement
      )

      // Add a blank line after the declaration.
      code = applyEdits(inserted.code, [
        { start: inserted.end, end: inserted.end, text: "\n" },
      ])
    }

    fontVariableNames.push(resolvedVarName)
    if (shouldApplyFontUtilityToHtml(font)) {
      fontUtilityClasses.push(font.font.variable.replace("--", ""))
    }
  }

  // Only keep one font-family class (font-sans, font-serif, font-mono) on <html>.
  // The last one in the array takes priority as it's the one being added/changed.
  const fontFamilyClasses = new Set(["font-sans", "font-serif", "font-mono"])
  const lastFontFamilyClass = [...fontUtilityClasses]
    .reverse()
    .find((cls) => fontFamilyClasses.has(cls))
  const filteredUtilityClasses = fontUtilityClasses.filter(
    (cls) => !fontFamilyClasses.has(cls)
  )
  if (lastFontFamilyClass) {
    filteredUtilityClasses.unshift(lastFontFamilyClass)
  }

  // Update html className to include font variables and utility classes.
  if (fontVariableNames.length > 0) {
    code = updateHtmlClassName(
      code,
      fontVariableNames,
      filteredUtilityClasses,
      config
    )
  }

  return code
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

function isRootFontVariable(variable: string) {
  return ROOT_FONT_VARIABLES.has(variable)
}

function getDefaultFontSelector(variable: string) {
  return isRootFontVariable(variable) ? "html" : null
}

function shouldApplyFontUtilityToHtml(font: RegistryFontItem) {
  return !font.font.selector && isRootFontVariable(font.font.variable)
}

function getFontVariableName(importName: string, variable: string) {
  const baseName = toCamelCase(importName)

  if (isRootFontVariable(variable)) {
    return baseName
  }

  return `${baseName}${toPascalCase(variable.replace(/^--font-/, ""))}`
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

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function getImportDeclarations(file: t.File) {
  return file.program.body.filter(
    (statement) => statement.type === "ImportDeclaration"
  )
}

// ts-morph's ImportSpecifier#getName(): the imported name.
function getNamedImportNames(declaration: t.ImportDeclaration) {
  return declaration.specifiers
    .filter((specifier) => specifier.type === "ImportSpecifier")
    .map(({ imported }) =>
      imported.type === "StringLiteral" ? imported.value : imported.name
    )
}

// The declarations of the source file's variable statements, exported or not.
function getVariableDeclarations(file: t.File) {
  return file.program.body.flatMap((statement) => {
    const declaration =
      statement.type === "ExportNamedDeclaration"
        ? statement.declaration
        : statement
    return declaration?.type === "VariableDeclaration"
      ? declaration.declarations
      : []
  })
}

function isVariableStatement({ node }: Statement) {
  return (
    node?.type === "VariableDeclaration" ||
    (node?.type === "ExportNamedDeclaration" &&
      node.declaration?.type === "VariableDeclaration")
  )
}

// ts-morph's CallExpression kind includes optional calls.
function isCallExpression(
  node: t.Node | null | undefined
): node is t.CallExpression | t.OptionalCallExpression {
  return (
    node?.type === "CallExpression" || node?.type === "OptionalCallExpression"
  )
}

function findFontVariableDeclaration(
  code: string,
  file: t.File,
  variable: string
) {
  // Find variable declarations that call a font function with matching variable.
  for (const declaration of getVariableDeclarations(file)) {
    const initializer = declaration.init

    // Check if it's a call expression.
    if (!isCallExpression(initializer)) continue

    // Get the arguments.
    const args = initializer.arguments
    if (args.length === 0) continue

    // Check if any argument contains our variable.
    const argText = getText(code, args[0])
    if (argText.includes(`variable:`) && argText.includes(variable)) {
      return declaration
    }
  }

  return null
}

function hasHeadingFontDeclaration(
  code: string,
  file: t.File,
  importName: string
) {
  for (const declaration of getVariableDeclarations(file)) {
    const initializer = declaration.init

    if (!isCallExpression(initializer)) continue

    if (getText(code, initializer.callee) !== importName) continue

    const args = initializer.arguments
    if (!args.length) continue

    const argText = getText(code, args[0])
    if (argText.includes(`variable:`) && argText.includes("--font-heading")) {
      return true
    }
  }

  return false
}

function findInsertPosition(statements: Statement[]) {
  let lastImportIndex = -1
  for (let i = 0; i < statements.length; i++) {
    if (isImportDeclaration(statements[i])) {
      lastImportIndex = i
    }
  }
  return lastImportIndex + 1
}

function getHtmlOpeningElements(file: t.File) {
  const elements: t.JSXOpeningElement[] = []
  t.traverseFast(file, (node) => {
    if (
      node.type === "JSXOpeningElement" &&
      !node.selfClosing &&
      node.name.type === "JSXIdentifier" &&
      node.name.name === "html"
    ) {
      elements.push(node)
    }
  })
  // traverseFast follows VISITOR_KEYS, and ts-morph's getDescendantsOfKind
  // is in source order.
  return elements.sort((a, b) => a.start! - b.start!)
}

// Each edit reparses the code, and no edit adds or removes an <html>
// element, so it is found again by index.
function getHtmlOpeningElement(code: string, index: number) {
  return getHtmlOpeningElements(parseModule(code))[index]
}

function getClassNameAttribute(element: t.JSXOpeningElement) {
  return element.attributes.find(
    (attribute): attribute is t.JSXAttribute =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === "className"
  )
}

function getClassNameInitializer(code: string, index: number) {
  return getClassNameAttribute(getHtmlOpeningElement(code, index))!.value!
}

function updateHtmlClassName(
  code: string,
  fontVariableNames: string[],
  fontUtilityClasses: string[],
  config: Config
) {
  // Find the <html> JSX elements.
  const elementCount = getHtmlOpeningElements(parseModule(code)).length

  for (let index = 0; index < elementCount; index++) {
    // Build the new expressions: utility classes as strings, then .variable expressions.
    const newUtilityClasses = fontUtilityClasses.map((cls) => `"${cls}"`)
    const newVarExpressions = fontVariableNames.map(
      (name) => `${name}.variable`
    )
    const allNewArgs = [...newUtilityClasses, ...newVarExpressions]

    const classNameAttr = getClassNameAttribute(
      getHtmlOpeningElement(code, index)
    )
    if (!classNameAttr) {
      // Add className attribute with font utility classes and variables.
      code = ensureCnImport(code, config)
      return addJsxAttribute(
        code,
        getHtmlOpeningElement(code, index),
        `className={cn(${allNewArgs.join(", ")})}`
      )
    }

    // Handle existing className.
    const initializer = classNameAttr.value

    if (!initializer) return code

    if (initializer.type === "StringLiteral") {
      // className="some-class" -> className={cn("some-class", "font-serif", font.variable)}
      const currentValue = getText(code, initializer).slice(1, -1) // Remove quotes.
      code = ensureCnImport(code, config)
      code = setJsxAttributeInitializer(
        code,
        getClassNameAttribute(getHtmlOpeningElement(code, index))!,
        `{cn("${currentValue}", ${allNewArgs.join(", ")})}`
      )
    } else if (initializer.type === "JSXExpressionContainer") {
      // className={...} - need to analyze the expression.
      const expr = initializer.expression
      if (expr.type === "JSXEmptyExpression") return code

      const exprText = getText(code, expr)

      // Check if it's already using cn().
      if (exprText.startsWith("cn(")) {
        // Check if cn() already has all our font variables and utility classes.
        const hasAllFontVars = newVarExpressions.every((v) =>
          exprText.includes(v)
        )
        const hasAllUtilityClasses = fontUtilityClasses.every((cls) =>
          exprText.includes(`"${cls}"`)
        )
        // Check there are no stale font-family classes (e.g., "font-sans" when we want "font-serif").
        const staleFontFamilyClasses = ["font-sans", "font-serif", "font-mono"]
          .filter((cls) => !fontUtilityClasses.includes(cls))
          .some((cls) => exprText.includes(`"${cls}"`))
        if (hasAllFontVars && hasAllUtilityClasses && !staleFontFamilyClasses) {
          // Already has everything, skip.
          continue
        }

        // Remove existing font variables and font-family classes, then add new ones.
        let cleanedExpr = removeFontVariablesFromCn(exprText, newVarExpressions)
        cleanedExpr = removeFontFamilyClassesFromCn(cleanedExpr)
        const newExpr = insertFontVariablesIntoCn(cleanedExpr, allNewArgs)
        code = replaceJsxExpression(
          code,
          getClassNameInitializer(code, index),
          `{${newExpr}}`
        )
      } else if (/^\w+\.variable$/.test(exprText)) {
        // Single font variable like {inter.variable}.
        // Check if it's already one of our font variables.
        if (
          newVarExpressions.includes(exprText) &&
          fontUtilityClasses.length === 0
        ) {
          continue
        }
        // Replace with cn() including utility classes and font variables.
        code = ensureCnImport(code, config)
        const existingName = exprText.split(".")[0] ?? ""
        const shouldPreserveExisting =
          existingName.toLowerCase().includes("heading") ||
          fontUtilityClasses.length === 0
        code = replaceJsxExpression(
          code,
          getClassNameInitializer(code, index),
          shouldPreserveExisting
            ? `{cn(${exprText}, ${allNewArgs.join(", ")})}`
            : `{cn(${allNewArgs.join(", ")})}`
        )
      } else if (exprText.startsWith("`") && exprText.endsWith("`")) {
        // Template literal - parse and convert to cn() arguments.
        const cnArgs = parseTemplateLiteralToCnArgs(exprText)
        code = ensureCnImport(code, config)
        // Deduplicate cnArgs against allNewArgs.
        const allNewArgsSet = new Set(allNewArgs)
        const fontFamilyLiterals = new Set(
          ["font-sans", "font-serif", "font-mono"].map((c) => `"${c}"`)
        )
        const cleanedCnArgs = cnArgs.filter(
          (arg) => !allNewArgsSet.has(arg) && !fontFamilyLiterals.has(arg)
        )
        code = replaceJsxExpression(
          code,
          getClassNameInitializer(code, index),
          `{cn(${[...cleanedCnArgs, ...allNewArgs].join(", ")})}`
        )
      } else {
        // Some other expression (variable, etc.), wrap with cn().
        code = ensureCnImport(code, config)
        code = replaceJsxExpression(
          code,
          getClassNameInitializer(code, index),
          `{cn(${exprText}, ${allNewArgs.join(", ")})}`
        )
      }
    }
  }

  return code
}

// ts-morph's JsxOpeningElement#addAttribute(): after the last attribute, or
// after the tag name.
function addJsxAttribute(
  code: string,
  element: t.JSXOpeningElement,
  attributeText: string
) {
  const { attributes } = element
  const insertPosition =
    attributes.length > 0
      ? attributes[attributes.length - 1].end!
      : element.name.end!
  return applyManipulation(code, [
    { start: insertPosition, end: insertPosition, text: ` ${attributeText}` },
  ])
}

// ts-morph's JsxAttribute#setInitializer(text): the text is indented for the
// attribute, then replaces the initializer like Node#replaceWithText.
function setJsxAttributeInitializer(
  code: string,
  attribute: t.JSXAttribute,
  text: string
) {
  const initializer = attribute.value!
  const attributeText = getReplacementText(code, attribute.start!, text)
  return applyManipulation(code, [
    {
      start: initializer.start!,
      end: initializer.end!,
      text: getReplacementText(code, initializer.start!, attributeText),
    },
  ])
}

// ts-morph's Node#replaceWithText(text) on the className expression, without
// the syntax check: the string helpers below can break the expression, as in
// `cn(, ...)`, and updateNextFonts does not write such a layout.
function replaceJsxExpression(code: string, expression: t.Node, text: string) {
  return applyEdits(code, [
    {
      start: expression.start!,
      end: expression.end!,
      text: getReplacementText(code, expression.start!, text),
    },
  ])
}

function ensureCnImport(code: string, config: Config) {
  const imports = getImportDeclarations(parseModule(code))
  const existingImport = imports.find((decl) =>
    getNamedImportNames(decl).includes("cn")
  )

  if (!existingImport) {
    // Try to find the lib/utils import pattern.
    const utilsImport = imports.find((decl) =>
      decl.source.value.includes("/lib/utils")
    )

    if (utilsImport) {
      if (!getNamedImportNames(utilsImport).includes("cn")) {
        return addNamedImport(code, utilsImport, "cn")
      }
    } else {
      // Add a new import for cn.
      return addImportDeclaration(code, config.aliases.utils, "cn")
    }
  }

  return code
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

function removeFontVariablesFromCn(
  cnExpr: string,
  variablesToRemove: string[]
) {
  // Remove specific font variable expressions from cn() call.
  let result = cnExpr
  for (const varExpr of variablesToRemove) {
    result = result
      .replace(new RegExp(`,?\\s*${varExpr.replace(".", "\\.")}`, "g"), "")
      .replace(/cn\(\s*,/, "cn(")
  }
  return result
}

function removeFontFamilyClassesFromCn(cnExpr: string) {
  // Remove font-family class strings (font-sans, font-serif, font-mono) from cn() call.
  // Does not remove other font classes like font-bold, font-semibold, etc.
  let result = cnExpr
  for (const cls of ["font-sans", "font-serif", "font-mono"]) {
    result = result
      .replace(new RegExp(`,?\\s*"${cls}"`, "g"), "")
      .replace(/cn\(\s*,/, "cn(")
  }
  return result
}

function insertFontVariablesIntoCn(cnExpr: string, fontVars: string[]) {
  // Insert font variables at the end of cn() arguments.
  const varsStr = fontVars.join(", ")
  return cnExpr.replace(/\)$/, `, ${varsStr})`)
}
