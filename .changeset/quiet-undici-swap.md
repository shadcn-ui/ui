---
"shadcn": patch
---

Replace `node-fetch` and `https-proxy-agent` with `undici`. This removes the deprecated `node-domexception` warning pulled in via `node-fetch` → `fetch-blob`, and drops two unmaintained packages in favor of Node's built-in HTTP stack.

Expand proxy env-var support via `undici.EnvHttpProxyAgent`. The CLI now honors `HTTPS_PROXY`/`https_proxy`, `HTTP_PROXY`/`http_proxy`, and `NO_PROXY`/`no_proxy` (previously only `https_proxy` lowercase was respected).

Declares `engines.node` as `>=20.18.1` (required by `undici`). This was previously an implicit requirement — the CLI already relied on Node 18+ fetch semantics — and is now explicit.
