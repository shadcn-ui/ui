---
"@shadcn/registry": minor
"shadcn": minor
---

Allow `tailwind.css` and `tailwind.config` in `components.json` to be package specifiers, such as `@workspace/ui/globals.css`. It is resolved from the directory of `components.json` through Node module resolution, honouring `package.json` `exports`. A specifier is used only when no local file exists at that path and its package is a declared dependency, so existing relative paths are unchanged. A specifier that resolves into an installed package in `node_modules` is rejected.
