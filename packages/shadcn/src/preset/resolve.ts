import { existsSync, promises as fs } from "fs"
import path from "path"
import { findTailwindColorFamily } from "@/src/colors"
import type { Config } from "@/src/utils/get-config"
import { getProjectInfo, type ProjectInfo } from "@/src/utils/get-project-info"
import postcss from "postcss"
import { Node, Project, ScriptKind, SyntaxKind } from "ts-morph"

import { DEFAULT_PRESETS } from "./defaults"
import {
  encodePreset,
  PRESET_BASE_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_THEMES,
  type PresetConfig,
} from "./preset"

const PRESET_BASE_COLOR_SET = new Set<string>(PRESET_BASE_COLORS)
const PRESET_ICON_LIBRARY_SET = new Set<string>(PRESET_ICON_LIBRARIES)
const PRESET_MENU_ACCENT_SET = new Set<string>(PRESET_MENU_ACCENTS)
const PRESET_MENU_COLOR_SET = new Set<string>(PRESET_MENU_COLORS)
const PRESET_FONT_SET = new Set<string>(PRESET_FONTS)
const PRESET_FONT_HEADING_SET = new Set<string>(PRESET_FONT_HEADINGS)
const PRESET_THEME_SET = new Set<string>(PRESET_THEMES)
const SERIF_FONTS = new Set<PresetConfig["font"]>([
  "eb-garamond",
  "instrument-serif",
  "lora",
  "merriweather",
  "playfair-display",
  "noto-serif",
  "roboto-slab",
])
const MONO_FONTS = new Set<PresetConfig["font"]>([
  "jetbrains-mono",
  "geist-mono",
])
const ROOT_FONT_VARIABLES = [
  "--font-sans",
  "--font-serif",
  "--font-mono",
] as const
type RootFontVariable = (typeof ROOT_FONT_VARIABLES)[number]
const ROOT_FONT_VARIABLE_SET = new Set<string>(ROOT_FONT_VARIABLES)
const FONT_VARIABLES = [...ROOT_FONT_VARIABLES, "--font-heading"] as const
type FontVariable = (typeof FONT_VARIABLES)[number]
const FONT_VARIABLE_SET = new Set<string>(FONT_VARIABLES)
type CssState = {
  darkVars: Record<string, string>
  imports: string[]
  rootVars: Record<string, string>
  themeVars: Record<string, string>
}
type NextFontState = {
  appliedBodyVariable: RootFontVariable | null
  variables: Partial<Record<FontVariable, PresetConfig["font"]>>
}
const EMPTY_NEXT_FONT_STATE: NextFontState = {
  appliedBodyVariable: null,
  variables: {},
}
const RADIUS_MAP: Record<string, PresetConfig["radius"]> = {
  "0": "none",
  "0rem": "none",
  "0.45rem": "small",
  "0.625rem": "default",
  "0.875rem": "large",
}

