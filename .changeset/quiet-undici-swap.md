---
"shadcn": patch
---

Replace `node-fetch` and `https-proxy-agent` with `undici`. This removes the deprecated `node-domexception` warning pulled in via `node-fetch` → `fetch-blob`, and drops two unmaintained packages in favor of Node's built-in HTTP stack.

Declares `engines.node` as `>=20.18.1` (required by `undici`). This was previously an implicit requirement — the CLI already relied on Node 18+ fetch semantics — and is now explicit.
