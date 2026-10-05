import { registryItemFileSchema, registryItemSchema } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { findCommonRoot, resolveFilePath } from "@/src/utils/resolve-file-path"
import { z } from "zod"

export {
  getDependencyFromModuleSpecifier,
  recursivelyResolveFileImports,
} from "@/src/registry/resolve-file-imports"

export function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

export function isLocalFile(path: string) {
  return path.endsWith(".json") && !isUrl(path)
}

/**
 * Check if a registry item is universal (framework-agnostic).
 * A universal registry item must:
 * 1. Have type "registry:item" or "registry:file"
 * 2. If it has files, all files must have explicit targets and be type "registry:file" or "registry:item"
 * It can be installed without framework detection or a full project config.
 */
export function isUniversalRegistryItem(
  registryItem:
    | Pick<z.infer<typeof registryItemSchema>, "files" | "type">
    | null
    | undefined
): boolean {
  if (!registryItem) {
    return false
  }

  if (
    registryItem.type !== "registry:item" &&
    registryItem.type !== "registry:file"
  ) {
    return false
  }

  const files = registryItem.files ?? []

  // If there are files, all must have targets and be of type registry:file or registry:item.
  return files.every(
    (file) =>
      !!file.target &&
      (file.type === "registry:file" || file.type === "registry:item")
  )
}

// Deduplicates files based on their resolved target paths.
// When multiple files resolve to the same target path, the last one wins.
export async function deduplicateFilesByTarget(
  filesArrays: Array<z.infer<typeof registryItemFileSchema>[] | undefined>,
  config: Config
) {
  // Fallback to simple concatenation when we don't have complete config.
  if (!canDeduplicateFiles(config)) {
    return z
      .array(registryItemFileSchema)
      .parse(filesArrays.flat().filter(Boolean))
  }

  // Get project info for file resolution.
  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)
  const targetMap = new Map<string, z.infer<typeof registryItemFileSchema>>()
  const allFiles = z
    .array(registryItemFileSchema)
    .parse(filesArrays.flat().filter(Boolean))

  allFiles.forEach((file) => {
    const resolvedPath = resolveFilePath(file, config, {
      isSrcDir: projectInfo?.isSrcDir,
      framework: projectInfo?.framework.name,
      commonRoot: findCommonRoot(
        allFiles.map((f) => f.path),
        file.path
      ),
    })

    if (resolvedPath) {
      // Last one wins - overwrites previous entry.
      targetMap.set(resolvedPath, file)
    }
  })

  return Array.from(targetMap.values())
}

// Checks if the config has the minimum required paths for file deduplication.
export function canDeduplicateFiles(config: Config) {
  return !!(
    config?.resolvedPaths?.cwd &&
    (config?.resolvedPaths?.ui ||
      config?.resolvedPaths?.lib ||
      config?.resolvedPaths?.components ||
      config?.resolvedPaths?.hooks)
  )
}
