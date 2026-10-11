# @shadcn/registry

Fetch, resolve, search and install [shadcn registry](https://ui.shadcn.com/docs/registry) items.

This is the registry client behind the [`shadcn`](https://www.npmjs.com/package/shadcn) CLI. Use it to build your own CLI, agent or registry server.

## Installation

```bash
npm install @shadcn/registry
```

ESM only. Requires Node.js 20.18.1 or later.

## API

| Export                                                  | Description                                                                   |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`getRegistryItems`](#fetch-items)                      | Fetch items, without their dependencies.                                      |
| [`resolveRegistryItems`](#resolve-dependencies)         | Fetch items and their dependencies, merged into one tree.                     |
| [`searchRegistries`](#search)                           | Search one or more registries.                                                |
| [`addRegistryItems`](#install-items)                    | Install items into a project.                                                 |
| [`loadRegistry`, `loadRegistryItem`](#serve-a-registry) | Read a local `registry.json` and its items.                                   |
| [`getRegistry`](#discover-registries)                   | Fetch a registry's catalog.                                                   |
| [`getRegistries`](#discover-registries)                 | List the registries in the [directory](https://ui.shadcn.com/docs/directory). |
| [`getRegistriesConfig`](#configure-registries)          | Read a project's registries from `components.json` and `package.json`.        |
| [`RegistryError`, `RegistryErrorCode`](#errors)         | The errors the API throws.                                                    |
| [Schemas](#schemas)                                     | Zod schemas, from `@shadcn/registry/schema`.                                  |

## Fetch items

```ts
import { getRegistryItems } from "@shadcn/registry"

const [button] = await getRegistryItems(["@shadcn/button"])
```

An item can be addressed by:

- a namespace: `@shadcn/button`. A bare name like `button` means `@shadcn/button`.
- a URL: `https://acme.com/r/login-form.json`
- a local file: `./registry/login-form.json`
- a GitHub repository with a `registry.json` at its root: `acme/registry/login-form`, or `acme/registry/login-form#v1` for a branch, tag or full commit SHA

Pass `useCache: true` to cache responses in memory.

## Configure registries

`@shadcn` is built in. Add other registries with `config.registries`. `{name}` is replaced with the item name, and `${VAR}` with an environment variable.

```ts
const items = await getRegistryItems(["@acme/login-form"], {
  config: {
    registries: {
      "@acme": "https://acme.com/r/{name}.json",
      "@private": {
        url: "https://private.acme.com/r/{name}.json",
        headers: {
          Authorization: "Bearer ${ACME_TOKEN}",
        },
      },
    },
  },
})
```

To use a project's registries from `components.json` and `package.json`:

```ts
import { getRegistriesConfig, getRegistryItems } from "@shadcn/registry"

const config = await getRegistriesConfig(process.cwd())
const items = await getRegistryItems(["@acme/login-form"], { config })
```

## Discover registries

```ts
import { getRegistries, getRegistry } from "@shadcn/registry"

const registries = await getRegistries()

const { name, url } = registries[0]
const catalog = await getRegistry(name, {
  config: { registries: { [name]: url } },
})
```

## Resolve dependencies

```ts
import { resolveRegistryItems } from "@shadcn/registry"

const tree = await resolveRegistryItems(["@shadcn/login-01"])

tree?.files // every file to write
tree?.dependencies // npm dependencies
tree?.cssVars // merged CSS variables
```

## Search

```ts
import { searchRegistries } from "@shadcn/registry"

const { items, pagination } = await searchRegistries(["@shadcn"], {
  query: "button",
  limit: 10,
})
```

With `continueOnError: true`, registries that fail are reported in `errors` instead of throwing.

## Install items

```ts
import { addRegistryItems } from "@shadcn/registry"

await addRegistryItems(["@acme/agent-config"], {
  cwd: process.cwd(),
  config: {
    registries: {
      "@acme": "https://acme.com/r/{name}.json",
    },
  },
})
```

`addRegistryItems` installs universal items: `registry:item` and `registry:file` items whose files are all `registry:file` or `registry:item` with a `target`. Their dependencies must be universal too.

It writes the files, adds `envVars` to the project's env file and installs npm dependencies. It never prompts: existing files are skipped unless you pass `overwrite: true`. Pass `silent: true` to hide its output.

To add components to a project with a `components.json`, use the [`shadcn`](https://ui.shadcn.com/docs/cli) CLI.

## Serve a registry

`loadRegistry` reads a local `registry.json`, including its `include` entries, and returns the catalog without file contents. `loadRegistryItem` returns one item with its file contents.

```ts
import { loadRegistry, loadRegistryItem } from "@shadcn/registry"

const registry = await loadRegistry()
const item = await loadRegistryItem("login-form")
```

Both read from the current directory. Pass `cwd` or `registryFile` to change that.

## Schemas

```ts
import { registryItemSchema } from "@shadcn/registry/schema"

const item = registryItemSchema.parse(json)
```

The schemas use [zod](https://zod.dev) v3. `registrySchema` validates `registry.json`, `registryItemSchema` an item and `rawConfigSchema` `components.json`.

## Errors

```ts
import {
  getRegistryItems,
  RegistryError,
  RegistryErrorCode,
} from "@shadcn/registry"

try {
  await getRegistryItems(["@shadcn/not-a-component"])
} catch (error) {
  if (
    error instanceof RegistryError &&
    error.code === RegistryErrorCode.NOT_FOUND
  ) {
    // The item does not exist.
  }
}
```

Each `RegistryError` has a `code`, a `message` and, when there is a fix, a `suggestion`.

| Code                        | Thrown when                                                |
| --------------------------- | ---------------------------------------------------------- |
| `NOT_FOUND`                 | The item or registry does not exist.                       |
| `GONE`                      | The item was removed.                                      |
| `UNAUTHORIZED`, `FORBIDDEN` | The registry rejected the request.                         |
| `FETCH_ERROR`               | Any other failed request.                                  |
| `NOT_CONFIGURED`            | A namespace is not in `config.registries`.                 |
| `MISSING_ENV_VARS`          | A `${VAR}` used by a registry is not set.                  |
| `PARSE_ERROR`               | A response or `registry.json` is not valid.                |
| `VALIDATION_ERROR`          | A `registry.json`, registry name or GitHub ref is invalid. |
| `LOCAL_FILE_ERROR`          | A local file cannot be read.                               |
| `INVALID_CONFIG`            | The registries config is invalid.                          |

Network failures and items that are not universal throw a plain `Error`.

## Environment variables

| Variable                                | Description                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `REGISTRY_URL`                          | Base URL of the `@shadcn` registry. Defaults to `https://ui.shadcn.com/r`. |
| `HTTPS_PROXY`, `HTTP_PROXY`, `NO_PROXY` | Send requests through a proxy.                                             |
| `ALL_PROXY`                             | Send requests through a SOCKS proxy, such as `socks5://`.                  |
| `GH_TOKEN`, `GITHUB_TOKEN`              | A token for private GitHub registries. Falls back to the `gh` CLI.         |

`REGISTRY_URL` and the proxy variables are read when the package is imported.

## Entry points

| Entry                         | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| `@shadcn/registry`            | Fetch, resolve, search and install items.                                 |
| `@shadcn/registry/schema`     | Zod schemas for registries, items and `components.json`.                  |
| `@shadcn/registry/internal/*` | Used by the `shadcn` CLI. Not a public API: it can change in any release. |

`shadcn/registry` and `shadcn/schema` re-export this package.

## Status

Before 1.0, minor versions may include breaking changes.

## Documentation

Visit https://ui.shadcn.com/docs/registry to view the registry documentation.

## Contributing

Please read the [contributing guide](https://github.com/shadcn-ui/ui/blob/main/CONTRIBUTING.md).

## License

Licensed under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).
