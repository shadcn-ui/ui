import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { registryItemTailwindSchema } from "@/src/registry/schema"
import { Config } from "@/src/utils/get-config"
import { TailwindVersion } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import deepmerge from "deepmerge"
import objectToString from "stringify-object"
import { type Config as TailwindConfig } from "tailwindcss"
import {
  ArrayLiteralExpression,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  QuoteKind,
  ScriptKind,
  SyntaxKind,
  VariableStatement,
} from "ts-morph"
import { z } from "zod"

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
    config.resolvedPaths.cwd,
    config.resolvedPaths.tailwindConfig
  )
  const tailwindSpinner = spinner(
    `Updating ${highlighter.info(tailwindFileRelativePath)}`,
    {
      silent: options.silent,
    }
  ).start()
  const raw = await fs.readFile(config.resolvedPaths.tailwindConfig, "utf8")
  const output = await transformTailwindConfig(raw, tailwindConfig, config)
  await fs.writeFile(config.resolvedPaths.tailwindConfig, output, "utf8")
  tailwindSpinner?.succeed()
}

export async function transformTailwindConfig(
  input: string,
  tailwindConfig: UpdaterTailwindConfig,
  config: Config
) {
  const sourceFile = await _createSourceFile(input, config)
  // Find the object with content property.
  // This is faster than traversing the default export.
  // TODO: maybe we do need to traverse the default export?
  const configObject = sourceFile
    .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
    .find((node) =>
      node
        .getProperties()
        .some(
          (property) =>
            property.isKind(SyntaxKind.PropertyAssignment) &&
            property.getName() === "content"
        )
    )

  // We couldn't find the config object, so we return the input as is.
  if (!configObject) {
    return input
  }

  const quoteChar = _getQuoteChar(configObject)

  // Add darkMode.
  addTailwindConfigProperty(
    configObject,
    {
      name: "darkMode",
      value: "class",
    },
    { quoteChar }
  )

  // Add Tailwind config plugins.
  tailwindConfig.plugins?.forEach((plugin) => {
    addTailwindConfigPlugin(configObject, plugin)
  })

  // Add Tailwind config theme.
  if (tailwindConfig.theme) {
    await addTailwindConfigTheme(configObject, tailwindConfig.theme)
  }

  return sourceFile.getFullText()
}

function addTailwindConfigProperty(
  configObject: ObjectLiteralExpression,
  property: {
    name: string
    value: string
  },
  {
    quoteChar,
  }: {
    quoteChar: string
  }
) {
  const existingProperty = configObject.getProperty("darkMode")

  if (!existingProperty) {
    const newProperty = {
      name: property.name,
      initializer: `[${quoteChar}${property.value}${quoteChar}]`,
    }

    // We need to add darkMode as the first property.
    if (property.name === "darkMode") {
      configObject.insertPropertyAssignment(0, newProperty)
      return configObject
    }

    configObject.addPropertyAssignment(newProperty)

    return configObject
  }

  if (existingProperty.isKind(SyntaxKind.PropertyAssignment)) {
    const initializer = existingProperty.getInitializer()
    const newValue = `${quoteChar}${property.value}${quoteChar}`

    // If property is a string, change it to an array and append.
    if (initializer?.isKind(SyntaxKind.StringLiteral)) {
      const initializerText = initializer.getText()
      initializer.replaceWithText(`[${initializerText}, ${newValue}]`)
      return configObject
    }

    // If property is an array, append.
    if (initializer?.isKind(SyntaxKind.ArrayLiteralExpression)) {
      // Check if the array already contains the value.
      if (
        initializer
          .getElements()
          .map((element) => element.getText())
          .includes(newValue)
      ) {
        return configObject
      }
      initializer.addElement(newValue)
    }

    return configObject
  }

  return configObject
}

async function addTailwindConfigTheme(
  configObject: ObjectLiteralExpression,
  theme: UpdaterTailwindConfig["theme"]
) {
  // Ensure there is a theme property.
  if (!configObject.getProperty("theme")) {
    configObject.addPropertyAssignment({
      name: "theme",
      initializer: "{}",
    })
  }

  // Nest all spread properties.
  nestSpreadProperties(configObject)

  const themeProperty = configObject
    .getPropertyOrThrow("theme")
    ?.asKindOrThrow(SyntaxKind.PropertyAssignment)

  const themeInitializer = themeProperty.getInitializer()
  if (themeInitializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const themeObjectString = themeInitializer.getText()
    const themeObject = await parseObjectLiteral(themeObjectString)
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
    themeInitializer.replaceWithText(resultString)
  }

  // Unnest all spread properties.
  unnestSpreadProperties(configObject)
}

