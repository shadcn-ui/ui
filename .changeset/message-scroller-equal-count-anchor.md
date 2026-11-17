---
"@shadcn/react": patch
---

Fix MessageScroller jumping to the first scrollAnchor of a loaded chat when Content's children change without adding items, such as a non-element loading indicator unmounting or a non-anchor message remounting under a new key, and anchor a new scrollAnchor row added in a change that removes more children than it adds.
