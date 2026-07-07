---
"@shadcn/react": patch
---

Fix MessageScroller autoScroll around anchored turns: the anchor hold now hands off to follow-output once the streamed reply fills the viewport, and content growth outrunning the frame-coalesced resize handler no longer releases follow-output.