export async function resolveProjectPreset(
  config: Config,
  projectInfo?: ProjectInfo | null
) {
  const style = normalizePresetStyle(config.style)
  if (!style) {
    return { code: null, fallbacks: [], values: null }
  }

  const defaults = DEFAULT_PRESETS[style]
  const cssState = await readCssState(config.resolvedPaths.tailwindCss)

  const baseColor = asPresetValue<PresetConfig["baseColor"]>(
    PRESET_BASE_COLOR_SET,
    config.tailwind.baseColor
  )
  const theme = matchTheme(cssState)
  const chartColor = matchChartColor(cssState)
  const iconLibrary = asPresetValue<PresetConfig["iconLibrary"]>(
    PRESET_ICON_LIBRARY_SET,
    config.iconLibrary
  )
  let resolvedFont: PresetConfig["font"] | null = resolveBodyFont(
    cssState,
    EMPTY_NEXT_FONT_STATE
  )
  let font = resolvedFont ?? defaults.font
  let resolvedFontHeading: PresetConfig["fontHeading"] | null =
    resolveHeadingFont(cssState, font, EMPTY_NEXT_FONT_STATE)

  if (!resolvedFont || !resolvedFontHeading) {
    let resolvedProjectInfo = projectInfo
    if (projectInfo === undefined) {
      // Most callers already have project info. This keeps the resolver usable
      // in isolation without forcing them to fetch it first.
      try {
        resolvedProjectInfo = await getProjectInfo(config.resolvedPaths.cwd, {
          configCssFile: config.tailwind.css,
        })
      } catch {
        resolvedProjectInfo = null
      }
    }

    const nextFonts = await readNextFontState(config, resolvedProjectInfo)
    resolvedFont ??= resolveBodyFont(cssState, nextFonts)
    font = resolvedFont ?? defaults.font
    resolvedFontHeading ??= resolveHeadingFont(cssState, font, nextFonts)
  }

  const fontHeading = normalizeFontHeading(
    resolvedFontHeading ?? defaults.fontHeading,
    font,
    defaults.fontHeading
  )
  const radius = matchRadius(cssState.rootVars["--radius"])
  const menuAccent = asPresetValue<PresetConfig["menuAccent"]>(
    PRESET_MENU_ACCENT_SET,
    config.menuAccent
  )
  const menuColor = asPresetValue<PresetConfig["menuColor"]>(
    PRESET_MENU_COLOR_SET,
    config.menuColor
  )

  const values = {
    style,
    baseColor: baseColor ?? defaults.baseColor,
    theme: theme ?? defaults.theme,
    chartColor: chartColor ?? defaults.chartColor,
    iconLibrary: iconLibrary ?? defaults.iconLibrary,
    font,
    fontHeading,
    radius: radius ?? defaults.radius,
    menuAccent: menuAccent ?? defaults.menuAccent,
    menuColor: menuColor ?? defaults.menuColor,
  } satisfies PresetConfig

  const fallbacks = [
    !baseColor && "baseColor",
    !theme && "theme",
    !chartColor && "chartColor",
    !iconLibrary && "iconLibrary",
    !resolvedFont && "font",
    !resolvedFontHeading && "fontHeading",
    !radius && "radius",
    !menuAccent && "menuAccent",
    !menuColor && "menuColor",
  ].filter(Boolean)

  return {
    code: encodePreset(values),
    fallbacks,
    values,
  }
}

async function readCssState(tailwindCssPath?: string) {
  const fallbackState: CssState = {
    darkVars: {},
    imports: [],
    rootVars: {},
    themeVars: {},
  }

  if (!tailwindCssPath) {
    return fallbackState
  }

  try {
    const input = await fs.readFile(tailwindCssPath, "utf8")
    return extractCssState(input)
  } catch {
    return fallbackState
  }
}

function normalizePresetStyle(style: string | undefined) {
  if (!style) {
    return null
  }

  const normalized = style.replace(/^(base|radix)-/, "")
  if (!(normalized in DEFAULT_PRESETS)) {
    return null
  }

  return normalized as keyof typeof DEFAULT_PRESETS
}

function extractCssState(input: string) {
  const root = postcss.parse(input)
  const state: CssState = {
    darkVars: {},
    imports: [],
    rootVars: {},
    themeVars: {},
  }

  root.walkAtRules("import", (atRule) => {
    const source = parseImportSource(atRule.params)
    if (source) {
      state.imports.push(source)
    }
  })

  root.walkRules((rule) => {
    const selectors = rule.selector
      .split(",")
      .map((selector) => selector.trim())
      .filter(Boolean)

    if (selectors.includes(":root")) {
      collectDeclarations(rule, state.rootVars)
    }

    if (selectors.includes(".dark")) {
      collectDeclarations(rule, state.darkVars)
    }
  })

  root.walkAtRules("theme", (atRule) => {
    if (atRule.params.trim() !== "inline") {
      return
    }

    collectDeclarations(atRule, state.themeVars)
  })

  return state
}

function collectDeclarations(
  node: { nodes?: postcss.ChildNode[] },
  target: Record<string, string>
) {
  for (const child of node.nodes ?? []) {
    if (child.type !== "decl" || !child.prop.startsWith("--")) {
      continue
    }

    target[child.prop] = child.value.trim()
  }
}

