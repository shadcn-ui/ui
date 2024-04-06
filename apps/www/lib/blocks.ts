"use server"

import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { Index } from "@/__registry__"
import {
  ImportDeclaration,
  Project,
  ScriptKind,
  SourceFile,
  SyntaxKind,
} from "ts-morph"
import { z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import { BackendProvider, backendProviders } from "@/registry/backend-provider"
import { BlockChunk, blockSchema, registryEntrySchema } from "@/registry/schema"
import { Style } from "@/registry/styles"

const DEFAULT_BLOCKS_STYLE = "default" satisfies Style["name"]

const project = new Project({
  compilerOptions: {},
})

export async function getAllBlockIds(
  style: Style["name"] = DEFAULT_BLOCKS_STYLE
) {
  const blocks = await _getAllBlocks(style)
  return blocks
    .filter((x) => x.name === "authentication-01")
    .map((block) => block.name)
}

export async function getBlock(
  name: string,
  style: Style["name"] = DEFAULT_BLOCKS_STYLE
) {
  const entry = Index[style][name]

  /*
   * With backend providers, we need to fetch an array of content for each backend provider
   */
  if (entry.backendProviders.length > 0) {
    const content = await _getBlockContent(name, style, undefined)

    let code: any = {}
    await Promise.all(
      entry.backendProviders.map(async (provider: BackendProvider["name"]) => {
        const _content = await _getBlockContent(name, style, provider)
        code[provider] = _content.code
      })
    )

    return blockSchema.parse({
      style,
      highlightedCode: content.code, // ? await highlightCode(content.code) : "",
      ...entry,
      ...content,
      backendProvidersCode: code,
      type: "components:block",
    })
  } else {
    /*
     * With no backend providers, we need return one content block
     */
    const content = await _getBlockContent(name, style, undefined)

    // no chunks are available on authentiction blocks yet
    const chunks = await Promise.all(
      entry.chunks?.map(async (chunk: BlockChunk) => {
        const code = await readFile(chunk.file)

        const tempFile = await createTempSourceFile(`${chunk.name}.tsx`)
        const sourceFile = project.createSourceFile(tempFile, code, {
          scriptKind: ScriptKind.TSX,
        })

        sourceFile
          .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
          .filter((node) => {
            return node.getAttribute("x-chunk") !== undefined
          })
          ?.map((component) => {
            component
              .getAttribute("x-chunk")
              ?.asKind(SyntaxKind.JsxAttribute)
              ?.remove()
          })

        // console.log("source", sourceFile.getText())

        return {
          ...chunk,
          code: sourceFile.getText(),
        }
      })
    )

    return blockSchema.parse({
      style,
      highlightedCode: content.code,
      // ? await highlightCode(content.code) : "",
      ...entry,
      ...content,
      chunks,
      type: "components:block",
    })
  }
}

async function _getAllBlocks(style: Style["name"] = DEFAULT_BLOCKS_STYLE) {
  const index = z.record(registryEntrySchema).parse(Index[style])

  return Object.values(index).filter(
    (block) => block.type === "components:block"
  )
}

async function _getBlockCode(
  name: string,
  style: Style["name"] = DEFAULT_BLOCKS_STYLE
) {
  const entry = Index[style][name]
  const block = registryEntrySchema.parse(entry)

  if (!block.source) {
    return ""
  }

  return await readFile(block.source)
}

async function readFile(source: string) {
  const filepath = path.join(process.cwd(), source)
  return await fs.readFile(filepath, "utf-8")
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "codex-"))
  return path.join(dir, filename)
}

async function _getBlockContent(
  name: string,
  style: Style["name"],
  provider: BackendProvider["name"] | undefined
) {
  const raw = await _getBlockCode(name, style)

  const tempFile = await createTempSourceFile(`${name}.tsx`)
  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.TSX,
  })

  // Extract meta.
  const description = _extractVariable(sourceFile, "description")
  const iframeHeight = _extractVariable(sourceFile, "iframeHeight")
  const containerClassName = _extractVariable(sourceFile, "containerClassName")

  if (provider) {
    // get file text content of auth backendLogic/authentication-01 for each provider
    const newFunctionCode = await readFile(
      path.join(`backendLogic/${name}`, `${provider}.tsx`)
    )

    console.log(provider, newFunctionCode)
    replaceFunction(sourceFile, "handleSubmit", newFunctionCode)
  }

  // Usage example:
  removeParameter(sourceFile, "LoginForm", "backendProvider")
  // remove redundant imports
  removeImportsWithSubstring(project, sourceFile, "backendLogic")
  removeImportsWithSubstring(project, sourceFile, "backend-provider")

  // Format the code.

  let code = sourceFile.getText()
  code = code.replaceAll(`@/registry/${style}/`, "@/components/")
  code = code.replaceAll("export default", "export")

  // console.log("code", code)

  return {
    description,
    code,
    container: {
      height: iframeHeight,
      className: containerClassName,
    },
  }
}

function _extractVariable(sourceFile: SourceFile, name: string) {
  const variable = sourceFile.getVariableDeclaration(name)
  if (!variable) {
    return null
  }

  const value = variable
    .getInitializerIfKindOrThrow(SyntaxKind.StringLiteral)
    .getLiteralValue()

  variable.remove()

  return value
}

function replaceFunction(
  sourceFile: SourceFile,
  name: string,
  newFunctionCode: string
) {
  // const _function = sourceFile.getClass(name)

  if (sourceFile) {
    // Find all function declarations in the file
    const functionDeclarations = sourceFile.getDescendantsOfKind(
      SyntaxKind.FunctionDeclaration
    )

    // Iterate over function declarations
    for (const declaration of functionDeclarations) {
      // Check if the function has default export
      if (declaration.isDefaultExport()) {
        // Search for function declaration inside the function
        const foundFunction = declaration
          .getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
          .find((subDeclaration) => subDeclaration.getName() === name)
        if (foundFunction) {
          // Replace the function declaration with the new implementation
          foundFunction.replaceWithText(newFunctionCode)
          break // Stop searching once found
        }
      }
    }
  } else {
    console.log("Source file not found.")
  }
}

function removeParameter(
  sourceFile: SourceFile,
  functionName: string,
  parameterName: string
) {
  // Find the function declaration by name
  const functionDeclaration = sourceFile
    .getFunctions()
    .find((func) => func.getName() === functionName)
  if (functionDeclaration) {
    // Find the parameter by name
    const parameter = functionDeclaration.getParameter(parameterName)
    if (parameter) {
      // Remove the parameter
      parameter.remove()
    } else {
      console.log(
        `Parameter '${parameterName}' not found in '${functionName}' function.`
      )
    }
  } else {
    // console.log(`Function '${functionName}' not found.`)
  }
}
function removeImportsWithSubstring(
  project: Project,
  sourceFile: SourceFile,
  substring: string
) {
  sourceFile
    .getImportDeclarations()
    .forEach((importDeclaration: ImportDeclaration) => {
      const importPath = importDeclaration.getModuleSpecifierValue()
      if (importPath && importPath.includes(substring)) {
        importDeclaration.remove()
      }
    })

  project.saveSync()
}
