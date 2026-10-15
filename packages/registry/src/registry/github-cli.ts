import { getRegistryEnvFromContext } from "@/src/registry/context"
import type { GitHubSource } from "@/src/registry/github-ref"
import { fetchWithProxy } from "@/src/registry/proxy"
import { execa } from "execa"

const GITHUB_API_URL = "https://api.github.com"
const GITHUB_API_VERSION = "2022-11-28"
const GITHUB_ACCEPT_RAW = "application/vnd.github.raw+json"
const GITHUB_ACCEPT_JSON = "application/vnd.github+json"
const GITHUB_SHA_PATTERN = /^[a-fA-F0-9]{40}$/
const GITHUB_TOKEN_ENV_VARS = ["GH_TOKEN", "GITHUB_TOKEN"] as const
// Printable ASCII without whitespace, i.e. safe inside an HTTP header value.
const HEADER_SAFE_TOKEN_PATTERN = /^[\x21-\x7E]+$/
const GH_TIMEOUT = 15_000
const GH_CONCURRENCY = 8
const GH_STDERR_STATUS_PATTERN = /\(HTTP (\d{3})\)/
const TAG_DEREFERENCE_DEPTH = 5

export const MAX_GITHUB_SOURCE_FILE_SIZE = 5 * 1024 * 1024

export type GitHubAuthMode = "token" | "gh"

export type GitHubFailureKind =
  | "http"
  | "network"
  | "timeout"
  | "enoent"
  | "unauthenticated"
  | "oversize"
  | "invalid-response"

// Internal transport failure carrying only sanitized, validated fields. Raw
// subprocess or response output must never be attached to it.
export class GitHubTransportError extends Error {
  public readonly kind: GitHubFailureKind
  public readonly statusCode?: number

  constructor(
    kind: GitHubFailureKind,
    options: { statusCode?: number; message?: string } = {}
  ) {
    super(options.message ?? `GitHub request failed (${kind}).`)
    this.name = "GitHubTransportError"
    this.kind = kind
    this.statusCode = options.statusCode
  }
}

export function getEnvGitHubToken() {
  for (const name of GITHUB_TOKEN_ENV_VARS) {
    const value = getRegistryEnvFromContext(name)?.trim()
    if (value && HEADER_SAFE_TOKEN_PATTERN.test(value)) {
      return value
    }
  }

  return null
}

export function encodeGitHubPath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
}

export function isValidGitHubSha(sha: unknown): sha is string {
  return typeof sha === "string" && GITHUB_SHA_PATTERN.test(sha)
}

export async function readGitHubResponseTextWithLimit(
  response: Response,
  limit: number = MAX_GITHUB_SOURCE_FILE_SIZE
) {
  const contentLength = Number(response.headers.get("content-length"))
  if (Number.isFinite(contentLength) && contentLength > limit) {
    throw new GitHubTransportError("oversize")
  }

  if (!response.body) {
    const text = await response.text()
    if (Buffer.byteLength(text, "utf8") > limit) {
      throw new GitHubTransportError("oversize")
    }
    return text
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    total += value.byteLength
    if (total > limit) {
      await reader.cancel()
      throw new GitHubTransportError("oversize")
    }
    chunks.push(value)
  }

  return Buffer.concat(chunks).toString("utf8")
}

async function fetchGitHubApi(endpoint: string, token: string, accept: string) {
  let response: Response
  try {
    response = await fetchWithProxy(`${GITHUB_API_URL}/${endpoint}`, {
      headers: new Headers({
        Accept: accept,
        Authorization: `Bearer ${token}`,
        "User-Agent": "shadcn",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      }),
    })
  } catch {
    // The underlying error may embed request details, so it is dropped and
    // replaced with a fixed-string failure.
    throw new GitHubTransportError("network")
  }

  if (!response.ok) {
    throw new GitHubTransportError("http", { statusCode: response.status })
  }

  return response
}

export async function fetchGitHubFileViaRest(
  address: GitHubSource,
  sha: string,
  filePath: string,
  token: string
) {
  const response = await fetchGitHubApi(
    buildContentsEndpoint(address, sha, filePath),
    token,
    GITHUB_ACCEPT_RAW
  )

  return readGitHubResponseTextWithLimit(response)
}

let ghSlots = GH_CONCURRENCY
const ghQueue: Array<() => void> = []

async function withGhSlot<T>(run: () => Promise<T>) {
  if (ghSlots > 0) {
    ghSlots -= 1
  } else {
    // The finisher hands its slot to the woken waiter directly.
    await new Promise<void>((resolve) => ghQueue.push(resolve))
  }

  try {
    return await run()
  } finally {
    const next = ghQueue.shift()
    if (next) {
      next()
    } else {
      ghSlots += 1
    }
  }
}

