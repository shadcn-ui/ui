---
"shadcn": patch
---

Normalize path separators when resolving aliases on Windows. `tsconfig-paths` returns the matched portion of an alias with posix separators, so resolved paths were a mix of both (`C:\app\src/components`). This broke three comparisons in `get-config`: the guard that rejects an unresolvable `#` alias never fired, `findPackageRoot` never matched a workspace package against `fast-glob`'s posix output, and `findCommonRoot` split on the wrong segments. Together these made `init` and `add` silently write components into the wrong workspace, or create a directory named after the alias itself.
