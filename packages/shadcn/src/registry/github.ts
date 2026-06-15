import type {
  ResolvedGitHubRegistrySource,
  ResolvedItemAddress,
} from "@/src/registry/address"
import { RegistryError, RegistrySourceFileError } from "@/src/registry/errors"
import { resolveGitHubRef } from "@/src/registry/github-ref"
import type { GitHubSource } from "@/src/registry/github-ref"
import { fetchWithProxy } from "@/src/registry/proxy"
import {
  loadRegistryCatalogFromSource,
  loadRegistryItemFromSource,
} from "@/src/registry/source"
import type { RegistrySourceReader } from "@/src/registry/source"

const GITHUB_RAW_URL = "https://raw.githubusercontent.com"
const GITHUB_VALIDATION_CONCURRENCY = 8

type GitHubItemAddress = Extract<ResolvedItemAddress, { scheme: "github" }>

type GitHubRegistryValidationDiagnostic = {
  registryFile: string
  message: string
  suggestion?: string
  itemName?: string
  itemIndex?: number
  includePath?: string
  filePath?: string
}

export type GitHubSourceOptions = {
  useCache?: boolean
  sourceCache?: Map<string, Promise<string>>
}

export async function fetchGitHubRegistryItem(
  address: GitHubItemAddress,
  options: GitHubSourceOptions = {}
) {
  options = {
    ...options,
    sourceCache: options.sourceCache ?? new Map(),
  }

  const reader = createGitHubRegistrySourceReader(address, options)

  return loadRegistryItemFromSource(address.item, reader, {
    source: formatGitHubSource(address),
  })
}

export async function fetchGitHubRegistryCatalog(
  source: ResolvedGitHubRegistrySource,
  options: GitHubSourceOptions = {}
) {
  options = {
    ...options,
    sourceCache: options.sourceCache ?? new Map(),
  }

  const reader = createGitHubRegistrySourceReader(source, options)

  return loadRegistryCatalogFromSource(reader, {
    source: formatGitHubSource(source),
  })
}

export async function validateGitHubRegistrySource(
  source: ResolvedGitHubRegistrySource,
  options: GitHubSourceOptions = {}
) {
  const sourceLabel = formatGitHubSource(source)
  const registryFile = `${sourceLabel}/registry.json`
  const registryFiles = new Set<string>()
  const sourceCache = options.sourceCache ?? new Map<string, Promise<string>>()
  const sourceOptions = {
    ...options,
    sourceCache,
  }
  const sourceReader = createGitHubRegistrySourceReader(source, sourceOptions)
  const trackingReader: RegistrySourceReader = {
    async readText(filePath) {
      if (filePath.endsWith("registry.json")) {
        registryFiles.add(`${sourceLabel}/${filePath}`)
      }

      return sourceReader.readText(filePath)
    },
  }

  try {
    const registry = await loadRegistryCatalogFromSource(trackingReader, {
      source: sourceLabel,
    })
    const itemDiagnostics = await mapWithConcurrency(
      registry.items,
      GITHUB_VALIDATION_CONCURRENCY,
      async (item, itemIndex) => {
        try {
          await loadRegistryItemFromSource(item.name, trackingReader, {
            source: sourceLabel,
          })
          return null
        } catch (error) {
          return createGitHubValidationDiagnostic(error, {
            defaultRegistryFile: registryFile,
            itemName: item.name,
            itemIndex,
            sourceLabel,
          })
        }
      }
    )
    const diagnostics = itemDiagnostics.filter(
      (diagnostic): diagnostic is GitHubRegistryValidationDiagnostic =>
        diagnostic !== null
    )

    return {
      valid: diagnostics.length === 0,
      cwd: sourceLabel,
      registryFiles: registryFiles.size,
      registryFilePaths: Array.from(registryFiles),
      items: registry.items.length,
      diagnostics,
    }
  } catch (error) {
    return {
      valid: false,
      cwd: sourceLabel,
      registryFiles: registryFiles.size || 1,
      registryFilePaths: registryFiles.size
        ? Array.from(registryFiles)
        : [registryFile],
      items: 0,
      diagnostics: [
        createGitHubValidationDiagnostic(error, {
          defaultRegistryFile: registryFile,
          sourceLabel,
        }),
      ],
    }
  }
}

