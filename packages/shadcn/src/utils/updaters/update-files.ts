import { existsSync, promises as fs } from "fs"
import { tmpdir } from "os"
import path, { basename } from "path"
import { getRegistryBaseColor } from "@/src/registry/api"
import { RegistryItem, registryItemFileSchema } from "@/src/registry/schema"
import { Config } from "@/src/utils/get-config"
import { ProjectInfo, getProjectInfo } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { resolveImport } from "@/src/utils/resolve-import"
import { spinner } from "@/src/utils/spinner"
import { transform } from "@/src/utils/transformers"
import { transformCssVars } from "@/src/utils/transformers/transform-css-vars"
import { transformIcons } from "@/src/utils/transformers/transform-icons"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { transformTwPrefixes } from "@/src/utils/transformers/transform-tw-prefix"
import prompts from "prompts"
import { Project, ScriptKind } from "ts-morph"
import { loadConfig } from "tsconfig-paths"
import { z } from "zod"

export async function updateFiles(
  files: RegistryItem["files"],
  config: Config,
  options: {
    overwrite?: boolean
    force?: boolean
    silent?: boolean
    rootSpinner?: ReturnType<typeof spinner>
    isRemote?: boolean
  }
) {
  if (!files?.length) {
    return {
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: [],
    }
  }
  options = {
    overwrite: false,
    force: false,
    silent: false,
    isRemote: false,
    ...options,
  }
  const filesCreatedSpinner = spinner(`Updating files.`, {
    silent: options.silent,
  })?.start()

  const [projectInfo, baseColor] = await Promise.all([
    getProjectInfo(config.resolvedPaths.cwd),
    getRegistryBaseColor(config.tailwind.baseColor),
  ])

  let filesCreated: string[] = []
  let filesUpdated: string[] = []
  let filesSkipped: string[] = []

  for (const file of files) {
    if (!file.content) {
      continue
    }

    let filePath = resolveFilePath(file, config, {
      isSrcDir: projectInfo?.isSrcDir,
      framework: projectInfo?.framework.name,
      commonRoot: findCommonRoot(
        files.map((f) => f.path),
        file.path
      ),
    })

    if (!filePath) {
      continue
    }

    const fileName = basename(file.path)
    const targetDir = path.dirname(filePath)

    if (!config.tsx) {
      filePath = filePath.replace(/\.tsx?$/, (match) =>
        match === ".tsx" ? ".jsx" : ".js"
      )
    }

    const existingFile = existsSync(filePath)

    // Run our transformers.
    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
        transformJsx: !config.tsx,
        isRemote: options.isRemote,
      },
      [
        transformImport,
        transformRsc,
        transformCssVars,
        transformTwPrefixes,
        transformIcons,
      ]
    )

    // Skip the file if it already exists and the content is the same.
    if (existingFile) {
      const existingFileContent = await fs.readFile(filePath, "utf-8")
      const [normalizedExisting, normalizedNew] = await Promise.all([
        getNormalizedFileContent(existingFileContent),
        getNormalizedFileContent(content),
      ])
      if (normalizedExisting === normalizedNew) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
    }

    if (existingFile && !options.overwrite) {
      filesCreatedSpinner.stop()
      if (options.rootSpinner) {
        options.rootSpinner.stop()
      }
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `The file ${highlighter.info(
          fileName
        )} already exists. Would you like to overwrite?`,
        initial: false,
      })

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        if (options.rootSpinner) {
          options.rootSpinner.start()
        }
        continue
      }
      filesCreatedSpinner?.start()
      if (options.rootSpinner) {
        options.rootSpinner.start()
      }
    }

    // Create the target directory if it doesn't exist.
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    await fs.writeFile(filePath, content, "utf-8")
    existingFile
      ? filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
      : filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath))
  }

  const allFiles = [...filesCreated, ...filesUpdated, ...filesSkipped]
  const updatedFiles = await resolveImports(allFiles, config)

  // Let's update filesUpdated with the updated files.
  filesUpdated.push(...updatedFiles)

  // If a file is in filesCreated and filesUpdated, we should remove it from filesUpdated.
  filesUpdated = filesUpdated.filter((file) => !filesCreated.includes(file))

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner?.info("No files updated.")
  }

  // Remove duplicates.
  filesCreated = Array.from(new Set(filesCreated))
  filesUpdated = Array.from(new Set(filesUpdated))
  filesSkipped = Array.from(new Set(filesSkipped))

  if (filesCreated.length) {
    filesCreatedSpinner?.succeed(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? "file" : "files"
      }:`
    )
    if (!options.silent) {
      for (const file of filesCreated) {
        logger.log(`  - ${file}`)
      }
    }
  } else {
    filesCreatedSpinner?.stop()
  }

  if (filesUpdated.length) {
    spinner(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`,
      {
        silent: options.silent,
      }
    )?.info()
    if (!options.silent) {
      for (const file of filesUpdated) {
        logger.log(`  - ${file}`)
      }
    }
  }

  if (filesSkipped.length) {
    spinner(
      `Skipped ${filesSkipped.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }: (files might be identical, use --overwrite to overwrite)`,
      {
        silent: options.silent,
      }
    )?.info()
    if (!options.silent) {
      for (const file of filesSkipped) {
        logger.log(`  - ${file}`)
      }
    }
  }

  if (!options.silent) {
    logger.break()
  }

  return {
    filesCreated,
    filesUpdated,
    filesSkipped,
  }
}