function buildGhEnv() {
  const env: NodeJS.ProcessEnv = { ...process.env }

  // The gh rung must only ever use the stored github.com credential, with
  // stable output and no prompts, regardless of the parent environment.
  delete env.GH_TOKEN
  delete env.GITHUB_TOKEN
  delete env.GH_ENTERPRISE_TOKEN
  delete env.GITHUB_ENTERPRISE_TOKEN
  delete env.GH_DEBUG
  delete env.DEBUG
  delete env.GH_FORCE_TTY
  delete env.GH_TELEMETRY

  env.GH_HOST = "github.com"
  env.GH_PROMPT_DISABLED = "1"
  env.GH_NO_UPDATE_NOTIFIER = "1"
  env.GH_PAGER = "cat"
  env.NO_COLOR = "1"

  return env
}

function classifyGhFailure(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return new GitHubTransportError("network")
  }

  const failed = error as {
    code?: unknown
    timedOut?: unknown
    stderr?: unknown
  }

  if (failed.code === "ENOENT") {
    return new GitHubTransportError("enoent")
  }

  if (failed.timedOut === true) {
    return new GitHubTransportError("timeout")
  }

  const stderr = typeof failed.stderr === "string" ? failed.stderr : ""

  if (/gh auth login|not logged in/i.test(stderr)) {
    return new GitHubTransportError("unauthenticated")
  }

  const statusMatch = stderr.match(GH_STDERR_STATUS_PATTERN)
  if (statusMatch) {
    const statusCode = Number(statusMatch[1])
    if (statusCode >= 100 && statusCode <= 599) {
      return new GitHubTransportError("http", { statusCode })
    }
  }

  return new GitHubTransportError("network")
}

async function runGhApi(endpoint: string, accept: string) {
  return withGhSlot(async () => {
    try {
      const result = await execa(
        "gh",
        [
          "api",
          "--hostname",
          "github.com",
          endpoint,
          "-H",
          `Accept: ${accept}`,
          "-H",
          `X-GitHub-Api-Version: ${GITHUB_API_VERSION}`,
        ],
        {
          env: buildGhEnv(),
          extendEnv: false,
          timeout: GH_TIMEOUT,
          maxBuffer: MAX_GITHUB_SOURCE_FILE_SIZE,
          stripFinalNewline: false,
        }
      )
      return result.stdout
    } catch (error) {
      throw classifyGhFailure(error)
    }
  })
}

export async function fetchGitHubFileViaGh(
  address: GitHubSource,
  sha: string,
  filePath: string
) {
  const stdout = await runGhApi(
    buildContentsEndpoint(address, sha, filePath),
    GITHUB_ACCEPT_RAW
  )

  if (Buffer.byteLength(stdout, "utf8") > MAX_GITHUB_SOURCE_FILE_SIZE) {
    throw new GitHubTransportError("oversize")
  }

  return stdout
}

function buildContentsEndpoint(
  address: GitHubSource,
  sha: string,
  filePath: string
) {
  if (!isValidGitHubSha(sha)) {
    throw new GitHubTransportError("invalid-response")
  }

  return `repos/${address.owner}/${address.repo}/contents/${encodeGitHubPath(
    filePath
  )}?ref=${sha.toLowerCase()}`
}

// Fixed-string failure guidance keyed by sanitized classification. Nothing
// from a response body or subprocess stream may flow into these values.
export function getGitHubTransportFailureGuidance(
  error: GitHubTransportError,
  mode: GitHubAuthMode
) {
  if (error.kind === "enoent") {
    return {
      detail: "The GitHub CLI (gh) is not installed.",
      suggestion:
        'Install the GitHub CLI and run "gh auth login", or set GH_TOKEN to a token with read access.',
    }
  }

  if (error.kind === "unauthenticated") {
    return mode === "token"
      ? {
          detail: "The configured GitHub token was rejected.",
          suggestion:
            "Check that GH_TOKEN or GITHUB_TOKEN is valid and has read access to the repository.",
        }
      : {
          detail: "The GitHub CLI is not authenticated.",
          suggestion:
            'Run "gh auth login --hostname github.com" and try again.',
        }
  }

  if (error.kind === "timeout") {
    return {
      detail: "The GitHub request timed out.",
      suggestion: "Check your network connection and try again.",
    }
  }

  if (error.kind === "oversize") {
    return {
      detail: `The file exceeds the ${MAX_GITHUB_SOURCE_FILE_SIZE} byte registry source file limit.`,
      suggestion:
        "Registry source files must be smaller than 5 MiB. Reduce the file size or split the item.",
    }
  }

  if (error.kind === "http") {
    if (error.statusCode === 401) {
      return mode === "token"
        ? {
            detail: "GitHub rejected the configured token (401).",
            suggestion:
              "Check that GH_TOKEN or GITHUB_TOKEN is valid and has read access to the repository.",
          }
        : {
            detail: "GitHub rejected the stored GitHub CLI credentials (401).",
            suggestion:
              'Run "gh auth login --hostname github.com" and try again.',
          }
    }

    if (error.statusCode === 403) {
      return {
        detail: "GitHub denied access to the repository (403).",
        suggestion:
          "Check that your credentials have read access to the repository.",
      }
    }

    if (error.statusCode === 429) {
      return {
        detail: "GitHub rate limited the request (429).",
        suggestion: "Wait a few minutes and try again.",
      }
    }

    if (error.statusCode && error.statusCode >= 500) {
      return {
        detail: `GitHub returned an upstream error (${error.statusCode}).`,
        suggestion: "GitHub may be having issues. Try again later.",
      }
    }

    return {
      detail: `GitHub returned an unexpected status${
        error.statusCode ? ` (${error.statusCode})` : ""
      }.`,
      suggestion: "Check the repository and try again.",
    }
  }

  if (error.kind === "invalid-response") {
    return {
      detail: "GitHub returned an unexpected response.",
      suggestion: "Try again later.",
    }
  }

  return {
    detail: "The GitHub request failed.",
    suggestion: "Check your network connection and try again.",
  }
}

