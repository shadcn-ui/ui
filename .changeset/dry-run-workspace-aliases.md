---
"shadcn": patch
---

Fix `add --diff`/`--dry-run` previewing wrong import aliases for cross-workspace files in a monorepo. The dry-run preview now mirrors the real `add` workspace routing, so files written into a separate UI package use that package's aliases (e.g. `#lib/utils`) instead of the app's.
