---
title: API Reference
description: Programmatic API for working with registries, schemas and presets.
---

The `shadcn` package exposes a set of programmatic APIs in addition to the CLI.
You can use these to fetch and resolve registry items, validate registry JSON,
and build custom tooling on top of the registry.

Each API is available under a dedicated subpath import.

```ts
import { getRegistryItems } from "shadcn/registry"
import { registryItemSchema } from "shadcn/schema"
```

<Callout className="mt-6">
  The CLI commands themselves are not part of the public API. Only the imports
  documented below are considered stable.
</Callout>

## shadcn/registry

Fetch and resolve items from configured registries.

Most functions accept an options object. The two options below are common to all
of them. In the examples that follow, `config` refers to this optional value —
omit it to use the built-in registries.

### config

- **Type:** `Partial<Config>`
- **Default:** built-in registries only

The resolved contents of your `components.json` file. Its `registries` field
maps a namespace (e.g. `@acme`) to a URL and any authentication headers or
environment variables required to reach it.

```ts showLineNumbers
import { getRegistryItems } from "shadcn/registry"

const items = await getRegistryItems(["@acme/login-form"], {
  config: {
    registries: {
      "@acme": "https://acme.com/r/{name}.json",
    },
  },
})
```

### useCache

- **Type:** `boolean`
- **Default:** `true`

Registry responses are cached **in memory for the lifetime of the process**,
keyed by the resolved URL. Because the in-flight promise is cached, concurrent
requests for the same URL are de-duplicated into a single fetch.

Leave this enabled for one-off scripts and CLI runs. Set it to `false` in
long-running processes (servers, watchers, the MCP server) where the registry
can change between requests and you need fresh data each time.

```ts
const fresh = await getRegistry("@shadcn", { useCache: false })
```

### getRegistry

Fetch a single registry by name.

```ts showLineNumbers
import { getRegistry } from "shadcn/registry"

const registry = await getRegistry("@acme", {
  config, // optional Partial<Config>
  useCache: true,
})
```

### getRegistryItems

Fetch one or more registry items by their qualified names.

```ts showLineNumbers
import { getRegistryItems } from "shadcn/registry"

const items = await getRegistryItems(["@acme/button", "@acme/card"], {
  config,
  useCache: true,
})
```

Returns an array of registry items:

```json showLineNumbers
[
  {
    "name": "button",
    "type": "registry:ui",
    "dependencies": ["@radix-ui/react-slot"],
    "files": [
      {
        "path": "ui/button.tsx",
        "type": "registry:ui",
        "content": "..."
      }
    ]
  }
]
```

### resolveRegistryItems