type GitHubJsonRequester = (endpoint: string) => Promise<unknown>

function createRestJsonRequester(token: string): GitHubJsonRequester {
  return async (endpoint) => {
    const response = await fetchGitHubApi(endpoint, token, GITHUB_ACCEPT_JSON)
    try {
      return await response.json()
    } catch {
      throw new GitHubTransportError("invalid-response")
    }
  }
}

function createGhJsonRequester(): GitHubJsonRequester {
  return async (endpoint) => {
    const stdout = await runGhApi(endpoint, GITHUB_ACCEPT_JSON)
    try {
      return JSON.parse(stdout)
    } catch {
      throw new GitHubTransportError("invalid-response")
    }
  }
}

export async function resolveGitHubRefViaAuth(
  address: GitHubSource,
  ref: string,
  mode: GitHubAuthMode
) {
  const token = mode === "token" ? getEnvGitHubToken() : null
  if (mode === "token" && !token) {
    throw new GitHubTransportError("unauthenticated")
  }

  const request =
    mode === "token" && token
      ? createRestJsonRequester(token)
      : createGhJsonRequester()

  if (ref === "HEAD") {
    return resolveCommitishSha(address, request, "HEAD")
  }

  if (ref.startsWith("refs/heads/")) {
    return resolveCommitishSha(
      address,
      request,
      `heads/${encodeGitHubPath(ref.slice("refs/heads/".length))}`
    )
  }

  if (ref.startsWith("refs/tags/")) {
    return resolveCommitishSha(
      address,
      request,
      `tags/${encodeGitHubPath(ref.slice("refs/tags/".length))}`
    )
  }

  if (ref.startsWith("refs/")) {
    return resolveQualifiedGitRefSha(address, request, ref)
  }

  // A shorthand ref prefers the branch. Only a missing branch may resolve as
  // a tag, matching the git ls-remote candidate ordering.
  try {
    return await resolveCommitishSha(
      address,
      request,
      `heads/${encodeGitHubPath(ref)}`
    )
  } catch (error) {
    if (
      error instanceof GitHubTransportError &&
      error.kind === "http" &&
      error.statusCode === 404
    ) {
      return resolveCommitishSha(
        address,
        request,
        `tags/${encodeGitHubPath(ref)}`
      )
    }
    throw error
  }
}

async function resolveCommitishSha(
  address: GitHubSource,
  request: GitHubJsonRequester,
  commitish: string
) {
  const result = await request(
    `repos/${address.owner}/${address.repo}/commits/${commitish}`
  )
  const sha =
    typeof result === "object" && result !== null
      ? (result as { sha?: unknown }).sha
      : undefined

  if (!isValidGitHubSha(sha)) {
    throw new GitHubTransportError("invalid-response")
  }

  return sha.toLowerCase()
}

async function resolveQualifiedGitRefSha(
  address: GitHubSource,
  request: GitHubJsonRequester,
  ref: string
) {
  const refName = encodeGitHubPath(ref.slice("refs/".length))
  const result = await request(
    `repos/${address.owner}/${address.repo}/git/ref/${refName}`
  )
  let object =
    typeof result === "object" && result !== null
      ? (result as { object?: { type?: unknown; sha?: unknown } }).object
      : undefined

  for (let depth = 0; depth < TAG_DEREFERENCE_DEPTH; depth++) {
    if (!object || !isValidGitHubSha(object.sha)) {
      throw new GitHubTransportError("invalid-response")
    }

    if (object.type !== "tag") {
      return object.sha.toLowerCase()
    }

    const tag = await request(
      `repos/${address.owner}/${address.repo}/git/tags/${object.sha.toLowerCase()}`
    )
    object =
      typeof tag === "object" && tag !== null
        ? (tag as { object?: { type?: unknown; sha?: unknown } }).object
        : undefined
  }

  throw new GitHubTransportError("invalid-response")
}
