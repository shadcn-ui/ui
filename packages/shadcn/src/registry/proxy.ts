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

export async function fetchWithProxy(url: string | URL, init?: RequestInit) {
  try {
    // The `dispatcher` option is supported by Node's fetch at runtime but
    // missing from the ambient RequestInit type, hence the cast.
    return await fetch(url, {
      ...init,
      dispatcher: proxyDispatcher,
    } as RequestInit)
  } catch (error) {
    // Native fetch reports network failures as a generic "fetch failed"
    // TypeError with the actual reason buried in `cause`.
    if (error instanceof TypeError && error.cause) {
      throw new Error(
        `Request to ${url} failed, reason: ${getFailureReason(error.cause)}`,
        { cause: error.cause }
      )
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
      cause.message ||
      (cause as NodeJS.ErrnoException).code ||
      "unknown error"
    )
  }

  return String(cause)
}
