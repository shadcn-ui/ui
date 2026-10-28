---
"@shadcn/registry": minor
"shadcn": minor
---

Allow `tailwind.css` and `tailwind.config` in `components.json` to point at a file exported by a workspace package, such as `@workspace/ui/globals.css`. These resolve through the workspace package's `package.json` `exports`, the same way as aliases. An existing local file at that path always wins, and values that don't name a workspace package are treated as plain paths, so existing configs are unchanged.
