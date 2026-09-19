---
"shadcn": patch
---

fix import rewriting on Windows: `resolveModuleByProbablePath` compared backslash-separated paths against a POSIX-normalized file set, so modules resolved through a directory index (`components/button/index.tsx`) never matched and their imports were left un-rewritten
