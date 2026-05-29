import type {
  ResolvedGitHubRegistrySource,
  ResolvedItemAddress,
} from "@/src/registry/address"
import { RegistrySourceFileError } from "@/src/registry/errors"
import { resolveGitHubRef } from "@/src/registry/github-ref"
import type { GitHubSource } from "@/src/registry/github-ref"
import {
  loadRegistryCatalogFromSource,
  loadRegistryItemFromSource,
} from "@/src/registry/source"
import type { RegistrySourceReader } from "@/src/registry/source"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch, { Headers } from "node-fetch"

const GITHUB_RAW_URL = "https://raw.githubusercontent.com"

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

type GitHubItemAddress = Extract<ResolvedItemAddress, { scheme: "github" }>

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

function createGitHubRegistrySourceReader(
  address: GitHubSource,
  options: GitHubSourceOptions
): RegistrySourceReader {
  const shaPromise = resolveGitHubRef(address, {
    cache: options.sourceCache,
  })

  return {
    async readText(filePath) {
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
  let response: Awaited<ReturnType<typeof fetch>>
  try {
    response = await fetch(url, {
      agent,
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
        url,
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion:
        "Check your network connection and that raw.githubusercontent.com is accessible.",
    })
  }

  if (!response.ok) {
    throw new RegistrySourceFileError(filePath, undefined, {
      message: `Failed to read GitHub source file "${filePath}" from ${formatGitHubSource(
        address
      )}.`,
      context: {
        url,
        statusCode: response.status,
        source: formatGitHubSource(address),
        filePath,
      },
      suggestion:
        filePath === "registry.json"
          ? "Check that the public GitHub repository has a registry.json file at its root."
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

function formatGitHubSource(address: GitHubSource) {
  return `${address.owner}/${address.repo}#${address.ref ?? "HEAD"}`
}