function addTailwindConfigPlugin(
  configObject: ObjectLiteralExpression,
  plugin: string
) {
  const existingPlugins = configObject.getProperty("plugins")

  if (!existingPlugins) {
    configObject.addPropertyAssignment({
      name: "plugins",
      initializer: `[${plugin}]`,
    })

    return configObject
  }

  if (existingPlugins.isKind(SyntaxKind.PropertyAssignment)) {
    const initializer = existingPlugins.getInitializer()

    if (initializer?.isKind(SyntaxKind.ArrayLiteralExpression)) {
      if (
        initializer
          .getElements()
          .map((element) => {
            return element.getText().replace(/["']/g, "")
          })
          .includes(plugin.replace(/["']/g, ""))
      ) {
        return configObject
      }
      initializer.addElement(plugin)
    }

    return configObject
  }

  return configObject
}

export async function _createSourceFile(input: string, config: Config | null) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const resolvedPath =
    config?.resolvedPaths?.tailwindConfig || "tailwind.config.ts"
  const tempFile = path.join(dir, `shadcn-${path.basename(resolvedPath)}`)

  const project = new Project({
    compilerOptions: {},
  })
  const sourceFile = project.createSourceFile(tempFile, input, {
    // Note: .js and .mjs can still be valid for TS projects.
    // We can't infer TypeScript from config.tsx.
    scriptKind:
      path.extname(resolvedPath) === ".ts" ? ScriptKind.TS : ScriptKind.JS,
  })

  return sourceFile
}

export function _getQuoteChar(configObject: ObjectLiteralExpression) {
  return configObject
    .getFirstDescendantByKind(SyntaxKind.StringLiteral)
    ?.getQuoteKind() === QuoteKind.Single
    ? "'"
    : '"'
}

export function nestSpreadProperties(obj: ObjectLiteralExpression) {
  const properties = obj.getProperties()

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]
    if (prop.isKind(SyntaxKind.SpreadAssignment)) {
      const spreadAssignment = prop.asKindOrThrow(SyntaxKind.SpreadAssignment)
      const spreadText = spreadAssignment.getExpression().getText()

      // Replace spread with a property assignment
      obj.insertPropertyAssignment(i, {
        // Need to escape the name with " so that deepmerge doesn't mishandle the key
        name: `"___${spreadText.replace(/^\.\.\./, "")}"`,
        initializer: `"...${spreadText.replace(/^\.\.\./, "")}"`,
      })

      // Remove the original spread assignment
      spreadAssignment.remove()
    } else if (prop.isKind(SyntaxKind.PropertyAssignment)) {
      const propAssignment = prop.asKindOrThrow(SyntaxKind.PropertyAssignment)
      const initializer = propAssignment.getInitializer()

      if (
        initializer &&
        initializer.isKind(SyntaxKind.ObjectLiteralExpression)
      ) {
        // Recursively process nested object literals
        nestSpreadProperties(
          initializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
        )
      } else if (
        initializer &&
        initializer.isKind(SyntaxKind.ArrayLiteralExpression)
      ) {
        nestSpreadElements(
          initializer.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
        )
      }
    }
  }
}

export function nestSpreadElements(arr: ArrayLiteralExpression) {
  const elements = arr.getElements()
  for (let j = 0; j < elements.length; j++) {
    const element = elements[j]
    if (element.isKind(SyntaxKind.ObjectLiteralExpression)) {
      // Recursive check on objects within arrays
      nestSpreadProperties(
        element.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
      )
    } else if (element.isKind(SyntaxKind.ArrayLiteralExpression)) {
      // Recursive check on nested arrays
      nestSpreadElements(
        element.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
      )
    } else if (element.isKind(SyntaxKind.SpreadElement)) {
      const spreadText = element.getText()
      // Spread element within an array
      arr.removeElement(j)
      arr.insertElement(j, `"${spreadText}"`)
    }
  }
}

export function unnestSpreadProperties(obj: ObjectLiteralExpression) {
  const properties = obj.getProperties()

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]
    if (prop.isKind(SyntaxKind.PropertyAssignment)) {
      const propAssignment = prop as PropertyAssignment
      const initializer = propAssignment.getInitializer()

      if (initializer && initializer.isKind(SyntaxKind.StringLiteral)) {
        const value = initializer
          .asKindOrThrow(SyntaxKind.StringLiteral)
          .getLiteralValue()
        if (value.startsWith("...")) {
          obj.insertSpreadAssignment(i, { expression: value.slice(3) })
          propAssignment.remove()
        }
      } else if (initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        unnestSpreadProperties(initializer as ObjectLiteralExpression)
      } else if (
        initializer &&
        initializer.isKind(SyntaxKind.ArrayLiteralExpression)
      ) {
        unnsetSpreadElements(
          initializer.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
        )
      }
    }
  }
}

