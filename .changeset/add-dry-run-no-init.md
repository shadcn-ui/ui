---
"shadcn": patch
---

Fix `shadcn add --dry-run`, `--diff` and `--view` running init or creating a project when `components.json` or the project is missing. They now exit with an error instead of writing files.
