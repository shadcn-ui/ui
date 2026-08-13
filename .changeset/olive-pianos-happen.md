---
"shadcn": patch
---

resolve registries declared in package.json when adding components. `shadcn add`, `search`, `view` and `init` now resolve registries from package.json in memory without persisting them to components.json
