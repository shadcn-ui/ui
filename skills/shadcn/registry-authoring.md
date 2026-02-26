# Registry Authoring

Build and publish your own shadcn/ui-compatible component registry. Registries let you distribute reusable components, blocks, hooks, and utilities that others can install with a single command.

---

## Overview

A registry is a collection of items (components, blocks, hooks, etc.) described in a `registry.json` file. The `shadcn build` command compiles this into individual JSON files that can be hosted on any static file server.

```
my-registry/
├── registry.json          # registry definition
├── registry/
│   ├── my-button.tsx      # component source files
│   ├── my-card.tsx
│   └── hooks/
│       └── use-something.ts
└── public/r/              # built output (created by shadcn build)
    ├── my-button.json
    ├── my-card.json
    └── use-something.json
```

---

## registry.json Format

The schema is available at `https://ui.shadcn.com/schema/registry.json`.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-registry",
  "homepage": "https://my-registry.dev",
  "items": [
    {
      "name": "my-button",
      "type": "registry:ui",
      "title": "My Button",
      "description": "A custom button with extra features.",
      "dependencies": ["class-variance-authority"],
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "registry/my-button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | Registry name (used in the registry index) |
| `homepage` | URL to the registry's homepage |
| `items` | Array of registry items |

### Item Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique item name within the registry |
| `type` | Yes | Item type (see types below) |
| `title` | No | Human-readable display title |
| `description` | No | Brief description of the item |
| `author` | No | Author info (e.g., `"username <https://github.com/username>"`) |
| `dependencies` | No | NPM packages to install |
| `devDependencies` | No | NPM dev dependencies to install |
| `registryDependencies` | No | Other registry items this depends on |
| `files` | No | Array of source files |
| `cssVars` | No | CSS variables to inject (light, dark, theme) |
| `css` | No | Raw CSS rules to inject |
| `tailwind` | No | Tailwind config extensions |
| `envVars` | No | Environment variables (added to `.env`) |
| `docs` | No | Markdown documentation |
| `categories` | No | Array of category strings |
| `meta` | No | Arbitrary metadata object |

---

## Item Types

| Type | Purpose | Target Path |
|------|---------|-------------|
| `registry:ui` | UI primitives (button, card, etc.) | `components/ui/` |
| `registry:component` | Reusable composed components | `components/` |
| `registry:block` | Multi-file page blocks (login, dashboard) | `components/` |
| `registry:hook` | React hooks | `hooks/` |
| `registry:lib` | Utility functions | `lib/` |
| `registry:page` | Full pages (requires `target`) | Custom path |
| `registry:file` | Static files (requires `target`) | Custom path |
| `registry:theme` | Theme definitions | — |
| `registry:style` | Global style definitions | — |
| `registry:item` | Generic item | `components/` |

**Note:** `registry:page` and `registry:file` require a `target` field on each file to specify the output path.

---

## File Objects

Files can be specified in two ways:

```json
{
  "files": [
    {
      "path": "registry/my-component.tsx",
      "type": "registry:ui"
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `path` | Yes | Path relative to the registry root |
| `type` | Yes | File type (same enum as item types) |
| `target` | Conditional | Output path in the project (required for `registry:file` and `registry:page`) |
| `content` | No | Inline file content (auto-read from `path` if not provided) |

---

## Dependencies

### NPM Dependencies

```json
{
  "dependencies": ["framer-motion", "class-variance-authority"],
  "devDependencies": ["@types/some-package"]
}
```

These are installed via the user's package manager when they `shadcn add` the item.

### Registry Dependencies

```json
{
  "registryDependencies": ["button", "card", "https://other-registry.com/r/item.json"]
}
```

- **Plain names** (e.g., `"button"`) reference items from the `@shadcn` registry.
- **URLs** reference items from other registries.
- Registry dependencies are automatically resolved and installed.

---

## CSS Variables

Inject CSS variables into the user's project:

```json
{
  "cssVars": {
    "light": {
      "chart-custom": "oklch(0.646 0.222 41.116)"
    },
    "dark": {
      "chart-custom": "oklch(0.268 0.08 34.298)"
    },
    "theme": {
      "--color-chart-custom": "var(--chart-custom)"
    }
  }
}
```

- `light` — Variables added to `:root`.
- `dark` — Variables added to `.dark`.
- `theme` — Variables added to `@theme inline` (Tailwind v4 only).

---

## CSS Rules

Inject raw CSS into the project:

```json
{
  "css": {
    "@keyframes shimmer": {
      "from": { "background-position": "200% 0" },
      "to": { "background-position": "-200% 0" }
    },
    ".animate-shimmer": {
      "animation": "shimmer 8s ease-in-out infinite",
      "background-size": "200% 100%"
    }
  }
}
```

Supports at-rules, selectors, nested rules, utilities, and layers.

---

## Environment Variables

```json
{
  "envVars": {
    "DATABASE_URL": "The connection string for your database.",
    "API_KEY": "Your API key from the dashboard."
  }
}
```

These are added to the user's `.env` file with placeholder values.

---

## Building the Registry

```bash
shadcn build
```

This reads `registry.json` and outputs individual JSON files to `public/r/`:

```bash
# Custom input/output paths.
shadcn build ./path/to/registry.json --output ./public/r
```

Each item becomes a standalone JSON file (e.g., `public/r/my-button.json`) containing the resolved item with file contents inlined.

---

## Hosting

Host the built `public/r/` directory on any static file server. The URL pattern must include a `{name}` placeholder:

```
https://my-registry.dev/r/{name}.json
```

**Hosting options:**

- **Vercel/Netlify** — Deploy the project, files are served from `public/r/`.
- **GitHub Pages** — Push `public/r/` to a gh-pages branch.
- **Any CDN** — Upload the JSON files.

---

## Configuration for Users

Users add your registry to their `components.json`:

### Simple format

```json
{
  "registries": {
    "@myregistry": "https://my-registry.dev/r/{name}.json"
  }
}
```

### With authentication

```json
{
  "registries": {
    "@myregistry": {
      "url": "https://my-registry.dev/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${MY_REGISTRY_TOKEN}"
      }
    }
  }
}
```

Environment variable references (`${VAR}`) are resolved at runtime.

### Installing items

```bash
shadcn add @myregistry/my-button
shadcn search @myregistry -q "button"
```

---

## Community Registry Index

To list your registry in the public directory at `https://ui.shadcn.com/r/registries.json`, submit it through the shadcn/ui repository.

Each entry in the index looks like:

```json
{
  "name": "@myregistry",
  "homepage": "https://my-registry.dev",
  "url": "https://my-registry.dev/r/{name}.json",
  "description": "A collection of custom components."
}
```

---

## Example: Minimal Registry

**registry.json:**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme-ui",
  "homepage": "https://acme-ui.dev",
  "items": [
    {
      "name": "status-badge",
      "type": "registry:ui",
      "title": "Status Badge",
      "description": "A badge that shows status with color coding.",
      "registryDependencies": ["badge"],
      "files": [
        {
          "path": "registry/status-badge.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "use-copy-to-clipboard",
      "type": "registry:hook",
      "title": "useCopyToClipboard",
      "description": "A hook to copy text to the clipboard.",
      "files": [
        {
          "path": "registry/hooks/use-copy-to-clipboard.ts",
          "type": "registry:hook"
        }
      ]
    }
  ]
}
```

**Build and host:**

```bash
shadcn build
# Outputs: public/r/status-badge.json, public/r/use-copy-to-clipboard.json
```

**Users install with:**

```bash
shadcn add @acme-ui/status-badge
```

---

## Example: Block with Multiple Files

Blocks are multi-file items like dashboards or login forms:

```json
{
  "name": "login-form",
  "type": "registry:block",
  "title": "Login Form",
  "description": "A complete login form with email and password fields.",
  "registryDependencies": ["button", "input", "label", "card"],
  "files": [
    {
      "path": "registry/login-form/page.tsx",
      "type": "registry:page",
      "target": "app/login/page.tsx"
    },
    {
      "path": "registry/login-form/login-form.tsx",
      "type": "registry:component"
    }
  ]
}
```
