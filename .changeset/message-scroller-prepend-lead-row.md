---
"@shadcn/react": patch
---

Fix MessageScroller missing a prepend when a row that is not a message (a "load earlier" control, a lead-in) stays first above the transcript: older messages loaded under it were treated as appended, so the viewport jumped to an anchor instead of keeping the reader's place.
