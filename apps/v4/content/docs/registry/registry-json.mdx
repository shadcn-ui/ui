---
title: registry.json
description: Schema for running your own component registry.
---

The `registry.json` schema is used to define your custom component registry.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "shadcn",
  "homepage": "https://ui.shadcn.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "registryDependencies": [
        "button",
        "@acme/input-form",
        "https://example.com/r/foo"
      ],
      "dependencies": ["is-even@3.0.0", "motion"],
      "files": [
        {
          "path": "registry/default/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

You can also organize a large registry across multiple `registry.json` files
using `include`.

{/* prettier-ignore */}
```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "include": [
    "components/ui/registry.json",
    "hooks/registry.json"
  ]
}
```

Public GitHub repositories use the same source registry format. The CLI reads
the root `registry.json`, resolves `include`, and installs files from the
repository. See the [GitHub registry](/docs/registry/github) docs for more
information.

## Definitions

You can see the JSON Schema for `registry.json` [here](https://ui.shadcn.com/schema/registry.json).

### $schema

The `$schema` property is used to specify the schema for the `registry.json` file.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json"
}
```

### name

The `name` property is used to specify the name of your registry. This is used for data attributes and other metadata.

```json title="registry.json" showLineNumbers
{
  "name": "acme"
}
```

### homepage

The homepage of your registry. This is used for data attributes and other metadata.

```json title="registry.json" showLineNumbers
{
  "homepage": "https://acme.com"
}
```

### include

The `include` property is used to compose a registry from other `registry.json`
files.

{/* prettier-ignore */}
```json title="registry.json" showLineNumbers
{
  "include": [
    "components/ui/registry.json",
    "hooks/registry.json"
  ]
}
```

Each include path must be a relative path to an explicit `registry.json` file.
Folder shorthand is not supported.

{/* prettier-ignore */}
```json title="registry.json" showLineNumbers
{
  "include": [
    "components/ui/registry.json"
  ]
}
```

Included `registry.json` files may omit `name` and `homepage`. These fields are
required only on the root `registry.json`.

```json title="components/ui/registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": [
        {
          "path": "button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

When `shadcn build` resolves includes, item file paths are read relative to the
`registry.json` file that declares the item. The generated registry output is
flattened and does not contain `include`.

Registry item names must be unique across the resolved registry, including all
included files.

### items

The `items` in your registry. Each item must implement the [registry-item schema specification](https://ui.shadcn.com/schema/registry-item.json).

```json title="registry.json" showLineNumbers
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "registryDependencies": [
        "button",
        "@acme/input-form",
        "https://example.com/r/foo"
      ],
      "dependencies": ["is-even@3.0.0", "motion"],
      "files": [
        {
          "path": "registry/default/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

The root `registry.json` must define at least one of `items` or `include`. If
`items` is omitted, it defaults to an empty array.

See the [registry-item schema documentation](/docs/registry/registry-item-json) for more information.
