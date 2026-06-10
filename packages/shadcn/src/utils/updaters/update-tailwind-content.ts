import { promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import {
  _createSourceFile,
  _getQuoteChar,
} from "@/src/utils/updaters/update-tailwind-config"
import { ObjectLiteralExpression, SyntaxKind } from "ts-morph"

export async function updateTailwindContent(
  content: string[],
  config: Config,
  options: {
    silent?: boolean
  }
) {
  if (!content) {
    return
  }

  options = {
    silent: false,
    ...options,
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
  const output = await transformTailwindContent(raw, content, config)
  await fs.writeFile(config.resolvedPaths.tailwindConfig, output, "utf8")
  tailwindSpinner?.succeed()
}

export async function transformTailwindContent(
  input: string,
  content: string[],
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

  addTailwindConfigContent(configObject, content)

  return sourceFile.getFullText()
}

async function addTailwindConfigContent(
  configObject: ObjectLiteralExpression,
  content: string[]
) {
  const quoteChar = _getQuoteChar(configObject)

  const existingProperty = configObject.getProperty("content")

  if (!existingProperty) {
    const newProperty = {
      name: "content",
      initializer: `[${quoteChar}${content.join(
        `${quoteChar}, ${quoteChar}`
      )}${quoteChar}]`,
    }
    configObject.addPropertyAssignment(newProperty)

    return configObject
  }

  if (existingProperty.isKind(SyntaxKind.PropertyAssignment)) {
    const initializer = existingProperty.getInitializer()

    // If property is an array, append.
    if (initializer?.isKind(SyntaxKind.ArrayLiteralExpression)) {
      for (const contentItem of content) {
        const newValue = `${quoteChar}${contentItem}${quoteChar}`

        // Check if the array already contains the value.
        if (
          initializer
            .getElements()
            .map((element) => element.getText())
            .includes(newValue)
        ) {
          continue
        }

        initializer.addElement(newValue)
      }
    }

    return configObject
  }

  return configObject
}
