import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { preFlightRegistryBuild } from "@/src/preflights/preflight-registry"
import {
  registryItemFileSchema,
  registryItemSchema,
  registrySchema,
} from "@/src/registry"
import * as ERRORS from "@/src/utils/errors"
import { configSchema } from "@/src/utils/get-config"
import { ProjectInfo, getProjectInfo } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { resolveImport } from "@/src/utils/resolve-import"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import { Project, ScriptKind } from "ts-morph"
import { loadConfig } from "tsconfig-paths"
import { z } from "zod"

export const buildOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
  outputDir: z.string(),
})

export const build = new Command()
  .name("registry:build")
  .description("builds the registry")
  .argument("[registry]", "path to registry.json file", "./registry.json")
  .option(
    "-o, --output <path>",
    "destination directory for json files",
    "./public/r"
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (registry: string, opts) => {
    await buildRegistry({
      cwd: path.resolve(opts.cwd),
      registryFile: registry,
      outputDir: opts.output,
    })
  })

async function buildRegistry(opts: z.infer<typeof buildOptionsSchema>) {
  try {
    const options = buildOptionsSchema.parse(opts)

    const [{ errors, resolvePaths, config }, projectInfo] = await Promise.all([
      preFlightRegistryBuild(options),
      getProjectInfo(options.cwd),
    ])

    if (errors[ERRORS.MISSING_CONFIG] || !config || !projectInfo) {
      logger.error(
        `A ${highlighter.info(
          "components.json"
        )} file is required to build the registry. Run ${highlighter.info(
          "shadcn init"
        )} to create one.`
      )
      logger.break()
      process.exit(1)
    }

    if (errors[ERRORS.BUILD_MISSING_REGISTRY_FILE] || !resolvePaths) {
      logger.error(
        `We could not find a registry file at ${highlighter.info(
          path.resolve(options.cwd, options.registryFile)
        )}.`
      )
      logger.break()
      process.exit(1)
    }

    const content = await fs.readFile(resolvePaths.registryFile, "utf-8")
    const result = registrySchema.safeParse(JSON.parse(content))

    if (!result.success) {
      logger.error(
        `Invalid registry file found at ${highlighter.info(
          resolvePaths.registryFile
        )}.`
      )
      logger.break()
      process.exit(1)
    }

    const buildSpinner = spinner("Building registry...")

    // Recursively resolve the registry items.
    const resolvedRegistry = await resolveRegistryItems(
      result.data,
      config,
      projectInfo
    )

    for (const registryItem of resolvedRegistry.items) {
      if (!registryItem.files) {
        continue
      }

      buildSpinner.start(`Building ${registryItem.name}...`)

      // Add the schema to the registry item.
      registryItem["$schema"] =
        "https://ui.shadcn.com/schema/registry-item.json"

      // Loop through each file in the files array.
      for (const file of registryItem.files) {
        file["content"] = await fs.readFile(
          path.resolve(resolvePaths.cwd, file.path),
          "utf-8"
        )
      }

      // Validate the registry item.
      const result = registryItemSchema.safeParse(registryItem)
      if (!result.success) {
        logger.error(
          `Invalid registry item found for ${highlighter.info(
            registryItem.name
          )}.`
        )
        continue
      }

      // Write the registry item to the output directory.
      await fs.writeFile(
        path.resolve(resolvePaths.outputDir, `${result.data.name}.json`),
        JSON.stringify(result.data, null, 2)
      )
    }

    // Copy registry.json to the output directory.
    await fs.copyFile(
      resolvePaths.registryFile,
      path.resolve(resolvePaths.outputDir, "registry.json")
    )

    buildSpinner.succeed("Building registry.")
  } catch (error) {
    logger.break()
    handleError(error)
  }
}

const project = new Project({
  compilerOptions: {},
})

async function resolveRegistryItems(
  registry: z.infer<typeof registrySchema>,
  config: z.infer<typeof configSchema>,
  projectInfo: ProjectInfo
): Promise<z.infer<typeof registrySchema>> {
  // Process each item in the registry
  for (const item of registry.items) {
    if (!item.files?.length) {
      continue
    }

    const results = await recursivelyResolveFileImports(
      item.files[0].path,
      config,
      projectInfo
    )

    if (results.files) {
      item.files.push(...results.files)
    }

    if (results.dependencies) {
      item.dependencies = item.dependencies
        ? item.dependencies.concat(results.dependencies)
        : results.dependencies
    }
  }

  return registry
}

const FILE_EXTENSIONS_FOR_LOOKUP = [".tsx", ".ts", ".jsx", ".js"]
const FILE_PATH_SKIP_LIST = ["lib/utils.ts"]
const DEPENDENCY_SKIP_LIST = ["react", "react-dom", "next"]

async function recursivelyResolveFileImports(
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
    let moduleSpecifier = importStatement.getModuleSpecifierValue()

    // If not a local import, add to the dependencies array.
    if (!moduleSpecifier.startsWith(`${projectInfo.aliasPrefix}/`)) {
      // If the module specifier does not start with `@` and has a /, add the dependency first part only.
      // E.g. `foo/bar` -> `foo`
      if (!moduleSpecifier.startsWith("@") && moduleSpecifier.includes("/")) {
        moduleSpecifier = moduleSpecifier.split("/")[0]
      }

      // Skip if the dependency is in the skip list
      if (!DEPENDENCY_SKIP_LIST.includes(moduleSpecifier)) {
        dependencies.add(moduleSpecifier)
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
