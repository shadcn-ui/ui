---
"shadcn": patch
---

fix `apply` failing with "could not detect a supported framework" when targeting a monorepo workspace (e.g. `packages/ui`) that has a valid `components.json` but no framework config