function parseImportSource(params: string) {
  const normalized = params.trim()
  const match =
    normalized.match(/^url\((['"]?)(.+?)\1\)$/) ??
    normalized.match(/^(['"])(.+?)\1$/)

  return match?.[2] ?? null
}

function matchTheme(state: CssState) {
  const lightTheme = matchPresetThemeValue(state.rootVars["--primary"])
  if (!lightTheme) {
    return null
  }

  const darkPrimary = state.darkVars["--primary"]
  if (!darkPrimary) {
    return lightTheme
  }

  const darkTheme = matchPresetThemeValue(darkPrimary)
  return darkTheme === lightTheme ? lightTheme : null
}

function matchChartColor(state: CssState) {
  const lightChartColor = matchPresetThemeValue(state.rootVars["--chart-1"])
  if (!lightChartColor) {
    return null
  }

  const darkChartColorValue = state.darkVars["--chart-1"]
  if (!darkChartColorValue) {
    return lightChartColor
  }

  const darkChartColor = matchPresetThemeValue(darkChartColorValue)
  return darkChartColor === lightChartColor ? lightChartColor : null
}

function matchPresetThemeValue(value: string | undefined) {
  const family = findTailwindColorFamily(value)

  if (!family || !PRESET_THEME_SET.has(family)) {
    return null
  }

  return family as PresetConfig["theme"]
}

function matchRadius(value: string | undefined) {
  if (!value) {
    return null
  }

  const normalized = normalizeCssValue(value)
  return RADIUS_MAP[normalized] ?? null
}

function resolveBodyFont(state: CssState, nextFonts: NextFontState) {
  for (const variable of ROOT_FONT_VARIABLES) {
    const matched = matchFontFromVariable(state, variable)
    if (matched) {
      return matched
    }
  }

  for (const variable of ROOT_FONT_VARIABLES) {
    const imported = matchFontByImports(state.imports, variable)
    if (imported) {
      return imported
    }
  }

  return matchNextBodyFont(nextFonts)
}

function resolveHeadingFont(
  state: CssState,
  bodyFont: PresetConfig["font"],
  nextFonts: NextFontState
) {
  const resolved = resolveFontValue(state, "--font-heading")
  const matched = resolved ? parseFontFromFamily(resolved) : null
  if (matched) {
    return matched === bodyFont ? "inherit" : matched
  }

  const nextHeadingFont = nextFonts.variables["--font-heading"]
  const value = getCssVariableValue(state, "--font-heading")
  if (!value) {
    return nextHeadingFont && nextHeadingFont !== bodyFont
      ? nextHeadingFont
      : null
  }

  const reference = getVarReference(value)
  if (reference && ROOT_FONT_VARIABLE_SET.has(reference)) {
    const rootFont = matchFontFromVariable(state, reference as RootFontVariable)
    const nextRootFont = nextFonts.variables[reference as RootFontVariable]
    const resolvedRootFont = rootFont ?? nextRootFont ?? null

    if (!resolvedRootFont || resolvedRootFont === bodyFont) {
      return "inherit"
    }

    return resolvedRootFont
  }

  if (reference === "--font-heading") {
    if (!nextHeadingFont) {
      return null
    }

    if (nextHeadingFont === bodyFont) {
      return "inherit"
    }

    return nextHeadingFont
  }

  return nextHeadingFont && nextHeadingFont !== bodyFont
    ? nextHeadingFont
    : null
}

function normalizeFontHeading(
  fontHeading: PresetConfig["fontHeading"],
  bodyFont: PresetConfig["font"],
  fallback: PresetConfig["fontHeading"]
) {
  const normalized = fontHeading === bodyFont ? "inherit" : fontHeading
  return PRESET_FONT_HEADING_SET.has(normalized) ? normalized : fallback
}

function resolveFontValue(
  state: CssState,
  variable: FontVariable,
  seen = new Set<string>()
) {
  if (seen.has(variable)) {
    return null
  }

  seen.add(variable)

  const value = getCssVariableValue(state, variable)
  if (!value) {
    return null
  }

  const reference = getVarReference(value)
  if (!reference) {
    return value
  }

  if (FONT_VARIABLE_SET.has(reference)) {
    return resolveFontValue(state, reference as FontVariable, seen)
  }

  return null
}

function getCssVariableValue(state: CssState, variable: FontVariable) {
  const themeValue = state.themeVars[variable]
  if (themeValue && getVarReference(themeValue) !== variable) {
    return themeValue
  }

  return state.rootVars[variable] ?? themeValue ?? null
}

function getVarReference(value: string) {
  const normalized = normalizeCssValue(value)
  const match = normalized.match(/^var\((--[a-z0-9-]+)\)$/)
  return match?.[1] ?? null
}

function matchFontFromVariable(state: CssState, variable: RootFontVariable) {
  const resolved = resolveFontValue(state, variable)
  const matched = resolved ? parseFontFromFamily(resolved) : null
  if (matched) {
    return matched
  }

  return null
}

function matchFontByImports(imports: string[], variable: RootFontVariable) {
  const matches = imports.flatMap((input) => {
    const font = parseFontFromDependency(input)
    return font && getFontVariable(font) === variable ? [font] : []
  })

  return matches.length === 1 ? matches[0] : null
}

function matchNextBodyFont(nextFonts: NextFontState) {
  if (
    nextFonts.appliedBodyVariable &&
    nextFonts.variables[nextFonts.appliedBodyVariable]
  ) {
    return nextFonts.variables[nextFonts.appliedBodyVariable] ?? null
  }

  const matches = ROOT_FONT_VARIABLES.map(
    (variable) => nextFonts.variables[variable]
  )
    .filter(Boolean)
    .filter(
      (font, index, allFonts) => allFonts.indexOf(font) === index
    ) as PresetConfig["font"][]

  return matches.length === 1 ? matches[0] : null
}

async function readNextFontState(
  config: Config,
  projectInfo: ProjectInfo | null | undefined
) {
  const fallbackState: NextFontState = {
    appliedBodyVariable: null,
    variables: {},
  }

  if (
    !projectInfo ||
    (projectInfo.framework.name !== "next-app" &&
      projectInfo.framework.name !== "next-pages")
  ) {
    return fallbackState
  }

  const sourcePath = findNextFontSourceFile(config, projectInfo)
  if (!sourcePath) {
    return fallbackState
  }

  try {
    const input = await fs.readFile(sourcePath, "utf8")
    return extractNextFontState(input, projectInfo.framework.name)
  } catch {
    return fallbackState
  }
}

function findNextFontSourceFile(config: Config, projectInfo: ProjectInfo) {
  const ext = projectInfo.isTsx ? "tsx" : "jsx"
  const candidates =
    projectInfo.framework.name === "next-app"
      ? projectInfo.isSrcDir
        ? [`src/app/layout.${ext}`, `app/layout.${ext}`]
        : [`app/layout.${ext}`]
      : projectInfo.isSrcDir
        ? [`src/pages/_app.${ext}`, `pages/_app.${ext}`]
        : [`pages/_app.${ext}`]

  for (const relativePath of candidates) {
    const fullPath = path.join(config.resolvedPaths.cwd, relativePath)
    if (existsSync(fullPath)) {
      return fullPath
    }
  }

  return null
}

function extractNextFontState(
  input: string,
  framework: ProjectInfo["framework"]["name"]
) {
  const project = new Project({
    compilerOptions: {},
  })
  const sourceFile = project.createSourceFile("font-source.tsx", input, {
    overwrite: true,
    scriptKind: ScriptKind.TSX,
  })

  const importedFonts = new Map<string, PresetConfig["font"]>()
  for (const declaration of sourceFile.getImportDeclarations()) {
    if (declaration.getModuleSpecifierValue() !== "next/font/google") {
      continue
    }

    for (const namedImport of declaration.getNamedImports()) {
      const importedName = namedImport.getName()
      const localName = namedImport.getAliasNode()?.getText() ?? importedName
      const font = parseFontFromNextImport(importedName)
      if (font) {
        importedFonts.set(localName, font)
      }
    }
  }

  const variables: NextFontState["variables"] = {}
  const declarations = new Map<string, FontVariable>()

  for (const statement of sourceFile.getVariableStatements()) {
    for (const declaration of statement.getDeclarations()) {
      const initializer = declaration.getInitializer()
      if (!initializer?.isKind(SyntaxKind.CallExpression)) {
        continue
      }

      const font = importedFonts.get(initializer.getExpression().getText())
      if (!font) {
        continue
      }

      const variable = getNextFontVariable(initializer)
      if (!variable) {
        continue
      }

      declarations.set(declaration.getName(), variable)
      variables[variable] = font
    }
  }

  return {
    appliedBodyVariable: getAppliedBodyVariable(
      sourceFile,
      declarations,
      framework
    ),
    variables,
  }
}

function getNextFontVariable(
  callExpression: Node & { getArguments(): Node[] }
) {
  const firstArg = callExpression.getArguments()[0]
  if (!firstArg || !Node.isObjectLiteralExpression(firstArg)) {
    return null
  }

  const property = firstArg.getProperty("variable")
  if (!property || !Node.isPropertyAssignment(property)) {
    return null
  }

  const initializer = property.getInitializer()
  if (!initializer) {
    return null
  }

  const variable = stripQuotes(initializer.getText())
  if (!FONT_VARIABLE_SET.has(variable)) {
    return null
  }

  return variable as FontVariable
}

function getAppliedBodyVariable(
  sourceFile: ReturnType<Project["createSourceFile"]>,
  declarations: Map<string, FontVariable>,
  framework: ProjectInfo["framework"]["name"]
) {
  const elements = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
    .filter((element) =>
      framework === "next-app"
        ? element.getTagNameNode().getText() === "html"
        : true
    )

  const discovered = new Set<RootFontVariable>()

  for (const element of elements) {
    const className = element.getAttribute("className")
    if (!className || !Node.isJsxAttribute(className)) {
      continue
    }

    const initializer = className.getInitializer()
    if (!initializer) {
      continue
    }

    const appliedVariables = getAppliedFontVariables(initializer, declarations)
    const utilityVariable = getAppliedBodyUtilityVariable(initializer)

    if (utilityVariable && appliedVariables.includes(utilityVariable)) {
      return utilityVariable
    }

    if (appliedVariables.length === 1) {
      discovered.add(appliedVariables[0])
    }
  }

  return discovered.size === 1 ? Array.from(discovered)[0] : null
}

function getAppliedFontVariables(
  initializer: Node,
  declarations: Map<string, FontVariable>
) {
  const expressions = Node.isJsxExpression(initializer)
    ? [
        initializer.getExpression(),
        ...initializer.getDescendantsOfKind(
          SyntaxKind.PropertyAccessExpression
        ),
      ].filter(Boolean)
    : []

  const variables = new Set<RootFontVariable>()

  for (const expression of expressions) {
    if (!expression || !Node.isPropertyAccessExpression(expression)) {
      continue
    }

    if (expression.getName() !== "variable") {
      continue
    }

    const target = expression.getExpression().getText()
    const variable = declarations.get(target)
    if (variable && ROOT_FONT_VARIABLE_SET.has(variable)) {
      variables.add(variable as RootFontVariable)
    }
  }

  return Array.from(variables)
}

function getAppliedBodyUtilityVariable(initializer: Node) {
  const text = getStringContent(initializer)

  if (/\bfont-sans\b/.test(text)) {
    return "--font-sans" as const
  }

  if (/\bfont-serif\b/.test(text)) {
    return "--font-serif" as const
  }

  if (/\bfont-mono\b/.test(text)) {
    return "--font-mono" as const
  }

  return null
}

function getStringContent(node: Node) {
  const fragments: string[] = []

  if (
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node)
  ) {
    fragments.push(node.getLiteralValue())
  }

  for (const literal of node.getDescendantsOfKind(SyntaxKind.StringLiteral)) {
    fragments.push(literal.getLiteralValue())
  }

  for (const literal of node.getDescendantsOfKind(
    SyntaxKind.NoSubstitutionTemplateLiteral
  )) {
    fragments.push(literal.getLiteralValue())
  }

  // Last-resort heuristic for dynamic className expressions.
  return fragments.length > 0 ? fragments.join(" ") : node.getText()
}

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, "")
}

function parseFontFromFamily(value: string | undefined) {
  if (!value) {
    return null
  }

  const primaryFamily = stripQuotes(value.split(",")[0]?.trim() ?? "")
    .replace(/\s+variable$/i, "")
    .trim()

  if (!primaryFamily) {
    return null
  }

  return toPresetFont(primaryFamily.replace(/\s+/g, "-"))
}

function parseFontFromDependency(value: string | undefined) {
  if (!value) {
    return null
  }

  const normalized = normalizeCssValue(value)
  // Preset font imports use variable fontsource packages.
  const prefix = "@fontsource-variable/"
  if (!normalized.startsWith(prefix)) {
    return null
  }

  return toPresetFont(normalized.slice(prefix.length))
}

function parseFontFromNextImport(value: string | undefined) {
  if (!value) {
    return null
  }

  return toPresetFont(value.replace(/_/g, "-"))
}

function toPresetFont(value: string | undefined) {
  const normalized = normalizeCssValue(value)
  return PRESET_FONT_SET.has(normalized)
    ? (normalized as PresetConfig["font"])
    : null
}

function getFontVariable(font: PresetConfig["font"]) {
  if (MONO_FONTS.has(font)) {
    return "--font-mono"
  }

  if (SERIF_FONTS.has(font)) {
    return "--font-serif"
  }

  return "--font-sans"
}

function normalizeCssValue(value: string | undefined) {
  if (!value) {
    return ""
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/"/g, "'")
    .toLowerCase()
}

function asPresetValue<T extends string>(
  set: Set<string>,
  value: string | undefined
) {
  return value && set.has(value) ? (value as T) : null
}
