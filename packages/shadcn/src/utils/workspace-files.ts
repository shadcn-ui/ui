import {
  findCommonRoot,
  findPackageRoot,
  type Config,
} from "@/src/utils/get-config"
import { registryItemFileSchema, workspaceConfigSchema } from "@/src/schema"
import { z } from "zod"

const TARGET_ALIAS_KEYS = ["components", "ui", "lib", "hooks"] as const
export type TargetAliasKey = (typeof TARGET_ALIAS_KEYS)[number]

const FILE_TYPE_TO_CONFIG_KEY: Record<string, TargetAliasKey> = {
  "registry:ui": "ui",
  "registry:hook": "hooks",
  "registry:lib": "lib",
}

type RegistryFile = z.infer<typeof registryItemFileSchema>

export type WorkspaceFileGroup = {
  targetKey: TargetAliasKey
  targetConfig: Config
  targetFiles: RegistryFile[]
  // All files that resolve to the same package as targetConfig. Used so
  // cross-file imports (e.g. a ui file importing a lib file in the same
  // package) resolve correctly when planning file paths.
  plannedFiles: RegistryFile[]
  workspaceRoot: string
  packageRoot: string
}

/**
 * Group registry files by their target workspace config.
 *
 * In a monorepo, files are routed to different packages based on their type
 * (registry:ui -> the UI package, etc.) or an explicit target alias
 * (@ui/, @lib/, @hooks/, @components/). Each group is transformed with its own
 * package config so import aliases match where the file is actually written.
 *
 * This is the single source of truth for workspace routing, shared by the real
 * add path (addWorkspaceComponents) and the dry-run/diff preview path.
 */
export async function groupFilesByWorkspaceTarget(
  files: RegistryFile[],
  config: Config,
  workspaceConfig: z.infer<typeof workspaceConfigSchema>
): Promise<WorkspaceFileGroup[]> {
  const isTargetAliasKey = (key: string): key is TargetAliasKey => {
    return TARGET_ALIAS_KEYS.includes(key as TargetAliasKey)
  }
  const getTargetAliasKey = (target?: string) => {
    const match = target?.match(/^@([^/]+)\//)
    return match && isTargetAliasKey(match[1]) ? match[1] : null
  }
  const getTargetConfigKeyForFile = (file: RegistryFile) => {
    return (
      getTargetAliasKey(file.target) ??
      FILE_TYPE_TO_CONFIG_KEY[file.type || "registry:ui"] ??
      "components"
    )
  }
  const getTargetConfigForKey = (configKey: TargetAliasKey) => {
    return configKey && workspaceConfig[configKey]
      ? workspaceConfig[configKey]
      : config
  }

  const filesByTarget = new Map<TargetAliasKey, RegistryFile[]>()
  for (const file of files ?? []) {
    const targetKey = getTargetConfigKeyForFile(file)
    if (!filesByTarget.has(targetKey)) {
      filesByTarget.set(targetKey, [])
    }
    filesByTarget.get(targetKey)!.push(file)
  }

  const groups: WorkspaceFileGroup[] = []
  for (const targetKey of Array.from(filesByTarget.keys())) {
    const targetFiles = filesByTarget.get(targetKey)!
    const targetConfig = getTargetConfigForKey(targetKey)
    const plannedFiles = (files ?? []).filter((file) => {
      const fileTargetConfig = getTargetConfigForKey(
        getTargetConfigKeyForFile(file)
      )

      return (
        fileTargetConfig.resolvedPaths.cwd === targetConfig.resolvedPaths.cwd
      )
    })

    const workspaceRoot = findCommonRoot(
      config.resolvedPaths.cwd,
      targetConfig.resolvedPaths.ui || targetConfig.resolvedPaths.cwd
    )
    const packageRoot =
      (await findPackageRoot(workspaceRoot, targetConfig.resolvedPaths.cwd)) ??
      targetConfig.resolvedPaths.cwd

    groups.push({
      targetKey,
      targetConfig,
      targetFiles,
      plannedFiles,
      workspaceRoot,
      packageRoot,
    })
  }

  return groups
}
