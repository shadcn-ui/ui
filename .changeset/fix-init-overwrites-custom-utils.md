---
"shadcn": patch
---

Fix `init` replacing an existing custom `lib/utils.ts`

`shadcn init` always passes `overwrite: true`, so the registry's boilerplate `lib/utils.ts` silently replaced a user's customized `utils.ts` (losing any helpers they had added). The registry copies are boilerplate, but users are encouraged to customize this file. Existing `lib/utils.ts` files are now always skipped during init/add instead of being overwritten (this protection previously only applied to Laravel projects).
