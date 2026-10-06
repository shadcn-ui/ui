import { promises as fs } from "fs"
import path from "path"
import { registryItemTailwindSchema } from "@/src/registry/schema"
import {
  addElement,
  insertElement,
  removeElement,
} from "@/src/utils/codemod/array-literals"
import {
  replaceWithText,
  SyntaxErrorInsertedError,
  type SkipReason,
} from "@/src/utils/codemod/edits"
import {
  addPropertyAssignment,
  getProperty,
  getPropertyName,
  insertPropertyAssignment,
  insertSpreadAssignment,
  isPropertyAssignment,
  removeProperty,
} from "@/src/utils/codemod/object-literals"
import {
  addsSyntaxErrors,
  countSyntaxErrors,
  countSyntaxErrorsExceptSkippedCommas,
  findNodeAt,
  getText,
  parseModule,
  type ParseOptions,
} from "@/src/utils/codemod/parse"
import { Config } from "@/src/utils/get-config"
import { TailwindVersion } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { types as t } from "@babel/core"
import deepmerge from "deepmerge"
import objectToString from "stringify-object"
import { z } from "zod"

export { buildTailwindThemeColorsFromCssVars } from "@/src/utils/tailwind-theme-colors"

// Stands in for tailwindcss's Config, which has an index signature, so the
// published types do not depend on tailwindcss.
type TailwindConfig = { [key: string]: any; [key: number]: any }

export type UpdaterTailwindConfig = Omit<TailwindConfig, "plugins"> & {
  // We only want string plugins for now.
  plugins?: string[]
}

export async function updateTailwindConfig(
  tailwindConfig:
    | z.infer<typeof registryItemTailwindSchema>["config"]
    | undefined,
  config: Config,
  options: {
    silent?: boolean
    tailwindVersion?: TailwindVersion
    // A workspace install lists the files it changed from the workspace root,
    // so the config is named from there too.
    workspaceRoot?: string
  }
) {
  if (!tailwindConfig) {
    return
  }

  options = {
    silent: false,
    tailwindVersion: "v3",
    ...options,
  }

  // No tailwind config in v4.
  if (options.tailwindVersion === "v4") {
    return
  }

  const tailwindFileRelativePath = path.relative(
    options.workspaceRoot ?? config.resolvedPaths.cwd,
    config.resolvedPaths.tailwindConfig
  )
  const tailwindSpinner = spinner(
    `Updating ${highlighter.info(tailwindFileRelativePath)}`,
    {
      silent: options.silent,
    }
  ).start()

  try {
    const skipReason = await updateTailwindConfigFile(tailwindConfig, config)
    if (!skipReason) {
      tailwindSpinner?.succeed()
      return
    }

    // Stop without a check mark, since the config was left as it was, and
    // return the warning so callers that pass silent can still report it.
    tailwindSpinner?.stop()
    const warning = getSkippedConfigWarning(
      tailwindFileRelativePath,
      skipReason,
      tailwindConfig
    )
    if (!options.silent) {
      logger.warn(warning)
    }
    return warning
  } catch (error) {
    tailwindSpinner?.fail(
      `Failed to update ${highlighter.info(tailwindFileRelativePath)}.`
    )
    throw error
  }
}

// Thrown for a config Babel cannot parse the way ts-morph did: one with a
// syntax error TypeScript, and so ts-morph, parsed through, or one whose theme
// ts-morph parsed on its own in a way Babel cannot (see parseObjectLiteral).
class UnparsableConfigError extends Error {
  constructor() {
    super("Could not parse the tailwind config.")
  }
}

async function updateTailwindConfigFile(
  tailwindConfig: UpdaterTailwindConfig,
  config: Config
): Promise<SkipReason | undefined> {
  const raw = await fs.readFile(config.resolvedPaths.tailwindConfig, "utf8")

  let output: string
  try {
    output = await transformTailwindConfig(raw, tailwindConfig, config)
  } catch (error) {
    if (error instanceof UnparsableConfigError) {
      return "unparsable"
    }
    // An edit throws where ts-morph rejected it, or where Babel cannot parse
    // what it wrote.
    if (error instanceof SyntaxErrorInsertedError) {
      return "syntax-error-inserted"
    }
    throw error
  }

  // ts-morph wrote some edits that broke the config, like a property added
  // after a comment that follows the last comma, which got a second comma
  // that TypeScript skips (see parseModule).
  if (addsSyntaxErrors(raw, output, getParseOptions(config))) {
    return "syntax-error-inserted"
  }

  await fs.writeFile(config.resolvedPaths.tailwindConfig, output, "utf8")
}

