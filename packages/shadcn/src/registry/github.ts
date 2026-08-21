import type {
  ResolvedGitHubRegistrySource,
  ResolvedItemAddress,
} from "@/src/registry/address"
import { RegistryError, RegistrySourceFileError } from "@/src/registry/errors"
import {
  getGitHubAuthState,
  selectGitHubAuthMode,
  type GitHubSourceAuthState,
} from "@/src/registry/github-auth"
import {
  fetchGitHubFileViaGh,
  fetchGitHubFileViaRest,
  getEnvGitHubToken,
  getGitHubTransportFailureGuidance,
  GitHubTransportError,
  readGitHubResponseTextWithLimit,
  type GitHubAuthMode,
} from "@/src/registry/github-cli"
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
  const sourceCache = options.sourceCache ?? new Map<string, Promise<string>>()
  const authState = getGitHubAuthState(sourceCache, address)
  const shaPromise = resolveGitHubRef(address, {
    cache: sourceCache,
    authAnchor: sourceCache,
  })

  const readWithCache = (key: string, fetcher: () => Promise<string>) => {
    if (options.useCache !== false && sourceCache.has(key)) {
      return sourceCache.get(key)!
    }

    const promise = fetcher()

    if (options.useCache !== false) {
      sourceCache.set(key, promise)
      // Evict rejections so a transient failure is not replayed for the rest
      // of the invocation.
      promise.catch(() => {
        if (sourceCache.get(key) === promise) {
          sourceCache.delete(key)
        }
      })
    }

    return promise
  }

  const readAuthenticated = (
    sha: string,
    filePath: string,
    mode: GitHubAuthMode
  ) => {
    const key = `${mode}:${address.owner}/${address.repo}/${sha}/${filePath}`

    if (mode === "token") {
      return readWithCache(key, async () => {
        const token = getEnvGitHubToken()
        if (!token) {
          throw new GitHubTransportError("unauthenticated")
        }
        return fetchGitHubFileViaRest(address, sha, filePath, token)
      })
    }

    return readWithCache(key, () =>
      fetchGitHubFileViaGh(address, sha, filePath)
    )
  }

  return {
    async readText(filePath: string) {
      const sha = await shaPromise
      const isRoot = filePath === "registry.json"

      if (!authState.anonymousLock && authState.decision) {
        const mode = await authState.decision
        try {
          return await readAuthenticated(sha, filePath, mode)
        } catch (error) {
          throw toGitHubSourceFileError(
            error,
            address,
            filePath,
            mode,
            authState
          )
        }
      }

      const url = buildGitHubRawUrl(address, sha, filePath)
      try {
        const content = await readWithCache(`anonymous:${url}`, () =>
          fetchGitHubSourceFile(url, filePath, address)
        )
        if (isRoot) {
          // A public root locks the source so a missing child file never
          // triggers an authenticated request.
          authState.anonymousLock = true
        }
        return content
      } catch (error) {
        const statusCode =
          error instanceof RegistrySourceFileError
            ? error.context?.statusCode
            : undefined
        if (!isRoot || statusCode !== 404 || authState.anonymousLock) {
          throw error
        }

        // Only the initial anonymous root 404 may select an authenticated
        // mode. The notice is awaited inside the selection.
        let mode: GitHubAuthMode
        try {
          mode = await selectGitHubAuthMode(authState, address, error)
        } catch {
          throw error
        }

        try {
          return await readAuthenticated(sha, filePath, mode)
        } catch (authError) {
          throw toGitHubSourceFileError(
            authError,
            address,
            filePath,
            mode,
            authState
          )
        }
      }
    },
  }
}

function toGitHubSourceFileError(
  error: unknown,
  address: GitHubSource,
  filePath: string,
  mode: GitHubAuthMode,
  state: GitHubSourceAuthState
) {
  if (!(error instanceof GitHubTransportError)) {
    return error instanceof Error
      ? error
      : new RegistrySourceFileError(filePath, undefined, {
          message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
            address
          )}.`,
          context: {
            reason: "github-source-file",
            source: formatGitHubSource(address),
            filePath,
          },
        })
  }

  const guidance = getGitHubTransportFailureGuidance(error, mode)

  // An authenticated root 404 preserves the pre-auth failure so private and
  // missing repositories stay ambiguous.
  if (error.kind === "http" && error.statusCode === 404) {
    if (filePath === "registry.json" && state.originalError instanceof Error) {
      return state.originalError
    }

    return new RegistrySourceFileError(filePath, undefined, {
      message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
        address
      )}.`,
      context: {
        reason: "github-source-file",
        statusCode: 404,
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion: "Check that the file path exists in the GitHub repository.",
    })
  }

  // A missing or unauthenticated gh during the root upgrade keeps the
  // original anonymous message and adds setup guidance.
  if (
    (error.kind === "enoent" || error.kind === "unauthenticated") &&
    filePath === "registry.json" &&
    state.originalError instanceof Error
  ) {
    return new RegistrySourceFileError(filePath, undefined, {
      message: state.originalError.message,
      context: {
        reason: "github-source-file",
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion: guidance.suggestion,
    })
  }

  return new RegistrySourceFileError(filePath, undefined, {
    message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
      address
    )}. ${guidance.detail}`,
    context: {
      reason: "github-source-file",
      ...(error.statusCode ? { statusCode: error.statusCode } : {}),
      source: formatGitHubSource(address),
      filePath,
    },
    suggestion: guidance.suggestion,
  })
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
          ? 'The GitHub repository and ref were resolved, but raw.githubusercontent.com did not return a root registry.json file. Check that the public repository has registry.json at its root and that raw.githubusercontent.com is accessible from this network. If this is a private repository, run "gh auth login" or set GH_TOKEN to a token with read access.'
          : "Check that the file path exists in the public GitHub repository.",
    })
  }

  try {
    return await readGitHubResponseTextWithLimit(response)
  } catch (error) {
    if (error instanceof GitHubTransportError && error.kind === "oversize") {
      const guidance = getGitHubTransportFailureGuidance(error, "token")
      throw new RegistrySourceFileError(filePath, undefined, {
        message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
          address
        )}. ${guidance.detail}`,
        context: {
          reason: "github-source-file",
          source: formatGitHubSource(address),
          filePath,
        },
        suggestion: guidance.suggestion,
      })
    }
    throw error
  }
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
