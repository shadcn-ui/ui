---
"@shadcn/react": patch
---

Fix MessageScroller jumping to the first scrollAnchor of a loaded chat when Content's children change without changing the item count, such as a non-element loading indicator unmounting or a message remounting under a new key.
