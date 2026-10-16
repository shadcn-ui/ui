---
"@shadcn/react": patch
---

Keep MessageScroller at the end when the viewport is narrowed. A transcript resting at the bottom lost that position whenever something took width away from it: the rows rewrap taller, all of the added height lands above the reader, and the end walks away by however much the text grew. Nothing brought it back, because `handleResize` only re-pinned while following output, and a transcript with nothing arriving into it is not following. A width change now re-pins a reader who was already at the end. Content growing inside a viewport that kept its width is untouched, so appended messages still stay below the fold for a reader who is not following, as does a viewport that only changed height. A reader scrolled anywhere else is left where they were.