export function resolveFilePath(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
  options: {
    isSrcDir?: boolean
    commonRoot?: string
    framework?: ProjectInfo["framework"]["name"]
  }
) {
  if (file.target) {
    if (file.target.startsWith("~/")) {
      return path.join(config.resolvedPaths.cwd, file.target.replace("~/", ""))
    }

    let target = file.target

    if (file.type === "registry:page") {
      target = resolvePageTarget(target, options.framework)
      if (!target) {
        return ""
      }
    }

    return options.isSrcDir
      ? path.join(config.resolvedPaths.cwd, "src", target.replace("src/", ""))
      : path.join(config.resolvedPaths.cwd, target.replace("src/", ""))
  }

  const targetDir = resolveFileTargetDirectory(file, config)

  const relativePath = resolveNestedFilePath(file.path, targetDir)
  return path.join(targetDir, relativePath)
}

function resolveFileTargetDirectory(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config
) {
  if (file.type === "registry:ui") {
    return config.resolvedPaths.ui
  }

  if (file.type === "registry:lib") {
    return config.resolvedPaths.lib
  }

  if (file.type === "registry:block" || file.type === "registry:component") {
    return config.resolvedPaths.components
  }

  if (file.type === "registry:hook") {
    return config.resolvedPaths.hooks
  }

  return config.resolvedPaths.components
}

