---
"@shadcn/registry": patch
---

Only merge a registry env file into an existing local env file when it is one of `.env`, `.env.local`, `.env.development` or `.env.development.local`. Files such as `.env.example` or `.env.production` are now created instead of being merged into `.env.local`.
