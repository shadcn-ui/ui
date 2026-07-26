import path from "path"
import { getRegistries, getRegistriesConfig } from "@/src/registry/api"
import { BUILTIN_REGISTRIES } from "@/src/registry/constants"
import fs from "fs-extra"

export interface AddRegistriesToConfigOptions {
  /** The project directory. Defaults to the current working directory. */
  cwd?: string
  /** Whether registry directory requests may use the in-memory cache. */
  useCache?: boolean
}

export interface AddRegistriesToConfigResult {
  addedRegistries: string[]
  skippedRegistries: Array<{
    namespace: string
    reason: "built-in" | "already-configured"
  }>
}

export function parseRegistryArgument(argument: string): {
  namespace: string
  url?: string
} {
  const [namespace, ...rest] = argument.split("=")
  const url = rest.length > 0 ? rest.join("=") : undefined

  if (!namespace.startsWith("@")) {
    throw new Error(
      `Invalid registry namespace: ${namespace}. Registry names must start with @ (e.g., @acme).`
    )
  }

  return { namespace, url }
}

/**
 * Add registry namespace mappings to an existing components.json file.
 *
 * Namespace-only arguments are resolved through the shadcn registry directory.
 * Existing and built-in namespaces are left unchanged and reported as skipped.
 */
export async function addRegistriesToConfig(
  registryArguments: string[],
  options: AddRegistriesToConfigOptions = {}
): Promise<AddRegistriesToConfigResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const configPath = path.resolve(cwd, "components.json")
  if (!(await fs.pathExists(configPath))) {
    throw new Error(`No components.json found at ${cwd}.`)
  }

  const parsed = registryArguments.map(parseRegistryArgument)
  const directory = parsed.some((entry) => !entry.url)
    ? await getRegistries({ useCache: options.useCache })
    : []
  const { registries: configuredRegistries } = await getRegistriesConfig(cwd, {
    useCache: false,
  })
  const registriesToAdd: Record<string, string> = {}
  const skippedRegistries: AddRegistriesToConfigResult["skippedRegistries"] = []

  for (const { namespace, url } of parsed) {
    if (namespace in BUILTIN_REGISTRIES) {
      skippedRegistries.push({ namespace, reason: "built-in" })
      continue
    }
    if (configuredRegistries[namespace]) {
      skippedRegistries.push({ namespace, reason: "already-configured" })
      continue
    }

    if (url) {
      if (!url.includes("{name}")) {
        throw new Error(
          `Invalid registry URL for ${namespace}. URL must include {name} placeholder. Example: ${namespace}=https://example.com/r/{name}.json`
        )
      }
      registriesToAdd[namespace] = url
      continue
    }

    const registry = directory.find((entry) => entry.name === namespace)
    if (!registry) {
      throw new Error(
        `Registry ${namespace} not found. Provide a URL: ${namespace}=https://.../{name}.json`
      )
    }
    registriesToAdd[namespace] = registry.url
  }

  const addedRegistries = Object.keys(registriesToAdd)
  if (addedRegistries.length > 0) {
    const document = await fs.readJson(configPath)
    await fs.writeJson(
      configPath,
      {
        ...document,
        registries: {
          ...(document.registries || {}),
          ...registriesToAdd,
        },
      },
      { spaces: 2 }
    )
  }

  return { addedRegistries, skippedRegistries }
}
