import { EnvHttpProxyAgent } from "undici"

// Native fetch ignores the http.Agent-based `agent` option, so proxy support
// goes through an undici dispatcher instead. EnvHttpProxyAgent honors
// http_proxy, https_proxy and no_proxy (upper and lowercase).
const proxyDispatcher =
  process.env.https_proxy ||
  process.env.HTTPS_PROXY ||
  process.env.http_proxy ||
  process.env.HTTP_PROXY
    ? new EnvHttpProxyAgent()
    : undefined

// Headers that must not leak to a different origin across a redirect. Native
// fetch/undici strips these on every cross-origin hop, which breaks
// authenticated registries that redirect between the apex and `www` host. We
// follow redirects manually so we can re-attach them when the redirect stays on
// the same registrable domain, matching the previous node-fetch behavior.
const SENSITIVE_HEADERS = [
  "authorization",
  "cookie",
  "cookie2",
  "www-authenticate",
]

// Matches the redirect cap used by browsers and undici.
const MAX_REDIRECTS = 20

const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308])

export async function fetchWithProxy(url: string | URL, init?: RequestInit) {
  try {
    return await fetchFollowingRedirects(url, init)
  } catch (error) {
    // Native fetch reports network failures as a generic "fetch failed"
    // TypeError with the actual reason buried in `cause`. The casts are
    // needed because the configured TS lib predates Error.cause.
    const cause =
      error instanceof TypeError
        ? (error as TypeError & { cause?: unknown }).cause
        : undefined

    if (cause) {
      const enriched = new Error(
        `Request to ${url} failed, reason: ${getFailureReason(cause)}`
      ) as Error & { cause?: unknown }
      enriched.cause = cause
      throw enriched
    }

    throw error
  }
}

// Follows redirects manually (with `redirect: "manual"`) so that per-registry
// headers such as Authorization survive redirects that only change the host to
// a same-domain target (e.g. apex -> www). Native fetch would silently drop
// them on any cross-origin hop.
async function fetchFollowingRedirects(url: string | URL, init?: RequestInit) {
  let currentUrl = new URL(typeof url === "string" ? url : url.toString())
  let method = (init?.method ?? "GET").toUpperCase()
  let body = init?.body
  const headers = new Headers(init?.headers)

  for (let redirectCount = 0; ; redirectCount++) {
    // The `dispatcher` option is supported by Node's fetch at runtime but
    // missing from the ambient RequestInit type, hence the cast.
    const response = await fetch(currentUrl, {
      ...init,
      method,
      body,
      headers,
      redirect: "manual",
      dispatcher: proxyDispatcher,
    } as RequestInit)

    const location = response.headers.get("location")
    if (!REDIRECT_STATUS_CODES.has(response.status) || !location) {
      return response
    }

    if (redirectCount >= MAX_REDIRECTS) {
      throw new TypeError(
        `Reached the maximum number of redirects (${MAX_REDIRECTS}) while requesting ${currentUrl.href}`
      )
    }

    const nextUrl = new URL(location, currentUrl)

    // Drop sensitive headers when the redirect leaves the original registrable
    // domain (or downgrades the protocol), but keep them for same-site hops.
    if (!isSameSite(currentUrl, nextUrl)) {
      for (const name of SENSITIVE_HEADERS) {
        headers.delete(name)
      }
    }

    // Per the fetch redirect semantics, 303 (and 301/302 on POST) become a
    // bodyless GET.
    if (
      response.status === 303 ||
      ((response.status === 301 || response.status === 302) &&
        method === "POST")
    ) {
      method = "GET"
      body = undefined
      headers.delete("content-length")
      headers.delete("content-type")
    }

    currentUrl = nextUrl
  }
}

// A redirect is "same-site" when it keeps the same protocol and the target host
// is the same domain or a sub/parent-domain of the original (e.g. apex <-> www).
// This mirrors node-fetch's rule for preserving sensitive headers.
function isSameSite(original: URL, destination: URL): boolean {
  if (original.protocol !== destination.protocol) {
    return false
  }

  const orig = original.hostname
  const dest = destination.hostname

  return orig === dest || orig.endsWith(`.${dest}`) || dest.endsWith(`.${orig}`)
}

function getFailureReason(cause: unknown): string {
  // Connection failures surface as an AggregateError with an empty message
  // and the per-address errors (e.g. ECONNREFUSED) in `errors`.
  if (cause instanceof Error && "errors" in cause) {
    const errors = (cause as Error & { errors: unknown }).errors
    if (Array.isArray(errors) && errors.length) {
      return getFailureReason(errors[0])
    }
  }

  if (cause instanceof Error) {
    return (
      cause.message || (cause as NodeJS.ErrnoException).code || "unknown error"
    )
  }

  return String(cause)
}
