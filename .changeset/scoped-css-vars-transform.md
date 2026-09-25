---
"shadcn": patch
---

Only remap colors in class name literals when `tailwind.cssVariables` is `false`. The transform walked every string literal in a file, so unrelated strings were rewritten on install (`parts.join(" ")` became `parts.join("")`).