export function findCommonRoot(paths: string[], needle: string): string {
  // Remove leading slashes for consistent handling
  const normalizedPaths = paths.map((p) => p.replace(/^\//, ""))
  const normalizedNeedle = needle.replace(/^\//, "")

  // Get the directory path of the needle by removing the file name
  const needleDir = normalizedNeedle.split("/").slice(0, -1).join("/")

  // If needle is at root level, return empty string
  if (!needleDir) {
    return ""
  }

  // Split the needle directory into segments
  const needleSegments = needleDir.split("/")

  // Start from the full path and work backwards
  for (let i = needleSegments.length; i > 0; i--) {
    const testPath = needleSegments.slice(0, i).join("/")
    // Check if this is a common root by verifying if any other paths start with it
    const hasRelatedPaths = normalizedPaths.some(
      (path) => path !== normalizedNeedle && path.startsWith(testPath + "/")
    )
    if (hasRelatedPaths) {
      return "/" + testPath // Add leading slash back for the result
    }
  }

  // If no common root found with other files, return the parent directory of the needle
  return "/" + needleDir // Add leading slash back for the result
}

export function resolveNestedFilePath(
  filePath: string,
  targetDir: string
): string {
  // Normalize paths by removing leading/trailing slashes
  const normalizedFilePath = filePath.replace(/^\/|\/$/g, "")
  const normalizedTargetDir = targetDir.replace(/^\/|\/$/g, "")

  // Split paths into segments
  const fileSegments = normalizedFilePath.split("/")
  const targetSegments = normalizedTargetDir.split("/")

  // Find the last matching segment from targetDir in filePath
  const lastTargetSegment = targetSegments[targetSegments.length - 1]
  const commonDirIndex = fileSegments.findIndex(
    (segment) => segment === lastTargetSegment
  )

  if (commonDirIndex === -1) {
    // Return just the filename if no common directory is found
    return fileSegments[fileSegments.length - 1]
  }

  // Return everything after the common directory
  return fileSegments.slice(commonDirIndex + 1).join("/")
}

export async function getNormalizedFileContent(content: string) {
  return content.replace(/\r\n/g, "\n").trim()
}

export function resolvePageTarget(
  target: string,
  framework?: ProjectInfo["framework"]["name"]
) {
  if (!framework) {
    return ""
  }

  if (framework === "next-app") {
    return target
  }

  if (framework === "next-pages") {
    let result = target.replace(/^app\//, "pages/")
    result = result.replace(/\/page(\.[jt]sx?)$/, "$1")

    return result
  }

  if (framework === "react-router") {
    let result = target.replace(/^app\//, "app/routes/")
    result = result.replace(/\/page(\.[jt]sx?)$/, "$1")

    return result
  }

  if (framework === "laravel") {
    let result = target.replace(/^app\//, "resources/js/pages/")
    result = result.replace(/\/page(\.[jt]sx?)$/, "$1")

    return result
  }

  return ""
}

async function resolveImports(filePaths: string[], config: Config) {
  const project = new Project({
    compilerOptions: {},
  })
  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)
  const tsConfig = await loadConfig(config.resolvedPaths.cwd)
  const updatedFiles = []

  if (!projectInfo || tsConfig.resultType === "failed") {
    return []
  }

  for (const filepath of filePaths) {
    const resolvedPath = path.resolve(config.resolvedPaths.cwd, filepath)

    // Check if the file exists.
    if (!existsSync(resolvedPath)) {
      continue
    }

    const content = await fs.readFile(resolvedPath, "utf-8")

    const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
    const sourceFile = project.createSourceFile(
      path.join(dir, basename(resolvedPath)),
      content,
      {
        scriptKind: ScriptKind.TSX,
      }
    )

    // Skip if the file extension is not one of the supported extensions.
    if (![".tsx", ".ts", ".jsx", ".js"].includes(sourceFile.getExtension())) {
      continue
    }

    const importDeclarations = sourceFile.getImportDeclarations()
    for (const importDeclaration of importDeclarations) {
      const moduleSpecifier = importDeclaration.getModuleSpecifierValue()

      // Filter out non-local imports.
      if (
        projectInfo?.aliasPrefix &&
        !moduleSpecifier.startsWith(`${projectInfo.aliasPrefix}/`)
      ) {
        continue
      }

      // Find the probable import file path.
      // This is where we expect to find the file on disk.
      const probableImportFilePath = await resolveImport(
        moduleSpecifier,
        tsConfig
      )

      if (!probableImportFilePath) {
        continue
      }

      // Find the actual import file path.
      // This is the path where the file has been installed.
      const resolvedImportFilePath = resolveModuleByProbablePath(
        probableImportFilePath,
        filePaths,
        config
      )

      if (!resolvedImportFilePath) {
        continue
      }

      // Convert the resolved import file path to an aliased import.
      const newImport = toAliasedImport(
        resolvedImportFilePath,
        config,
        projectInfo
      )

      if (!newImport || newImport === moduleSpecifier) {
        continue
      }

      importDeclaration.setModuleSpecifier(newImport)

      // Write the updated content to the file.
      await fs.writeFile(resolvedPath, sourceFile.getFullText(), "utf-8")

      // Track the updated file.
      updatedFiles.push(filepath)
    }
  }

  return updatedFiles
}

/**
 * Given an absolute "probable" import path (no ext),
 * plus an array of absolute file paths you already know about,
 * return 0–N matches (best match first), and also check disk for any missing ones.
 */
export function resolveModuleByProbablePath(
  probableImportFilePath: string,
  files: string[],
  config: Config,
  extensions: string[] = [".tsx", ".ts", ".js", ".jsx", ".css"]
) {
  const cwd = path.normalize(config.resolvedPaths.cwd)

  // 1) Build a set of POSIX-normalized, project-relative files
  const relativeFiles = files.map((f) => f.split(path.sep).join(path.posix.sep))
  const fileSet = new Set(relativeFiles)

  // 2) Strip any existing extension off the absolute base path
  const extInPath = path.extname(probableImportFilePath)
  const hasExt = extInPath !== ""
  const absBase = hasExt
    ? probableImportFilePath.slice(0, -extInPath.length)
    : probableImportFilePath

  // 3) Compute the project-relative "base" directory for strong matching
  const relBaseRaw = path.relative(cwd, absBase)
  const relBase = relBaseRaw.split(path.sep).join(path.posix.sep)

  // 4) Decide which extensions to try
  const tryExts = hasExt ? [extInPath] : extensions

  // 5) Collect candidates
  const candidates = new Set<string>()

  // 5a) Fast‑path: [base + ext] and [base/index + ext]
  for (const e of tryExts) {
    const absCand = absBase + e
    const relCand = path.posix.normalize(path.relative(cwd, absCand))
    if (fileSet.has(relCand) || existsSync(absCand)) {
      candidates.add(relCand)
    }

    const absIdx = path.join(absBase, `index${e}`)
    const relIdx = path.posix.normalize(path.relative(cwd, absIdx))
    if (fileSet.has(relIdx) || existsSync(absIdx)) {
      candidates.add(relIdx)
    }
  }

  // 5b) Fallback: scan known files by basename
  const name = path.basename(absBase)
  for (const f of relativeFiles) {
    if (tryExts.some((e) => f.endsWith(`/${name}${e}`))) {
      candidates.add(f)
    }
  }

  // 6) If no matches, bail
  if (candidates.size === 0) return null

  // 7) Sort by (1) extension priority, then (2) "strong" base match
  const sorted = Array.from(candidates).sort((a, b) => {
    // a) extension order
    const aExt = path.posix.extname(a)
    const bExt = path.posix.extname(b)
    const ord = tryExts.indexOf(aExt) - tryExts.indexOf(bExt)
    if (ord !== 0) return ord
    // b) strong match if path starts with relBase
    const aStrong = relBase && a.startsWith(relBase) ? -1 : 1
    const bStrong = relBase && b.startsWith(relBase) ? -1 : 1
    return aStrong - bStrong
  })

  // 8) Return the first (best) candidate
  return sorted[0]
}

export function toAliasedImport(
  filePath: string,
  config: Config,
  projectInfo: ProjectInfo
): string | null {
  const abs = path.normalize(path.join(config.resolvedPaths.cwd, filePath))

  // 1️⃣ Find the longest matching alias root in resolvedPaths
  //    e.g. key="ui", root="/…/components/ui" beats key="components"
  const matches = Object.entries(config.resolvedPaths)
    .filter(
      ([, root]) => root && abs.startsWith(path.normalize(root + path.sep))
    )
    .sort((a, b) => b[1].length - a[1].length)

  if (matches.length === 0) {
    return null
  }
  const [aliasKey, rootDir] = matches[0]

  // 2️⃣ Compute the path UNDER that root
  let rel = path.relative(rootDir, abs)
  // force POSIX-style separators
  rel = rel.split(path.sep).join("/") // e.g. "button/index.tsx"

  // 3️⃣ Strip code-file extensions, keep others (css, json, etc.)
  const ext = path.posix.extname(rel)
  const codeExts = [".ts", ".tsx", ".js", ".jsx"]
  const keepExt = codeExts.includes(ext) ? "" : ext
  let noExt = rel.slice(0, rel.length - ext.length)

  // 4️⃣ Collapse "/index" to its directory
  if (noExt.endsWith("/index")) {
    noExt = noExt.slice(0, -"/index".length)
  }

  // 5️⃣ Build the aliased path
  //    config.aliases[aliasKey] is e.g. "@/components/ui"
  const aliasBase =
    aliasKey === "cwd"
      ? projectInfo.aliasPrefix
      : config.aliases[aliasKey as keyof typeof config.aliases]
  if (!aliasBase) {
    return null
  }
  // if noExt is empty (i.e. file was exactly at the root), we import the root
  let suffix = noExt === "" ? "" : `/${noExt}`

  // Rremove /src from suffix.
  // Alias will handle this.
  suffix = suffix.replace("/src", "")

  // 6️⃣ Prepend the prefix from projectInfo (e.g. "@") if needed
  //    but usually config.aliases already include it.
  return `${aliasBase}${suffix}${keepExt}`
}