export function unnsetSpreadElements(arr: ArrayLiteralExpression) {
  const elements = arr.getElements()
  for (let j = 0; j < elements.length; j++) {
    const element = elements[j]
    if (element.isKind(SyntaxKind.ObjectLiteralExpression)) {
      // Recursive check on objects within arrays
      unnestSpreadProperties(
        element.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
      )
    } else if (element.isKind(SyntaxKind.ArrayLiteralExpression)) {
      // Recursive check on nested arrays
      unnsetSpreadElements(
        element.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
      )
    } else if (element.isKind(SyntaxKind.StringLiteral)) {
      const spreadText = element.getText()
      // check if spread element
      const spreadTest = /(?:^['"])(\.\.\..*)(?:['"]$)/g
      if (spreadTest.test(spreadText)) {
        arr.removeElement(j)
        arr.insertElement(j, spreadText.replace(spreadTest, "$1"))
      }
    }
  }
}

async function parseObjectLiteral(objectLiteralString: string): Promise<any> {
  const sourceFile = await _createSourceFile(
    `const theme = ${objectLiteralString}`,
    null
  )

  const statement = sourceFile.getStatements()[0]
  if (statement?.getKind() === SyntaxKind.VariableStatement) {
    const declaration = (statement as VariableStatement)
      .getDeclarationList()
      ?.getDeclarations()[0]
    const initializer = declaration.getInitializer()
    if (initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
      return await parseObjectLiteralExpression(initializer)
    }
  }

  throw new Error("Invalid input: not an object literal")
}

function parseObjectLiteralExpression(node: ObjectLiteralExpression): any {
  const result: any = {}
  for (const property of node.getProperties()) {
    if (property.isKind(SyntaxKind.PropertyAssignment)) {
      const name = property.getName().replace(/\'/g, "")
      if (
        property.getInitializer()?.isKind(SyntaxKind.ObjectLiteralExpression)
      ) {
        result[name] = parseObjectLiteralExpression(
          property.getInitializer() as ObjectLiteralExpression
        )
      } else if (
        property.getInitializer()?.isKind(SyntaxKind.ArrayLiteralExpression)
      ) {
        result[name] = parseArrayLiteralExpression(
          property.getInitializer() as ArrayLiteralExpression
        )
      } else {
        result[name] = parseValue(property.getInitializer())
      }
    }
  }
  return result
}

function parseArrayLiteralExpression(node: ArrayLiteralExpression): any[] {
  const result: any[] = []
  for (const element of node.getElements()) {
    if (element.isKind(SyntaxKind.ObjectLiteralExpression)) {
      result.push(
        parseObjectLiteralExpression(
          element.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
        )
      )
    } else if (element.isKind(SyntaxKind.ArrayLiteralExpression)) {
      result.push(
        parseArrayLiteralExpression(
          element.asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
        )
      )
    } else {
      result.push(parseValue(element))
    }
  }
  return result
}

function parseValue(node: any): any {
  switch (node.getKind()) {
    case SyntaxKind.StringLiteral:
      return node.getText()
    case SyntaxKind.NumericLiteral:
      return Number(node.getText())
    case SyntaxKind.TrueKeyword:
      return true
    case SyntaxKind.FalseKeyword:
      return false
    case SyntaxKind.NullKeyword:
      return null
    case SyntaxKind.ArrayLiteralExpression:
      return node.getElements().map(parseValue)
    case SyntaxKind.ObjectLiteralExpression:
      return parseObjectLiteralExpression(node)
    default:
      return node.getText()
  }
}

export function buildTailwindThemeColorsFromCssVars(
  cssVars: Record<string, string>
) {
  const result: Record<string, any> = {}

  for (const key of Object.keys(cssVars)) {
    const parts = key.split("-")
    const colorName = parts[0]
    const subType = parts.slice(1).join("-")

    if (subType === "") {
      if (typeof result[colorName] === "object") {
        result[colorName].DEFAULT = `hsl(var(--${key}))`
      } else {
        result[colorName] = `hsl(var(--${key}))`
      }
    } else {
      if (typeof result[colorName] !== "object") {
        result[colorName] = { DEFAULT: `hsl(var(--${colorName}))` }
      }
      result[colorName][subType] = `hsl(var(--${key}))`
    }
  }

  // Remove DEFAULT if it's not in the original cssVars
  for (const [colorName, value] of Object.entries(result)) {
    if (
      typeof value === "object" &&
      value.DEFAULT === `hsl(var(--${colorName}))` &&
      !(colorName in cssVars)
    ) {
      delete value.DEFAULT
    }
  }

  return result
}
