---
"shadcn": patch
---

Send `Accept: application/vnd.shadcn.v1+json, application/json;q=0.9` and `User-Agent: shadcn` on registry fetches so servers using HTTP content negotiation can reliably serve JSON to the CLI. Fixes #10164.
