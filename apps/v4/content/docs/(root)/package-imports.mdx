---
title: Package Imports
description: Configure shadcn/ui with package.json imports.
---

The `shadcn` CLI supports [package imports](https://nodejs.org/api/packages.html#imports)
for installing components, rewriting imports, and resolving third-party
registries.

Package imports let you use private `#...` import aliases from your
`package.json` instead of `compilerOptions.paths` in `tsconfig.json`.

## Example

You configure `imports` in your `package.json`:

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  }
}
```

Then import generated components using `#...` specifiers:

```tsx
import { Button } from "#components/ui/button"
import { cn } from "#lib/utils"
```

<Callout className="mt-6">
  Package import specifiers must start with `#`. Use TypeScript 5 or later with
  `moduleResolution: "bundler"` and `resolvePackageJsonImports: true`.
</Callout>

## App

For Next.js, Vite, and TanStack Start apps that install
components into the same workspace.

<Steps>

### Configure `package.json`

Add imports for the shadcn/ui install targets.

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  }
}
```

If your app does not use a `src` directory, remove `src/` from the targets. For
example:

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./components/*.tsx",
    "#lib/*": "./lib/*.ts",
    "#hooks/*": "./hooks/*.ts"
  }
}
```

### Configure TypeScript

Enable package import resolution.

```json title="tsconfig.json" showLineNumbers
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolvePackageJsonImports": true
  }
}
```

You do not need `compilerOptions.paths` for these aliases.

### Configure `components.json`

Use the same `#...` roots in `components.json`.

```json title="components.json" showLineNumbers
{
  "aliases": {
    "components": "#components",
    "ui": "#components/ui",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "#lib/utils"
  }
}
```

The `ui` alias uses `#components/ui`. It is still covered by the
`#components/*` import in `package.json`.

The `utils` alias uses `#lib/utils`. It is covered by `#lib/*`, so you do not
need a separate `#utils` import.

</Steps>

## Monorepo

In a monorepo, use package imports for files inside each package and package
exports for files shared across workspaces.

For an app workspace:

```json title="apps/web/package.json" showLineNumbers
{
  "name": "web",
  "private": true,
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  },
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

```json title="apps/web/components.json" showLineNumbers
{
  "aliases": {
    "components": "#components",
    "ui": "@workspace/ui/components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

For the shared UI package:

```json title="packages/ui/package.json" showLineNumbers
{
  "name": "@workspace/ui",
  "private": true,
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  },
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

```json title="packages/ui/components.json" showLineNumbers
{
  "aliases": {
    "components": "#components",
    "ui": "#components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "#lib/utils"
  }
}
```

When you run `add` from `apps/web`, app-local files use `#...` imports and
shared UI files are imported from `@workspace/ui`.

```tsx
import { Button } from "@workspace/ui/components/button"
import { LoginForm } from "#components/login-form"
```

## File extensions

The target pattern in `package.json#imports` controls whether generated imports
include file extensions.

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/components/*.tsx"
  }
}
```

This generates imports without extensions:

```tsx
import { Button } from "#components/ui/button"
```

If you use a target without the extension:

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/components/*"
  }
}
```

The generated import keeps the source extension:

```tsx
import { Button } from "#components/ui/button.tsx"
```

For most apps, use the extension in the target pattern.

## Troubleshooting

If TypeScript cannot resolve a `#...` import, check that:

- the specifier starts with `#`
- the `imports` entry is in the nearest `package.json`
- `moduleResolution` is set to `bundler`
- `resolvePackageJsonImports` is enabled
- the matching target exists after components are added

If a component is installed but imports still point to `@/...`, check that
`components.json` uses the same `#...` aliases as your package imports.
