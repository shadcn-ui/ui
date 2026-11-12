---
"@shadcn/registry": minor
"shadcn": minor
---

Support Rush monorepos. When the project is inside a Rush monorepo (a `rush.json` in the project or a parent directory), dependencies are now installed with `rush add` and removed with `rush remove` instead of calling npm, pnpm or yarn directly, which Rush does not allow.