Resolve multiple items together with their registry dependencies, merged into a
single tree. Unlike [`getRegistryItems`](#getregistryitems), which returns the
items as a list, this walks each item's `registryDependencies` and flattens
everything — files, dependencies, CSS variables — into one installable object.

```ts showLineNumbers
import { resolveRegistryItems } from "shadcn/registry"

const tree = await resolveRegistryItems(
  ["@acme/button", "@acme/card", "@acme/dialog"],
  { config }
)
```

Returns a single merged tree:

```json showLineNumbers
{
  "dependencies": ["@radix-ui/react-slot", "@radix-ui/react-dialog"],
  "files": [
    { "path": "ui/button.tsx", "type": "registry:ui", "content": "..." },
    { "path": "ui/card.tsx", "type": "registry:ui", "content": "..." },
    { "path": "ui/dialog.tsx", "type": "registry:ui", "content": "..." }
  ],
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "oklch(0.205 0.015 18)"
    },
    "dark": {
      "brand": "oklch(0.205 0.015 18)"
    }
  },
  "docs": ""
}
```

### getRegistries

Fetch the registry directory.

```ts showLineNumbers
import { getRegistries } from "shadcn/registry"

const registries = await getRegistries({ useCache: true })
```

Returns an array of registry entries:

```json
[
  {
    "name": "@shadcn",
    "url": "https://ui.shadcn.com/r/{name}.json",
    "homepage": "https://ui.shadcn.com"
  }
]
```

### searchRegistries

Search across one or more registries with fuzzy matching.

```ts showLineNumbers
import { searchRegistries } from "shadcn/registry"

const results = await searchRegistries(["@shadcn"], {
  query: "button",
  types: ["registry:component"],
  limit: 100,
  offset: 0,
  config,
  continueOnError: true, // skip (don't throw on) registries that fail to load
})
```

Returns matching items wrapped in pagination metadata:

```json
{
  "pagination": { "total": 1, "offset": 0, "limit": 100, "hasMore": false },
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "description": "A button component.",
      "registry": "@shadcn",
      "addCommandArgument": "@shadcn/button"
    }
  ]
}
```

### loadRegistry

Read and resolve a local `registry.json` file from disk, following any
`include` references, and return the registry catalog.

```ts showLineNumbers
import { loadRegistry } from "shadcn/registry"

const catalog = await loadRegistry({
  cwd: process.cwd(), // defaults to process.cwd()
  registryFile: "registry.json", // defaults to "registry.json"
})
```

The returned catalog lists every item but **omits file contents** — like a
built `registry.json` index.

<Callout className="mt-6" title="How is this different from getRegistry?">
  [`getRegistry`](#getregistry) fetches a **remote** registry over the network
  (by namespace, URL or GitHub address) and expects the served catalog to
  already be flattened — it rejects catalogs that still use `include`.
  `loadRegistry` reads a **local** `registry.json` from disk and resolves
  `include` references itself.
</Callout>

### loadRegistryItem

Read a single item from a local `registry.json` by name, with its file contents
read from disk and inlined.

```ts showLineNumbers
import { loadRegistryItem } from "shadcn/registry"

const item = await loadRegistryItem("login-form", { cwd: process.cwd() })
```

Returns a fully resolved registry item with file contents:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "login-form",
  "type": "registry:component",
  "files": [
    {
      "path": "registry/new-york/login-form.tsx",
      "type": "registry:component",
      "content": "..."
    }
  ]
}
```

<Callout className="mt-6" title="How is this different from getRegistryItems?">
  [`getRegistryItems`](#getregistryitems) resolves items from a **remote**
  registry over the network. `loadRegistryItem` builds a single item on demand
  from your **local** source files, reading each file from disk. Use it in a
  dynamic route that serves `registry-item.json` responses.
</Callout>

### Errors

All registry functions throw typed errors that extend `RegistryError`. Use the
`RegistryErrorCode` enum or `instanceof` checks to handle them.

```ts showLineNumbers
import { RegistryError, RegistryNotFoundError } from "shadcn/registry"

try {
  await getRegistry("@unknown")
} catch (error) {
  if (error instanceof RegistryNotFoundError) {
    // handle missing registry
  }
}
```

Available error classes:

- `RegistryError`
- `RegistryNotFoundError`
- `RegistryUnauthorizedError`
- `RegistryForbiddenError`
- `RegistryFetchError`
- `RegistryNotConfiguredError`
- `RegistryLocalFileError`
- `RegistryParseError`
- `RegistryValidationError`
- `RegistryItemNotFoundError`
- `RegistriesIndexParseError`
- `RegistryMissingEnvironmentVariablesError`
- `RegistryInvalidNamespaceError`

## shadcn/schema

The Zod schemas used to validate `registry.json`, `registry-item.json` and
`components.json`. Useful for validating registry data in your own tooling.

```ts
import { registryItemSchema, registrySchema } from "shadcn/schema"

const result = registryItemSchema.safeParse(json)
if (!result.success) {
  console.error(result.error)
}
```

Key schemas:

- `registrySchema`
- `registryItemSchema`
- `registryItemFileSchema`
- `registryItemTypeSchema`
- `registryItemCssVarsSchema`
- `registryItemTailwindSchema`
- `registryBaseColorSchema`
- `configSchema`
- `presetSchema`

Inferred types are exported alongside them:

- `Registry`
- `RegistryItem`
- `RegistryBaseItem`
- `RegistryFontItem`
- `Preset`
- `ConfigJson`

## shadcn/preset

Encode, decode and validate theme presets, plus the preset option constants used
by the theme editor.

### encodePreset

Encode a `Partial<PresetConfig>` into a short, URL-safe preset code. Any fields
you omit fall back to `DEFAULT_PRESET_CONFIG`.

```ts showLineNumbers
import { encodePreset } from "shadcn/preset"

const code = encodePreset({
  style: "vega",
  baseColor: "stone",
  theme: "blue",
  radius: "large",
  font: "geist",
})
```

Returns a version-prefixed string:

```ts showLineNumbers
"bJ4FLU0"
```

### decodePreset

Decode a preset code back into a full `PresetConfig`. Returns `null` if the code
is missing or invalid.

```ts showLineNumbers
import { decodePreset } from "shadcn/preset"

const config = decodePreset("bJ4FLU0")
```

Returns the resolved config (omitted fields are filled with their defaults):

```json
{
  "style": "vega",
  "baseColor": "stone",
  "theme": "blue",
  "chartColor": "neutral",
  "iconLibrary": "lucide",
  "font": "geist",
  "fontHeading": "inherit",
  "radius": "large",
  "menuAccent": "subtle",
  "menuColor": "default"
}
```

```ts
decodePreset("not-a-code") // null
```

### Other exports

Additional functions for validating codes and generating random presets:

- `isPresetCode`
- `isValidPreset`
- `generateRandomConfig`
- `generateRandomPreset`
- `toBase62`
- `fromBase62`

Constants:

- `PRESET_BASES`
- `PRESET_STYLES`
- `PRESET_BASE_COLORS`
- `PRESET_THEMES`
- `PRESET_ICON_LIBRARIES`
- `PRESET_FONTS`
- `PRESET_FONT_HEADINGS`
- `PRESET_RADII`
- `PRESET_MENU_ACCENTS`
- `PRESET_MENU_COLORS`
- `PRESET_CHART_COLORS`
- `DEFAULT_PRESET_CONFIG`
