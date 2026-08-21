---
"@shadcn/react": patch
---

Fixed `MessageScroller` re-anchoring to a stale mount-time anchor on a same-count content swap. Mount-time anchors are now registered with the scroll-anchor handler, so a later swap (e.g. a transient "typing" row replaced by a streamed reply in one update) no longer yanks the viewport to the oldest message. Closes #11128.
