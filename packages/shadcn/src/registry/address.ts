import { RegistryValidationError } from "@/src/registry/errors"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import { isLocalFile, isUrl } from "@/src/registry/utils"

const GITHUB_OWNER_PATTERN =
  /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/
const GITHUB_REPO_PATTERN = /^[a-zA-Z0-9._-]+$/
const CONTROL_CHARACTER_PATTERN = /[\x00-\x1F\x7F]/

export type ResolvedItemAddress =
  | {
      scheme: "shadcn"
      item: string
    }
  | {
      scheme: "namespace"
      namespace: string
      item: string
    }
  | {
      scheme: "url"
      url: string
    }
  | {
      scheme: "file"
      path: string
    }
  | {
      scheme: "github"
      owner: string
      repo: string
      item: string
      ref?: string
    }

export type ResolvedGitHubRegistrySource = {
  owner: string
  repo: string
  ref?: string
}

export function resolveItemAddress(address: string): ResolvedItemAddress {
  if (isUrl(address)) {
    return {
      scheme: "url",
      url: address,
    }
  }

  if (isLocalFile(address)) {
    return {
      scheme: "file",
      path: address,
    }
  }

  const { registry, item } = parseRegistryAndItemFromString(address)
  if (registry) {
    return {
      scheme: "namespace",
      namespace: registry,
      item,
    }
  }

  const githubAddress = resolveGitHubItemAddress(address)
  if (githubAddress) {
    return githubAddress
  }

  return {
    scheme: "shadcn",
    item: address,
  }
}

export function isGitHubItemAddress(address: string) {
  return resolveItemAddress(address).scheme === "github"
}

export function resolveGitHubRegistrySource(
  source: string
): ResolvedGitHubRegistrySource | null {
  const hashIndex = source.indexOf("#")
  const path = hashIndex === -1 ? source : source.slice(0, hashIndex)
  const ref = hashIndex === -1 ? undefined : source.slice(hashIndex + 1)
  const parts = path.split("/")

  if (parts.length !== 2) {
    return null
  }

  const [owner, repo] = parts
  if (!isGitHubOwner(owner) || !isGitHubRepo(repo)) {
    return null
  }

  if (ref !== undefined && !isValidGitHubRef(ref)) {
    throw new RegistryValidationError(
      `Invalid GitHub ref in registry source "${source}".`,
      {
        context: {
          source,
          ref,
        },
        suggestion:
          "Use a non-empty branch, tag, or commit SHA without control characters.",
      }
    )
  }

  return {
    owner,
    repo,
    ref,
  }
}

export function isGitHubRegistrySource(source: string) {
  return resolveGitHubRegistrySource(source) !== null
}

function resolveGitHubItemAddress(
  address: string
): Extract<ResolvedItemAddress, { scheme: "github" }> | null {
  const hashIndex = address.indexOf("#")
  const source = hashIndex === -1 ? address : address.slice(0, hashIndex)
  const ref = hashIndex === -1 ? undefined : address.slice(hashIndex + 1)
  const parts = source.split("/")

  if (parts.length < 3) {
    return null
  }

  const [owner, repo, ...itemParts] = parts
  if (!isGitHubOwner(owner) || !isGitHubRepo(repo)) {
    return null
  }

  const item = itemParts.join("/")
  if (!item) {
    return null
  }

  if (ref !== undefined && !isValidGitHubRef(ref)) {
    throw new RegistryValidationError(
      `Invalid GitHub ref in item address "${address}".`,
      {
        context: {
          address,
          ref,
        },
        suggestion:
          "Use a non-empty branch, tag, or commit SHA without control characters.",
      }
    )
  }

  return {
    scheme: "github",
    owner,
    repo,
    item,
    ref,
  }
}

function isGitHubOwner(owner: string) {
  return GITHUB_OWNER_PATTERN.test(owner)
}

function isGitHubRepo(repo: string) {
  return GITHUB_REPO_PATTERN.test(repo)
}

function isValidGitHubRef(ref: string) {
  return !!ref && !CONTROL_CHARACTER_PATTERN.test(ref)
}
