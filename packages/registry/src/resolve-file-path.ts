import path from "path"
import { Config } from "@/src/get-config"
import { ProjectInfo } from "@/src/get-project-info"
import { registryItemFileSchema } from "@/src/registry/schema"
import { isTargetAliasKey } from "@/src/target-aliases"
import { z } from "zod"

export function resolveFilePath(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
  options: {
    isSrcDir?: boolean
    commonRoot?: string
    framework?: ProjectInfo["framework"]["name"]
    path?: string
    fileIndex?: number
  }
) {
  if (options.path) {
    const resolvedPath = path.isAbsolute(options.path)
      ? options.path
      : path.join(config.resolvedPaths.cwd, options.path)

    // A file when its last segment has a dot before the last character, e.g.
    // "button.tsx" or ".env". A regex for this is quadratic on long paths.
    const name = resolvedPath.slice(
      Math.max(resolvedPath.lastIndexOf("/"), resolvedPath.lastIndexOf("\\")) +
        1
    )
    const isFilePath = name.slice(0, -1).includes(".")

    if (isFilePath) {
      // We'll only use the custom path for the first file.
      // This is for registry items with multiple files.
      if (options.fileIndex === 0) {
        return resolvedPath
      }
    } else {
      // If the custom path is a directory,
      // We'll place all files in the directory.
      const fileName = path.basename(file.path)
      return path.join(resolvedPath, fileName)
    }
  }

  if (file.target) {
    if (file.target.startsWith("~/")) {
      return path.join(config.resolvedPaths.cwd, file.target.replace("~/", ""))
    }

    let target = file.target
    const aliasTarget = resolveAliasTarget(target, config)

    if (aliasTarget?.resolvedPath) {
      return aliasTarget.resolvedPath
    }

    if (aliasTarget?.target) {
      target = aliasTarget.target
    }

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

function resolveAliasTarget(target: string, config: Config) {
  const match = target.match(/^@([^/]+)\/(.+)$/)

  if (!match) {
    return null
  }

  const [, aliasKey, targetPath] = match

  if (!isTargetAliasKey(aliasKey)) {
    return {
      target: `${aliasKey}/${targetPath}`,
    }
  }

  const aliasRoot = path.resolve(config.resolvedPaths[aliasKey])
  const resolvedPath = path.resolve(aliasRoot, targetPath)

  if (
    resolvedPath !== aliasRoot &&
    !resolvedPath.startsWith(`${aliasRoot}${path.sep}`)
  ) {
    throw new Error(
      `Invalid target path "${target}". Target paths using @${aliasKey}/ must stay within the ${aliasKey} alias root.`
    )
  }

  return {
    resolvedPath,
  }
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
  const normalizedPaths = paths.map((p) => p.replace(/^\//, ""))
  const normalizedNeedle = needle.replace(/^\//, "")

  const needleDir = normalizedNeedle.split("/").slice(0, -1).join("/")

  if (!needleDir) {
    return ""
  }

  const needleSegments = needleDir.split("/")

  // Walk up from the deepest directory to the first one shared with another path.
  for (let i = needleSegments.length; i > 0; i--) {
    const testPath = needleSegments.slice(0, i).join("/")
    const hasRelatedPaths = normalizedPaths.some(
      (path) => path !== normalizedNeedle && path.startsWith(testPath + "/")
    )
    if (hasRelatedPaths) {
      return "/" + testPath
    }
  }

  return "/" + needleDir
}

export function resolveNestedFilePath(
  filePath: string,
  targetDir: string
): string {
  const normalizedFilePath = filePath.replace(/^\/|\/$/g, "")
  const normalizedTargetDir = targetDir.replace(/^\/|\/$/g, "")

  const fileSegments = normalizedFilePath.split("/")
  const targetSegments = normalizedTargetDir.split("/")

  const lastTargetSegment = targetSegments[targetSegments.length - 1]
  const commonDirIndex = fileSegments.findIndex(
    (segment) => segment === lastTargetSegment
  )

  if (commonDirIndex === -1) {
    return fileSegments[fileSegments.length - 1]
  }

  return fileSegments.slice(commonDirIndex + 1).join("/")
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
