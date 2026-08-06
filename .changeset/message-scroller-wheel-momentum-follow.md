---
"@shadcn/react": patch
---

Fix MessageScroller releasing autoScroll follow-output on gestures that cannot scroll the viewport (trailing wheel momentum at the clamped bottom, a wheel consumed by a nested scrollable), which left the transcript stranded at the bottom until the scroll button re-engaged it.
