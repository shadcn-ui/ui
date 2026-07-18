---
title: FAQ
description: Frequently asked questions about running a registry.
---

## Frequently asked questions

### What does a complex component look like?

Here's an example of a complex component that installs a page, two components, a hook, a format-date utils and a config file.

```json showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [
    {
      "path": "registry/new-york/hello-world/page.tsx",
      "type": "registry:page",
      "target": "app/hello/page.tsx"
    },
    {
      "path": "registry/new-york/hello-world/components/hello-world.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/hello-world/components/formatted-message.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/hello-world/hooks/use-hello.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/new-york/hello-world/lib/format-date.ts",
      "type": "registry:lib"
    },
    {
      "path": "registry/new-york/hello-world/hello.config.ts",
      "type": "registry:file",
      "target": "~/hello.config.ts"
    }
  ]
}
```

### How do I add a new Tailwind color?

To add a new color you need to add it to `cssVars` under `light` and `dark` keys.

```json showLineNumbers {10-18}
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [
    // ...
  ],
  "cssVars": {
    "light": {
      "brand-background": "oklch(0.205 0.015 18)",
      "brand-accent": "oklch(0.205 0.015 18)"
    },
    "dark": {
      "brand-background": "oklch(0.205 0.015 18)",
      "brand-accent": "oklch(0.205 0.015 18)"
    }
  }
}
```

The CLI will update the project CSS file. Once updated, the new colors will be available to be used as utility classes: `bg-brand` and `text-brand-accent`.

### Why does `button` in `registryDependencies` not resolve to my GitHub repository?

Bare registry dependency names keep the existing shadcn behavior. `button`
means the built-in shadcn `button` item.

For a dependency from a GitHub repository, use the full GitHub item address.

```json title="registry-item.json" showLineNumbers
{
  "registryDependencies": ["acme/ui/button"]
}
```

### How do I pin a GitHub registry item?

Add `#ref` to the GitHub item address. The ref can be a branch, tag or full
commit SHA.

```bash
npx shadcn@latest add acme/ui/button#v1.2.0
```

For published registries, prefer tags or full commit SHAs.

### Can GitHub registry addresses use private repositories?

Not currently. GitHub registry addresses support public `github.com`
repositories. For private registries, use a namespace with authenticated URLs.

### How do I add or override a Tailwind theme variable?

To add or override a theme variable you add it to `cssVars.theme` under the key you want to add or override.

```json showLineNumbers {10-15}
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [
    // ...
  ],
  "cssVars": {
    "theme": {
      "text-base": "3rem",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "font-heading": "Poppins, sans-serif"
    }
  }
}
```
