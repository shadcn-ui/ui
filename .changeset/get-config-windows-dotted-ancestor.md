---
"shadcn": patch
---

fix(get-config): use path.extname for OS-aware alias resolution so Windows paths with dotted ancestors no longer truncate to the drive root

The `resolveAliasPath` helper used `/\.[^/]+$/` to strip the source extension off a wildcard-alias path, but the `[^/]` character class only excludes the forward slash. On Windows the path separator is `\`, so the regex greedily matched from the **first** dot in the absolute path to the end. For a monorepo at `C:\2.MY_APP\my-app\apps\web`, the `ui` alias resolved to `C:\2` instead of `C:\...\packages\ui\src\components`, and `shadcn add <component>` then failed with `Could not load the workspace config in C:\.`.

The fix replaces the regex with `path.extname`, which automatically dispatches to `path.win32` on Windows and `path.posix` elsewhere, so a `\`-separated path with dots in ancestor directory names is no longer treated as having a giant fake extension. The sibling `index.<ext>` check is moved to `path.basename` + `path.extname` for the same reason.

Closes #10799.
