---
"shadcn": patch
---

Extend registry proxy support beyond HTTP/HTTPS to cover the remaining proxy mechanisms users encounter:

- **SOCKS4 / SOCKS5 proxies** via `ALL_PROXY=socks5://...` (curl convention) — via the `socks` package.
- **PAC files** via `PAC_URL=http://wpad/pac.dat` with full `PROXY`/`SOCKS`/`DIRECT` directive support — via `pac-resolver` running in a QuickJS WASM sandbox.

Proxy selection now goes through a `createProxyDispatcher(env)` factory with routing priority PAC > SOCKS > HTTP. PAC scripts can return per-request directives so they take precedence; SOCKS and HTTP are per-process configurations. Existing `HTTPS_PROXY` / `HTTP_PROXY` / `NO_PROXY` handling via `undici.EnvHttpProxyAgent` is unchanged.
