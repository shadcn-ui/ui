import { getGitHubAuthNoticeFromContext } from "@/src/registry/context"
import { getEnvGitHubToken, type GitHubAuthMode } from "@/src/registry/github-cli"
import type { GitHubSource } from "@/src/registry/github-ref"
import { logAboveSpinner } from "@/src/utils/spinner"
import { gray, green } from "kleur/colors"

export type GitHubSourceAuthState = {
  // Single-flight mode selection shared by ref resolution and content reads.
  decision?: Promise<GitHubAuthMode>
  // Set once the anonymous root registry.json succeeded. A locked source
  // never sends credentials, so a missing child file stays anonymous.
  anonymousLock: boolean
  // The pre-auth failure, preserved so an authenticated 404 keeps GitHub's
  // private-versus-missing ambiguity.
  originalError?: unknown
}

// Auth state is anchored on the command-local sourceCache object, which the
// resolver already creates once and threads through concurrent item fetches
// and recursive dependency resolution.
const coordinators = new WeakMap<object, Map<string, GitHubSourceAuthState>>()

// A command can make several top-level registry calls (preflight, catalog,
// tree resolution), each with its own sourceCache. The notice dedupes
// process-wide per credential mode so it prints once, not once per phase.
const notifiedSources = new Set<string>()

export function resetGitHubAuthNotices() {
  notifiedSources.clear()
}

export function getGitHubAuthState(anchor: object, source: GitHubSource) {
  let sources = coordinators.get(anchor)
  if (!sources) {
    sources = new Map()
    coordinators.set(anchor, sources)
  }

  const key = normalizeGitHubSourceKey(source)
  let state = sources.get(key)
  if (!state) {
    state = { anonymousLock: false }
    sources.set(key, state)
  }

  return state
}

export function selectGitHubAuthMode(
  state: GitHubSourceAuthState,
  source: GitHubSource,
  originalError: unknown
) {
  if (!state.decision) {
    state.originalError = originalError
    state.decision = decideAndNotify().catch((error) => {
      state.decision = undefined
      throw error
    })
  }

  return state.decision
}

async function decideAndNotify() {
  const mode: GitHubAuthMode = getEnvGitHubToken() ? "token" : "gh"

  if (notifiedSources.has(mode)) {
    return mode
  }

  // The notice is awaited so it lands before the first authenticated request.
  const notice = `Using ${mode === "token" ? "GH_TOKEN" : "gh"} credentials.`
  const onNotice = getGitHubAuthNoticeFromContext()
  if (onNotice) {
    await onNotice(notice)
  } else {
    // Match ora's persisted-line style so the notice aligns with the
    // surrounding spinner output.
    logAboveSpinner(`${green("✔")} ${gray(notice)}`)
  }
  notifiedSources.add(mode)

  return mode
}

function normalizeGitHubSourceKey(source: GitHubSource) {
  return `${source.owner.toLowerCase()}/${source.repo.toLowerCase()}#${
    source.ref ?? "HEAD"
  }`
}
