---
"shadcn": patch
---

fix `shadcn build` failing with ENOENT when registry item names contain path segments (e.g. `extension/foo`) by creating nested output directories before writing
