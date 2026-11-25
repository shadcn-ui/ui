---
"@shadcn/react": patch
---

Fix MessageScroller keeping `data-autoscrolling` set after a StrictMode remount, which hid the scrollbar thumb and kept `autoScroll` following the bottom after a scrollbar drag.
