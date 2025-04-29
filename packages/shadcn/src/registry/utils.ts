import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { registryItemSchema } from "@/src/registry"
import { configSchema } from "@/src/utils/get-config"
import { ProjectInfo } from "@/src/utils/get-project-info"
import { resolveImport } from "@/src/utils/resolve-import"
import { Project, ScriptKind } from "ts-morph"
import { loadConfig } from "tsconfig-paths"
import { z } from "zod"

const FILE_EXTENSIONS_FOR_LOOKUP = [".tsx", ".ts", ".jsx", ".js"]
const FILE_PATH_SKIP_LIST = ["lib/utils.ts"]
const DEPENDENCY_SKIP_LIST = [
  /^(react|react-dom|next)(\/.*)?$/, // Matches react, react-dom, next and their submodules
  /^(node|jsr|npm):.*$/, // Matches node:, jsr:, and npm: prefixed modules
]

const project = new Project({
  compilerOptions: {},
})

// This returns the dependency from the module specifier.
// Here dependency means an npm package.
export function getDependencyFromModuleSpecifier(
  moduleSpecifier: string
): string | null {
  // Skip if the dependency matches any pattern in the skip list
  if (DEPENDENCY_SKIP_LIST.some((pattern) => pattern.test(moduleSpecifier))) {
    return null
  }

  // If the module specifier does not start with `@` and has a /, add the dependency first part only.
  // E.g. `foo/bar` -> `foo`
  if (!moduleSpecifier.startsWith("@") && moduleSpecifier.includes("/")) {
    moduleSpecifier = moduleSpecifier.split("/")[0]
  }

  // For scoped packages, we want to keep the first two parts
  // E.g. `@types/react/dom` -> `@types/react`
  if (moduleSpecifier.startsWith("@")) {
    const parts = moduleSpecifier.split("/")
    if (parts.length > 2) {
      moduleSpecifier = parts.slice(0, 2).join("/")
    }
  }

  return moduleSpecifier
}

export async function recursivelyResolveFileImports(
  filePath: string,
  config: z.infer<typeof configSchema>,
  projectInfo: ProjectInfo
): Promise<Pick<z.infer<typeof registryItemSchema>, "files" | "dependencies">> {
  const resolvedFilePath = path.resolve(config.resolvedPaths.cwd, filePath)
  const relativeRegistryFilePath = path.relative(
    config.resolvedPaths.cwd,
    resolvedFilePath
  )

  // Skip if the file is in the skip list
  if (FILE_PATH_SKIP_LIST.includes(relativeRegistryFilePath)) {
    return { dependencies: [], files: [] }
  }

  const content = await fs.readFile(resolvedFilePath, "utf-8")
  const tempFile = await createTempSourceFile(path.basename(resolvedFilePath))
  const sourceFile = project.createSourceFile(tempFile, content, {
    scriptKind: ScriptKind.TSX,
  })
  const tsConfig = await loadConfig(config.resolvedPaths.cwd)
  if (tsConfig.resultType === "failed") {
    return { dependencies: [], files: [] }
  }

  const files: z.infer<typeof registryItemSchema>["files"] = []
  const processedFiles = new Set<string>()
  const dependencies = new Set<string>()

  // Add the original file first
  const fileType = determineFileType(filePath)
  const originalFile = {
    path: relativeRegistryFilePath,
    type: fileType,
    target: "",
  }
  files.push(originalFile)
  processedFiles.add(relativeRegistryFilePath)

  // 1. Find all import statements in the file.
  const importStatements = sourceFile.getImportDeclarations()
  for (const importStatement of importStatements) {
    const moduleSpecifier = importStatement.getModuleSpecifierValue()

    // If not a local import, add to the dependencies array.
    if (!moduleSpecifier.startsWith(`${projectInfo.aliasPrefix}/`)) {
      const dependency = getDependencyFromModuleSpecifier(moduleSpecifier)
      if (dependency) {
        dependencies.add(dependency)
      }
      continue
    }

    let probableImportFilePath = await resolveImport(moduleSpecifier, tsConfig)

    if (!probableImportFilePath) {
      continue
    }

    // Check if the probable import path has a file extension.
    // Try each extension until we find a file that exists.
    const hasExtension = path.extname(probableImportFilePath)
    if (!hasExtension) {
      for (const ext of FILE_EXTENSIONS_FOR_LOOKUP) {
        const pathWithExt: string = `${probableImportFilePath}${ext}`
        try {
          await fs.access(pathWithExt)
          probableImportFilePath = pathWithExt
          break
        } catch {
          continue
        }
      }
    }

    const relativeRegistryFilePath = path.relative(
      config.resolvedPaths.cwd,
      probableImportFilePath
    )

    // Skip if we've already processed this file or if it's in the skip list
    if (
      processedFiles.has(relativeRegistryFilePath) ||
      FILE_PATH_SKIP_LIST.includes(relativeRegistryFilePath)
    ) {
      continue
    }

    processedFiles.add(relativeRegistryFilePath)

    const fileType = determineFileType(moduleSpecifier)
    const file = {
      path: relativeRegistryFilePath,
      type: fileType,
      target: "",
    }

    // TODO (shadcn): fix this.
    if (fileType === "registry:page" || fileType === "registry:file") {
      file.target = moduleSpecifier
    }

    files.push(file)

    // Recursively process the imported file
    const nestedResults = await recursivelyResolveFileImports(
      relativeRegistryFilePath,
      config,
      projectInfo
    )

    if (nestedResults.files) {
      // Only add files that haven't been processed yet
      for (const file of nestedResults.files) {
        if (!processedFiles.has(file.path)) {
          processedFiles.add(file.path)
          files.push(file)
        }
      }
    }

    if (nestedResults.dependencies) {
      nestedResults.dependencies.forEach((dep) => dependencies.add(dep))
    }
  }

  // Deduplicate files by path
  const uniqueFiles = Array.from(
    new Map(files.map((file) => [file.path, file])).values()
  )

  return {
    dependencies: Array.from(dependencies),
    files: uniqueFiles,
  }
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  return path.join(dir, filename)
}

// This is a bit tricky to accurately determine.
// For now we'll use the module specifier to determine the type.
function determineFileType(
  moduleSpecifier: string
): z.infer<typeof registryItemSchema>["type"] {
  if (moduleSpecifier.includes("/ui/")) {
    return "registry:ui"
  }

  if (moduleSpecifier.includes("/lib/")) {
    return "registry:lib"
  }

  if (moduleSpecifier.includes("/hooks/")) {
    return "registry:hook"
  }

  if (moduleSpecifier.includes("/components/")) {
    return "registry:component"
  }

  return "registry:component"
}
