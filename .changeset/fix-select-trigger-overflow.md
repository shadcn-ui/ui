---
"shadcn": patch
---

Fix select trigger overflowing with long selected values

The select trigger's value slot receives both `line-clamp-1` and `flex`, and the later `display: flex` declaration overrides `-webkit-box`, so the ellipsis clamp never engages. As a flex item, the value also has `min-width: auto`, which prevents it from shrinking below its content — long selected labels then overflow the trigger (clipped hard by `overflow: hidden`, breaking layouts). Adding `min-w-0` lets the value shrink so the existing `overflow: hidden` contains it and `line-clamp-1` applies. The combobox demo now wraps the selected label in a `truncate` span for the same effect on fixed-width triggers.