function getSkippedConfigWarning(
  file: string,
  skipReason: SkipReason,
  tailwindConfig: UpdaterTailwindConfig
) {
  const problem =
    skipReason === "unparsable"
      ? "could not parse it"
      : "updating it would leave it with a syntax error"

  return `Skipped ${file}: ${problem}. Add ${describeAdditions(
    tailwindConfig
  )} to it manually.`
}

// What transformTailwindConfig adds: darkMode, each plugin, and each key of
// the theme, or of theme.extend.
function describeAdditions(tailwindConfig: UpdaterTailwindConfig) {
  const additions = ["darkMode"]

  for (const plugin of tailwindConfig.plugins ?? []) {
    const moduleName = /require\((["'])(.+?)\1\)/.exec(plugin)?.[2]
    additions.push(`the ${moduleName ?? plugin} plugin`)
  }

  for (const [key, value] of Object.entries(tailwindConfig.theme ?? {})) {
    if (key === "extend" && value && typeof value === "object") {
      additions.push(
        ...Object.keys(value).map((name) => `theme.extend.${name}`)
      )
    } else {
      additions.push(`theme.${key}`)
    }
  }

  return additions.length > 1
    ? `${additions.slice(0, -1).join(", ")} and ${additions[additions.length - 1]}`
    : additions[0]
}

export async function transformTailwindConfig(
  input: string,
  tailwindConfig: UpdaterTailwindConfig,
  config: Config
) {
  const options = getParseOptions(config)
  // Each edit returns new code, which the next step parses again. ts-morph
  // drops a leading byte order mark from the text.
  let code = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input

  // Babel gives up on some syntax errors that TypeScript parsed through.
  if (countSyntaxErrors(code, options) === Infinity) {
    throw new UnparsableConfigError()
  }

  // Find the object with content property.
  // This is faster than traversing the default export.
  // TODO: maybe we do need to traverse the default export?
  const configObject = findConfigObject(code, options)

  // We couldn't find the config object, so we return the input as is.
  if (!configObject) {
    return input
  }

  const configStart = configObject.start!
  const quoteChar = getQuoteChar(code, configObject)

  // Add darkMode.
  code = addTailwindConfigDarkMode(code, configStart, quoteChar, options)

  // Add Tailwind config plugins.
  tailwindConfig.plugins?.forEach((plugin) => {
    code = addTailwindConfigPlugin(code, configStart, plugin, options)
  })

  // Add Tailwind config theme.
  if (tailwindConfig.theme) {
    code = addTailwindConfigTheme(
      code,
      configStart,
      tailwindConfig.theme,
      options
    )
  }

  return code
}

// ts-morph parsed a .ts config as TypeScript, where `<Config>{}` is a type
// assertion, and any other config as JavaScript, with JSX.
function getParseOptions(config: Config): ParseOptions {
  // Like ts-morph's _createSourceFile, a config without resolved paths is
  // read as a .ts config.
  const resolvedPath =
    config.resolvedPaths?.tailwindConfig || "tailwind.config.ts"
  return { jsx: path.extname(resolvedPath) !== ".ts" }
}

function findConfigObject(code: string, options: ParseOptions) {
  const objects: t.ObjectExpression[] = []
  t.traverseFast(parseModule(code, options), (node) => {
    if (node.type === "ObjectExpression") {
      objects.push(node)
    }
  })

  // ts-morph's getDescendantsOfKind is in source order.
  return objects
    .sort((a, b) => a.start! - b.start!)
    .find((object) =>
      object.properties.some(
        (property) =>
          isPropertyAssignment(property) &&
          getPropertyName(code, property) === "content"
      )
    )
}

// The quotes of the config object's first string literal. TypeScript also has
// a string literal for a directive, like "use strict" in a plugin function.
// ts-morph also found those in the types of the JSDoc comments TypeScript
// attaches to nodes, like `@type {import('tailwindcss').Config}` on a member,
// which are left out.
function getQuoteChar(code: string, configObject: t.ObjectExpression) {
  let firstString: t.StringLiteral | t.DirectiveLiteral | undefined
  t.traverseFast(configObject, (node) => {
    if (
      (node.type === "StringLiteral" || node.type === "DirectiveLiteral") &&
      (!firstString || node.start! < firstString.start!)
    ) {
      firstString = node
    }
  })

  return firstString && code[firstString.start!] === "'" ? "'" : '"'
}

function addTailwindConfigDarkMode(
  code: string,
  configStart: number,
  quoteChar: string,
  options: ParseOptions
) {
  const configObject = getObjectAt(code, configStart, options)
  const existingProperty = getProperty(code, configObject, "darkMode")
  const newValue = `${quoteChar}class${quoteChar}`

  // We need to add darkMode as the first property.
  if (!existingProperty) {
    return insertPropertyAssignment(
      code,
      configObject,
      0,
      "darkMode",
      `[${newValue}]`,
      options
    )
  }

  if (!isPropertyAssignment(existingProperty)) {
    return code
  }

  const initializer = existingProperty.value

  // If property is a string, change it to an array and append.
  if (initializer.type === "StringLiteral") {
    return replaceWithText(
      code,
      initializer,
      `[${getText(code, initializer)}, ${newValue}]`,
      options
    )
  }

  // If property is an array, append.
  if (initializer.type === "ArrayExpression") {
    // Check if the array already contains the value.
    if (getElementTexts(code, initializer).includes(newValue)) {
      return code
    }
    return addElement(code, initializer, newValue, options)
  }

  return code
}

function addTailwindConfigPlugin(
  code: string,
  configStart: number,
  plugin: string,
  options: ParseOptions
) {
  const configObject = getObjectAt(code, configStart, options)
  const existingPlugins = getProperty(code, configObject, "plugins")

  if (!existingPlugins) {
    return addPropertyAssignment(
      code,
      configObject,
      "plugins",
      `[${plugin}]`,
      options
    )
  }

  if (
    isPropertyAssignment(existingPlugins) &&
    existingPlugins.value.type === "ArrayExpression"
  ) {
    if (
      getElementTexts(code, existingPlugins.value)
        .map((text) => text.replace(/["']/g, ""))
        .includes(plugin.replace(/["']/g, ""))
    ) {
      return code
    }
    return addElement(code, existingPlugins.value, plugin, options)
  }

  return code
}

function addTailwindConfigTheme(
  code: string,
  configStart: number,
  theme: UpdaterTailwindConfig["theme"],
  options: ParseOptions
) {
  // Ensure there is a theme property.
  const configObject = getObjectAt(code, configStart, options)
  if (!getProperty(code, configObject, "theme")) {
    code = addPropertyAssignment(code, configObject, "theme", "{}", options)
  }

  // Nest all spread properties.
  code = nestSpreadProperties(
    code,
    getObjectAt(code, configStart, options),
    options
  )

  // The theme is there, since it was added when missing.
  const themeProperty = getProperty(
    code,
    getObjectAt(code, configStart, options),
    "theme"
  )!
  if (!isPropertyAssignment(themeProperty)) {
    const kindName = getSyntaxKindName(themeProperty)
    throw new Error(
      `Expected the node to be of kind PropertyAssignment, but it was ${kindName}.`
    )
  }

  const themeInitializer = themeProperty.value
  if (themeInitializer.type === "ObjectExpression") {
    const themeObject = parseObjectLiteral(
      getText(code, themeInitializer),
      options
    )
    const result = deepmerge(themeObject, theme, {
      arrayMerge: (dst, src) => src,
    })
    const resultString = objectToString(result)
      .replace(/\'\.\.\.(.*)\'/g, "...$1") // Remove quote around spread element
      .replace(/\'\"/g, "'") // Replace `\" with "
      .replace(/\"\'/g, "'") // Replace `\" with "
      .replace(/\'\[/g, "[") // Replace `[ with [
      .replace(/\]\'/g, "]") // Replace `] with ]
      .replace(/\'\\\'/g, "'") // Replace `\' with '
      .replace(/\\\'/g, "'") // Replace \' with '
      .replace(/\\\'\'/g, "'")
      .replace(/\'\'/g, "'")
    code = replaceWithText(code, themeInitializer, resultString, options)
  }

  // Unnest all spread properties.
  return unnestSpreadProperties(
    code,
    getObjectAt(code, configStart, options),
    options
  )
}

// The error above keeps the message of ts-morph's asKindOrThrow, which names
// the member by its TypeScript SyntaxKind. A named member that is not a
// PropertyAssignment is a shorthand property or a method.
function getSyntaxKindName(member: t.ObjectProperty | t.ObjectMethod) {
  if (member.type === "ObjectProperty") {
    return "ShorthandPropertyAssignment"
  }
  if (member.kind === "get") {
    return "GetAccessor"
  }
  if (member.kind === "set") {
    return "SetAccessor"
  }
  return "MethodDeclaration"
}

// The object or array the next edit goes into, in the current code.
function getObjectAt(code: string, start: number, options: ParseOptions) {
  return findNodeAt(code, start, t.isObjectExpression, options)!
}

function getArrayAt(code: string, start: number, options: ParseOptions) {
  return findNodeAt(code, start, t.isArrayExpression, options)!
}

// ts-morph's getElements() keeps holes, as an empty OmittedExpression.
function getElementTexts(code: string, array: t.ArrayExpression) {
  return array.elements.map((element) =>
    element ? getText(code, element) : ""
  )
}

// deepmerge and addTailwindConfigTheme's reprint would drop spreads, so they
// become strings first: `...name` in an object becomes
// `"___name": "...name"`, and in an array, `"...name"`.
// unnestSpreadProperties turns them back.
export function nestSpreadProperties(
  code: string,
  object: t.ObjectExpression,
  options: ParseOptions
): string {
  return editEachMember(
    code,
    object,
    getObjectAt,
    options,
    (code, object, i) => {
      const property = object.properties[i]

      if (property.type === "SpreadElement") {
        const spreadText = getText(code, property.argument)

        // Replace spread with a property assignment
        //
        // As in ts-morph, the index counts comment nodes, so after one, the
        // placeholder goes in earlier, and the text it copies can bring a
        // second comma that TypeScript skips (see getCommentNodeTexts). A
        // later edit, like the theme's reprint, usually takes it out again.
        code = insertPropertyAssignment(
          code,
          object,
          i,
          // Need to escape the name with " so that deepmerge doesn't mishandle the key
          `"___${spreadText.replace(/^\.\.\./, "")}"`,
          `"...${spreadText.replace(/^\.\.\./, "")}"`,
          options
        )

        // Remove the original spread assignment, now right after it.
        const updatedObject = getObjectAt(code, object.start!, options)
        return removeProperty(
          code,
          updatedObject,
          updatedObject.properties[i + 1],
          options
        )
      }

      if (isPropertyAssignment(property)) {
        if (property.value.type === "ObjectExpression") {
          // Recursively process nested object literals
          return nestSpreadProperties(code, property.value, options)
        }
        if (property.value.type === "ArrayExpression") {
          return nestSpreadElements(code, property.value, options)
        }
      }

      return code
    }
  )
}

export function nestSpreadElements(
  code: string,
  array: t.ArrayExpression,
  options: ParseOptions
): string {
  return editEachMember(code, array, getArrayAt, options, (code, array, j) => {
    const element = array.elements[j]

    if (element?.type === "ObjectExpression") {
      // Recursive check on objects within arrays
      return nestSpreadProperties(code, element, options)
    }
    if (element?.type === "ArrayExpression") {
      // Recursive check on nested arrays
      return nestSpreadElements(code, element, options)
    }
    if (element?.type === "SpreadElement") {
      const spreadText = getText(code, element)
      // Spread element within an array
      code = removeElement(code, array, j, options)
      return insertElement(
        code,
        getArrayAt(code, array.start!, options),
        j,
        `"${spreadText}"`,
        options
      )
    }

    return code
  })
}

export function unnestSpreadProperties(
  code: string,
  object: t.ObjectExpression,
  options: ParseOptions
): string {
  return editEachMember(
    code,
    object,
    getObjectAt,
    options,
    (code, object, i) => {
      const property = object.properties[i]
      if (!isPropertyAssignment(property)) {
        return code
      }

      const initializer = property.value
      if (initializer.type === "StringLiteral") {
        const value = initializer.value
        if (!value.startsWith("...")) {
          return code
        }

        code = insertSpreadAssignment(code, object, i, value.slice(3), options)
        // Remove the placeholder, now right after the spread.
        const updatedObject = getObjectAt(code, object.start!, options)
        return removeProperty(
          code,
          updatedObject,
          updatedObject.properties[i + 1],
          options
        )
      }
      if (initializer.type === "ObjectExpression") {
        return unnestSpreadProperties(code, initializer, options)
      }
      if (initializer.type === "ArrayExpression") {
        return unnestSpreadElements(code, initializer, options)
      }

      return code
    }
  )
}

export function unnestSpreadElements(
  code: string,
  array: t.ArrayExpression,
  options: ParseOptions
): string {
  return editEachMember(code, array, getArrayAt, options, (code, array, j) => {
    const element = array.elements[j]

    if (element?.type === "ObjectExpression") {
      // Recursive check on objects within arrays
      return unnestSpreadProperties(code, element, options)
    }
    if (element?.type === "ArrayExpression") {
      // Recursive check on nested arrays
      return unnestSpreadElements(code, element, options)
    }
    if (element?.type === "StringLiteral") {
      const spreadText = getText(code, element)
      // check if spread element
      const spreadTest = /(?:^['"])(\.\.\..*)(?:['"]$)/g
      if (spreadTest.test(spreadText)) {
        code = removeElement(code, array, j, options)
        return insertElement(
          code,
          getArrayAt(code, array.start!, options),
          j,
          spreadText.replace(spreadTest, "$1"),
          options
        )
      }
    }

    return code
  })
}

// Calls edit with each index of the object's or array's members, and the
// object or array in the current code. ts-morph's nodes outlive edits, and
// its loops walk the members they listed before editing some. Replacing the
// member at an index inserts one at or before it and removes it, so the
// members after it keep their indexes. After an edit, the object or array is
// found again where it starts, which edits inside it never move.
function editEachMember<T extends t.ObjectExpression | t.ArrayExpression>(
  code: string,
  container: T,
  findAt: (code: string, start: number, options: ParseOptions) => T,
  options: ParseOptions,
  edit: (code: string, container: T, index: number) => string
) {
  const memberCount =
    container.type === "ObjectExpression"
      ? container.properties.length
      : container.elements.length

  for (let index = 0; index < memberCount; index++) {
    const editedCode = edit(code, container, index)
    if (editedCode !== code) {
      code = editedCode
      container = findAt(code, container.start!, options)
    }
  }

  return code
}

// A theme value as ts-morph's parseValue read it.
type ThemeValue =
  | string
  | number
  | boolean
  | null
  | ThemeValue[]
  | { [key: string]: ThemeValue }

// The theme as a plain object to merge into. ts-morph parsed its text on its
// own, as `const theme = <text>` in TypeScript, which Babel cannot always read
// the same way.
function parseObjectLiteral(
  objectLiteralString: string,
  options: ParseOptions
) {
  const code = `const theme = ${objectLiteralString}`
  const typeScriptOptions = { jsx: false }
  const typeScriptErrors = countSyntaxErrorsExceptSkippedCommas(
    code,
    typeScriptOptions
  )
  if (
    // In a declaration, TypeScript ends an object at a comma that starts a
    // line, which it skips elsewhere (see parseModule). Babel cannot end it
    // there.
    typeScriptErrors === Infinity ||
    // TypeScript reads JSX in a JavaScript config as a broken type
    // assertion, which Babel does not parse into the same tree.
    typeScriptErrors > countSyntaxErrorsExceptSkippedCommas(code, options)
  ) {
    throw new UnparsableConfigError()
  }

  const [statement] = parseModule(code, typeScriptOptions).program.body
  const initializer =
    statement?.type === "VariableDeclaration"
      ? statement.declarations[0]?.init
      : undefined

  if (initializer?.type !== "ObjectExpression") {
    throw new Error("Invalid input: not an object literal")
  }

  return parseObjectLiteralExpression(code, initializer)
}

function parseObjectLiteralExpression(code: string, node: t.ObjectExpression) {
  const result: { [key: string]: ThemeValue } = {}
  for (const property of node.properties) {
    if (isPropertyAssignment(property)) {
      const name = getPropertyName(code, property)!.replace(/\'/g, "")
      result[name] = parseValue(code, property.value)
    }
  }
  return result
}

// Strings keep their quotes, and anything but a literal, an array or an
// object is its source text.
function parseValue(code: string, node: t.Node | null): ThemeValue {
  // A hole is an empty OmittedExpression.
  if (!node) {
    return ""
  }

  switch (node.type) {
    case "StringLiteral":
      return getText(code, node)
    case "NumericLiteral":
      return Number(getText(code, node))
    case "BooleanLiteral":
      return node.value
    case "NullLiteral":
      return null
    case "ArrayExpression":
      return node.elements.map((element) => parseValue(code, element))
    case "ObjectExpression":
      return parseObjectLiteralExpression(code, node)
    default:
      return getText(code, node)
  }
}
