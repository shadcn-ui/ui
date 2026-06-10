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

export function fetchWithProxy(url: string | URL, init?: RequestInit) {
  // The `dispatcher` option is supported by Node's fetch at runtime but
  // missing from the ambient RequestInit type, hence the cast.
  return fetch(url, {
    ...init,
    dispatcher: proxyDispatcher,
  } as RequestInit)
}
