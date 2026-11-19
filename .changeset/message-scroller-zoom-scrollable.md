---
"@shadcn/react": patch
---

Fix MessageScroller stranding the scroll-to-end button (and dropping autoScroll's follow-bottom) under an ancestor CSS `zoom`. The scrollable-edge check derived the distance to the bottom from `getBoundingClientRect`, whose zoom-scaled on-screen pixels are not in the same coordinate space as the `scrollTop` and `clientHeight` they were subtracted against. At a zoom other than 1 the mismatch reported a phantom gap, so the button stayed visible at the bottom and follow-bottom never armed. The check now reads the viewport's own layout-pixel scroll metrics (`scrollHeight`, `scrollTop`, `clientHeight`), which `zoom` scales uniformly.
