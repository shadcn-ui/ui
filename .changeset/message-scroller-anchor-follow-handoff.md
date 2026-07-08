---
"@shadcn/react": patch
---

Fix MessageScroller autoScroll around anchored turns: the anchor hold now hands off to follow-output once the streamed reply fills the viewport, content growth outrunning the frame-coalesced resize handler no longer releases follow-output, and the scroll button no longer flickers while follow-output closes the gap a streamed chunk just opened.
