import path from "path"
import { configWithDefaults } from "@/src/registry/config"
import { withRegistryContext } from "@/src/registry/context"
import { ConfigParseError } from "@/src/registry/errors"
import { resolveRegistryTree } from "@/src/registry/resolver"
import { configSchema } from "@/src/schema"
import { addComponents } from "@/src/utils/add-components"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { type Config } from "@/src/utils/get-config"
import { getTargetAliasKey } from "@/src/utils/target-aliases"

export async function addRegistryItems(
  items: string[],
  options: {
    cwd?: string
    config?: Partial<Config>
    overwrite?: boolean
    overwriteCssVars?: boolean
    silent?: boolean
    skipFonts?: boolean
    path?: string
  } = {}
): Promise<void> {
  if (items.length === 0) {
    return
  }

  const {
    config: inputConfig,
    cwd: inputCwd,
    ...addComponentsOptions
  } = options
  const parsedConfig = configSchema.safeParse(inputConfig)
  if (!parsedConfig.success && inputConfig && "resolvedPaths" in inputConfig) {
    const configCwd =
      typeof inputConfig.resolvedPaths?.cwd === "string"
        ? inputConfig.resolvedPaths.cwd
        : undefined
    throw new ConfigParseError(
      path.resolve(inputCwd ?? configCwd ?? process.cwd()),
      parsedConfig.error,
      "config"
    )
  }

  const configCwd = parsedConfig.success
    ? parsedConfig.data.resolvedPaths.cwd
    : undefined
  const cwd = path.resolve(inputCwd ?? configCwd ?? process.cwd())
  if (
    inputCwd !== undefined &&
    configCwd !== undefined &&
    cwd !== path.resolve(configCwd)
  ) {
    throw new Error("The provided cwd must match config.resolvedPaths.cwd.")
  }

  const config = configWithDefaults(
    parsedConfig.success
      ? parsedConfig.data
      : {
          ...inputConfig,
          resolvedPaths: {
            ...inputConfig?.resolvedPaths,
            cwd,
          },
        }
  )
  const env = await loadEnvFiles(cwd, {
    processEnv: { ...process.env },
  })

  return withRegistryContext(
    async () => {
      const resolvedTree = await resolveRegistryTree(items, config, {
        useCache: true,
        requireUniversal: !parsedConfig.success,
      })
      if (!resolvedTree) {
        throw new Error("Failed to fetch components from registry.")
      }
      if (
        !parsedConfig.success &&
        !hasResolvedTargetAliases(resolvedTree, config)
      ) {
        throw new Error(
          "A full project config is required to resolve target aliases."
        )
      }

      await addComponents(items, config, {
        ...addComponentsOptions,
        interactive: false,
        overwriteCssVars:
          options.overwriteCssVars ??
          (parsedConfig.success ? undefined : false),
        resolvedTree,
      })
    },
    { env }
  )
}

function hasResolvedTargetAliases(
  registryTree: NonNullable<Awaited<ReturnType<typeof resolveRegistryTree>>>,
  config: Config
) {
  return (registryTree.files ?? []).every((file) => {
    const aliasKey = getTargetAliasKey(file.target)

    return !aliasKey || Boolean(config.resolvedPaths[aliasKey])
  })
}
