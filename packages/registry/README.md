# @shadcn/registry

Fetch, resolve and install [shadcn registry](https://ui.shadcn.com/docs/registry) items.

This is the registry engine behind the [`shadcn`](https://www.npmjs.com/package/shadcn) CLI. `shadcn/registry` and `shadcn/schema` re-export this package, so existing imports keep working.

```bash
npm install @shadcn/registry
```

```ts
import { getRegistryItems, searchRegistries } from "@shadcn/registry"
import { registryItemSchema } from "@shadcn/registry/schema"
```

See the [registry API reference](https://ui.shadcn.com/docs/registry/api-reference) for the available functions.

## Status

Before 1.0, minor versions may change the API. The package will narrow to the registry itself (the spec, validation, fetching, resolving and installing items) and leave consumer logic, such as code transforms, CSS updates and `components.json`, to consumers like `shadcn`.

## Entry points

| Entry                         | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `@shadcn/registry`            | Registry API: fetch, resolve, search and install items.                                    |
| `@shadcn/registry/schema`     | Zod schemas for registries, items and `components.json`.                                   |
| `@shadcn/registry/internal/*` | Internal modules used by the `shadcn` CLI. Not a public API: it can change in any release. |
