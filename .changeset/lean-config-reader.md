---
"@shadcn/registry": patch
"shadcn": patch
---

Read `components.json` and `package.json` without cosmiconfig, whose TypeScript loader pulled an extra copy of TypeScript (about 3.6 MB) into bundles that include `@shadcn/registry`. `$import` in `components.json` and cosmiconfig meta config files (`.config/config.*`) are no longer read, and an invalid `package.json` in the working directory no longer crashes the CLI on startup.