function createGitHubRegistrySourceReader(
  address: GitHubSource,
  options: GitHubSourceOptions
) {
  const shaPromise = resolveGitHubRef(address, {
    cache: options.sourceCache,
  })

  return {
    async readText(filePath: string) {
      const sha = await shaPromise
      const url = buildGitHubRawUrl(address, sha, filePath)

      if (options.useCache !== false && options.sourceCache?.has(url)) {
        return options.sourceCache.get(url)!
      }

      const promise = fetchGitHubSourceFile(url, filePath, address)

      if (options.useCache !== false) {
        options.sourceCache?.set(url, promise)
      }

      return promise
    },
  }
}

async function fetchGitHubSourceFile(
  url: string,
  filePath: string,
  address: GitHubSource
) {
  let response: Response
  try {
    response = await fetchWithProxy(url, {
      headers: new Headers({
        "Accept-Encoding": "identity",
        "User-Agent": "shadcn",
      }),
    })
  } catch (error) {
    throw new RegistrySourceFileError(filePath, error, {
      message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
        address
      )}.`,
      context: {
        reason: "github-source-file",
        url,
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion:
        "GitHub ref resolution succeeded, but the CLI could not fetch from raw.githubusercontent.com. Check that raw.githubusercontent.com is accessible from this network.",
    })
  }

  if (!response.ok) {
    throw new RegistrySourceFileError(filePath, undefined, {
      message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
        address
      )}.`,
      context: {
        reason: "github-source-file",
        url,
        statusCode: response.status,
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion:
        filePath === "registry.json"
          ? "The GitHub repository and ref were resolved, but raw.githubusercontent.com did not return a root registry.json file. Check that the public repository has registry.json at its root and that raw.githubusercontent.com is accessible from this network."
          : "Check that the file path exists in the public GitHub repository.",
    })
  }

  return response.text()
}

function buildGitHubRawUrl(
  address: GitHubSource,
  resolvedSha: string,
  filePath: string
) {
  const file = filePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")

  return `${GITHUB_RAW_URL}/${address.owner}/${address.repo}/${resolvedSha}/${file}`
}

async function mapWithConcurrency<T, TResult>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<TResult>
) {
  const results = new Array<TResult>(items.length)
  let nextIndex = 0
  const workerCount = Math.min(concurrency, items.length)
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < items.length) {
      const itemIndex = nextIndex++
      results[itemIndex] = await mapper(items[itemIndex]!, itemIndex)
    }
  })

  await Promise.all(workers)

  return results
}

function formatGitHubSource(address: GitHubSource) {
  return `${address.owner}/${address.repo}#${address.ref ?? "HEAD"}`
}

function createGitHubValidationDiagnostic(
  error: unknown,
  options: {
    defaultRegistryFile: string
    itemName?: string
    itemIndex?: number
    sourceLabel: string
  }
) {
  if (error instanceof RegistryError) {
    const registryFile =
      typeof error.context?.registryFile === "string"
        ? `${options.sourceLabel}/${error.context.registryFile}`
        : options.defaultRegistryFile
    const diagnostic: GitHubRegistryValidationDiagnostic = {
      registryFile,
      itemName: options.itemName,
      itemIndex:
        typeof error.context?.itemIndex === "number"
          ? error.context.itemIndex
          : options.itemIndex,
      filePath:
        typeof error.context?.itemFilePath === "string"
          ? error.context.itemFilePath
          : typeof error.context?.filePath === "string"
            ? error.context.filePath
            : undefined,
      includePath:
        typeof error.context?.includePath === "string"
          ? error.context.includePath
          : undefined,
      message: error.message,
      suggestion: error.suggestion,
    }

    return diagnostic
  }

  const diagnostic: GitHubRegistryValidationDiagnostic = {
    registryFile: options.defaultRegistryFile,
    itemName: options.itemName,
    itemIndex: options.itemIndex,
    message: error instanceof Error ? error.message : "Unknown error.",
  }

  return diagnostic
}
