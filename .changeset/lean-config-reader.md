---
"@shadcn/registry": patch
"shadcn": patch
---

Replace cosmiconfig with a small JSON reader, removing about 3.6 MB from bundles. `$import` and cosmiconfig meta config files are no longer supported.
