---
"@shadcn/registry": patch
"shadcn": patch
---

Do not forward `npm_config_allow_scripts` to `npm install` and `npm uninstall`, which npm 12 rejects with `EALLOWSCRIPTS` in project-scoped installs.
