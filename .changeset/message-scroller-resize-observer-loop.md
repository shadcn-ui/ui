---
"@shadcn/react": patch
---

Fix MessageScroller firing "ResizeObserver loop completed with undelivered notifications" during streamed content growth by coalescing ResizeObserver callbacks into requestAnimationFrame.
