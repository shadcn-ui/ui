---
"shadcn": patch
---

Replace `node-fetch` and `https-proxy-agent` with `undici`. This removes the deprecated `node-domexception` warning pulled in via `node-fetch` → `fetch-blob`, and drops two unmaintained packages in favor of Node's built-in HTTP stack.

Expand proxy support to cover the standard proxy mechanisms users encounter:

- **HTTP/HTTPS proxies** via `HTTPS_PROXY` / `HTTP_PROXY` (uppercase and lowercase) with `NO_PROXY` bypass — via `undici.EnvHttpProxyAgent`. Previously only `https_proxy` (lowercase) was respected.
- **SOCKS4 / SOCKS5 proxies** via `ALL_PROXY=socks5://...` (curl convention) — via the `socks` package.
- **PAC files** via `PAC_URL=http://wpad/pac.dat` with full `PROXY`/`SOCKS`/`DIRECT` directive support — via `pac-resolver` running in a QuickJS WASM sandbox.

Routing priority is PAC > SOCKS > HTTP. PAC scripts can return per-request directives so they take precedence; SOCKS and HTTP are per-process configurations.

Declares `engines.node` as `>=20.18.1` (required by `undici`). This was previously an implicit requirement — the CLI already relied on Node 18+ fetch semantics — and is now explicit.
