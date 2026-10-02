---
"@shadcn/registry": patch
---

Fix translucent menu glass effect not rendering in Chromium. The translucent menu classes applied `backdrop-blur` on a `::before` pseudo-element at `z-index: -1`; inside the menu content's own stacking context the pseudo-element's backdrop resolves to the menu's own background, so the blur computed but never painted. The blur and saturation now apply directly on the content element.
