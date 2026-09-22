---
"shadcn": patch
---

Fix `scroll-fade` applying a permanent fade in browsers without scroll-driven animations. The fallback now clamps to the overflow distance published by a Base UI `ScrollArea` viewport, so the fade stays scroll-aware in Firefox and resolves to none on a container that does not overflow.
