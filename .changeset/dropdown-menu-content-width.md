---
"@shadcn/registry": patch
---

`DropdownMenuContent` sizes to its items again in the base, radix and aria bases instead of being fixed to the trigger's width, so an item wider than the trigger no longer wraps. Each style's `min-w-*` floor still applies; menus that should match their trigger (e.g. sidebar switchers) already set the width themselves.
