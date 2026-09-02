---
"@shadcn/react": minor
---

Add `releaseAutoScroll()` to `useMessageScroller()`. It releases `autoScroll`'s follow-bottom (and any turn anchoring) exactly as a wheel/touch/keyboard scroll does, so consumers can hand scroll control back to the reader before growing content in response to a user action — expanding a collapsed section, a "show more" toggle. Without it, `autoScroll` treats that growth as new output and re-pins the viewport to the end, scrolling the just-expanded content out of view. It is a no-op when nothing is being followed.
