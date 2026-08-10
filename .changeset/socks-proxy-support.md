---
"shadcn": minor
---

Add SOCKS4/SOCKS5 proxy support to the registry HTTP stack via `ALL_PROXY=socks5://...` (the curl convention), backed by the `socks` package.

Proxy selection now goes through a `createProxyDispatcher(env)` factory that checks `ALL_PROXY` / `all_proxy` for a `socks*://` URL before falling back to the existing HTTP/HTTPS handling. `ALL_PROXY` with a non-SOCKS scheme is ignored here — `HTTP_PROXY` / `HTTPS_PROXY` remain the way to configure those. Existing `HTTPS_PROXY` / `HTTP_PROXY` / `NO_PROXY` handling via `undici.EnvHttpProxyAgent` is unchanged.
