import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { Config } from "@shadcn/registry/internal/utils/get-config"
import { highlighter } from "@shadcn/registry/internal/utils/highlighter"
import { spinner } from "@shadcn/registry/internal/utils/spinner"
import {
  ObjectLiteralExpression,
  Project,
  QuoteKind,
  ScriptKind,
  SyntaxKind,
} from "ts-morph"

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
  const sourceFile = await createSourceFile(input, config)
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
  const quoteChar = getQuoteChar(configObject)

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

async function createSourceFile(input: string, config: Config) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const resolvedPath =
    config.resolvedPaths?.tailwindConfig || "tailwind.config.ts"
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

function getQuoteChar(configObject: ObjectLiteralExpression) {
  return configObject
    .getFirstDescendantByKind(SyntaxKind.StringLiteral)
    ?.getQuoteKind() === QuoteKind.Single
    ? "'"
    : '"'
}
