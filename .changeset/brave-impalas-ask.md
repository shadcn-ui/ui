---
"@shadcn/react": patch
---

Set `data-pending-scroll` on the MessageScroller root and viewport until `defaultScrollPosition` (`"end"` or `"last-anchor"`) is applied, so the viewport can be hidden and a server-rendered transcript does not flash the top of the thread on reload.
