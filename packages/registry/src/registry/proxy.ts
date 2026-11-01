import { SocksClient, type SocksProxy } from "socks"
import { Agent, Dispatcher, EnvHttpProxyAgent } from "undici"

const HTTP_PROXY_ENV_VARS = [
  "HTTPS_PROXY",
  "https_proxy",
  "HTTP_PROXY",
  "http_proxy",
] as const

const ALL_PROXY_ENV_VARS = ["ALL_PROXY", "all_proxy"] as const

const SOCKS_VERSION_BY_SCHEME: Record<string, SocksProxy["type"]> = {
  "socks:": 5,
  "socks4:": 4,
  "socks4a:": 4,
  "socks5:": 5,
  "socks5h:": 5,
}

function parseSocksUrl(value: string): SocksProxy | undefined {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return undefined
  }
  const type = SOCKS_VERSION_BY_SCHEME[url.protocol]
  if (!type) return undefined
  const port = Number(url.port) || 1080
  return {
    host: url.hostname,
    port,
    type,
    ...(url.username
      ? { userId: decodeURIComponent(url.username) }
      : undefined),
    ...(url.password
      ? { password: decodeURIComponent(url.password) }
      : undefined),
  }
}

function createSocksAgent(proxy: SocksProxy): Agent {
  return new Agent({
    connect: (opts, callback) => {
      SocksClient.createConnection({
        proxy,
        command: "connect",
        destination: {
          host: opts.hostname ?? "",
          port: Number(opts.port),
        },
      })
        .then(({ socket }) => callback(null, socket))
        .catch((err: Error) => callback(err, null))
    },
  })
}

export function createProxyDispatcher(
  env: NodeJS.ProcessEnv = process.env
): Dispatcher | undefined {
  // SOCKS via ALL_PROXY (curl convention). Only triggers for socks* schemes;
  // other schemes (http/https) are unhandled here — users configure those via
  // HTTP_PROXY / HTTPS_PROXY explicitly.
  for (const name of ALL_PROXY_ENV_VARS) {
    const value = env[name]
    if (!value) continue
    const socks = parseSocksUrl(value)
    if (socks) return createSocksAgent(socks)
  }

  // HTTP/HTTPS proxy. EnvHttpProxyAgent honors http_proxy, https_proxy and
  // no_proxy (upper and lowercase).
  const hasHttpProxy = HTTP_PROXY_ENV_VARS.some((name) => env[name])
  return hasHttpProxy ? new EnvHttpProxyAgent() : undefined
}

// Native fetch ignores the http.Agent-based `agent` option, so proxy support
// goes through an undici dispatcher instead.
const proxyDispatcher = createProxyDispatcher()

// Standard fetch strips Authorization/Cookie/Proxy-Authorization on
// cross-origin redirects, but preserves custom-named headers. Since private
// registries can carry secrets in arbitrary header names (e.g. X-API-Key), we
// follow redirects manually and only re-attach the caller's headers when the
// next hop stays on the original origin. Accept/User-Agent are not secrets and
// are kept across origins.
const MAX_REDIRECTS = 5
const SAFE_HEADER_NAMES = new Set(["accept", "user-agent"])

export async function fetchWithProxy(url: string | URL, init?: RequestInit) {
  const originalOrigin = new URL(url).origin
  const originalHeaders = new Headers(init?.headers)
  let currentUrl = new URL(url).toString()
  let headers = originalHeaders

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const response = await fetchOnce(currentUrl, init, headers)

    const isRedirect =
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.has("location")

    if (!isRedirect) {
      return response
    }

    const location = response.headers.get("location")!
    const nextUrl = new URL(location, currentUrl)

    if (nextUrl.origin !== originalOrigin) {
      // Cross-origin hop: drop every caller-supplied header except the
      // non-sensitive Accept/User-Agent.
      const stripped = new Headers()
      originalHeaders.forEach((value, key) => {
        if (SAFE_HEADER_NAMES.has(key.toLowerCase())) {
          stripped.set(key, value)
        }
      })
      headers = stripped
    } else {
      headers = originalHeaders
    }

    currentUrl = nextUrl.toString()
  }

  throw new Error(`Too many redirects while fetching ${url}`)
}

async function fetchOnce(
  url: string,
  init: RequestInit | undefined,
  headers: Headers
) {
  try {
    // The `dispatcher` option is supported by Node's fetch at runtime but
    // missing from the ambient RequestInit type, hence the cast. Redirects are
    // followed manually (see fetchWithProxy) so headers can be re-scoped per
    // hop, hence `redirect: "manual"`.
    //
    // This must stay the global `fetch` binding: MSW's Node adapter patches
    // `globalThis.fetch`, so importing `fetch` from undici here would bypass
    // MSW's interceptor and break the registry tests.
    return await fetch(url, {
      ...init,
      headers,
      redirect: "manual",
      dispatcher: proxyDispatcher,
    } as RequestInit)
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
