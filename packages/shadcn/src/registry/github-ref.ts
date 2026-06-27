import type {
  ResolvedGitHubRegistrySource,
  ResolvedItemAddress,
} from "@/src/registry/address"
import { RegistrySourceFileError } from "@/src/registry/errors"
import { execa } from "execa"

const GITHUB_URL = "https://github.com"
const GITHUB_SHA_PATTERN = /^[a-fA-F0-9]{40}$/
const GITHUB_REF_RESOLUTION_TIMEOUT = 15_000

type GitHubItemAddress = Extract<ResolvedItemAddress, { scheme: "github" }>
export type GitHubSource = GitHubItemAddress | ResolvedGitHubRegistrySource

export type GitHubRefResolverOptions = {
  cache?: Map<string, Promise<string>>
}

export async function resolveGitHubRef(
  address: GitHubSource,
  options: GitHubRefResolverOptions = {}
) {
  const ref = address.ref ?? "HEAD"

  if (GITHUB_SHA_PATTERN.test(ref)) {
    return ref.toLowerCase()
  }

  const cacheKey = `${address.owner}/${address.repo}#${ref}`
  if (options.cache?.has(cacheKey)) {
    return options.cache.get(cacheKey)!
  }

  const promise = resolveGitHubRefUncached(address, ref).catch((error) => {
    options.cache?.delete(cacheKey)
    throw error
  })
  options.cache?.set(cacheKey, promise)

  return promise
}

async function resolveGitHubRefUncached(address: GitHubSource, ref: string) {
  const repoUrl = `${GITHUB_URL}/${address.owner}/${address.repo}.git`
  const candidates = getGitHubRefCandidates(ref)

  let stdout: string
  try {
    const result = await execa(
      "git",
      ["ls-remote", "--symref", "--", repoUrl, ...candidates],
      {
        env: {
          GIT_TERMINAL_PROMPT: "0",
        },
        timeout: GITHUB_REF_RESOLUTION_TIMEOUT,
      }
    )
    stdout = result.stdout
  } catch (error) {
    throw createGitHubRefResolutionError(address, ref, repoUrl, error)
  }

  const refs = parseGitLsRemote(stdout)
  for (const candidate of getPreferredGitHubRefNames(ref)) {
    const sha = refs.get(candidate)
    if (sha) {
      return sha
    }
  }

  throw new RegistrySourceFileError("registry.json", undefined, {
    message: `Could not resolve GitHub ref "${ref}" for ${address.owner}/${address.repo}.`,
    context: {
      reason: "github-ref-resolution",
      source: formatGitHubSource(address),
      ref,
      repoUrl,
    },
    suggestion:
      'Use an existing branch, tag, or full commit SHA. For example: "owner/repo/item#main" or "owner/repo/item#v1.0.0".',
  })
}

export function getGitHubRefCandidates(ref: string) {
  return Array.from(new Set(getPreferredGitHubRefNames(ref)))
}

export function getPreferredGitHubRefNames(ref: string) {
  if (ref === "HEAD") {
    return ["HEAD"]
  }

  if (ref.startsWith("refs/tags/")) {
    return [`${ref}^{}`, ref]
  }

  if (ref.startsWith("refs/")) {
    return [ref]
  }

  return [`refs/heads/${ref}`, `refs/tags/${ref}^{}`, `refs/tags/${ref}`, ref]
}

export function parseGitLsRemote(stdout: string) {
  const refs = new Map<string, string>()

  for (const line of stdout.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("ref:")) {
      continue
    }

    const [sha, ref] = trimmed.split(/\s+/)
    if (sha && ref && GITHUB_SHA_PATTERN.test(sha)) {
      refs.set(ref, sha.toLowerCase())
    }
  }

  return refs
}

function createGitHubRefResolutionError(
  address: GitHubSource,
  ref: string,
  repoUrl: string,
  error: unknown
) {
  return new RegistrySourceFileError("registry.json", error, {
    message: `Failed to resolve GitHub ref "${ref}" for ${address.owner}/${address.repo}.`,
    context: {
      reason: "github-ref-resolution",
      source: formatGitHubSource(address),
      ref,
      repoUrl,
    },
    suggestion: getGitHubRefResolutionSuggestion(error),
  })
}

function getGitHubRefResolutionSuggestion(error: unknown) {
  if (isGitNotFoundError(error)) {
    return "Install Git and try again. Git is required to resolve GitHub registry refs."
  }

  if (isTimeoutError(error)) {
    return "GitHub ref resolution timed out. Check your network connection and try again."
  }

  return "Check that the public GitHub repository exists and the ref is accessible."
}

function isGitNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  )
}

function isTimeoutError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "timedOut" in error &&
    error.timedOut === true
  )
}

function formatGitHubSource(address: GitHubSource) {
  return `${address.owner}/${address.repo}#${address.ref ?? "HEAD"}`
}
