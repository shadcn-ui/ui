---
title: shadcn
description: Use the shadcn CLI to add components to your project.
---

## init

Use the `init` command to initialize configuration and dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util and configures CSS variables for the project.

```bash
npx shadcn@latest init
```

**Options**

```bash
Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
  components         name, url or local path to component

Options:
  -t, --template <template>      the template to use. (next, next-monorepo)
  -b, --base-color <base-color>  the base color to use. (neutral, gray, zinc, stone, slate)
  -y, --yes                      skip confirmation prompt. (default: true)
  -f, --force                    force overwrite of existing configuration. (default: false)
  -c, --cwd <cwd>                the working directory. defaults to the current directory.
  -s, --silent                   mute output. (default: false)
  --src-dir                      use the src directory when creating a new project. (default: false)
  --no-src-dir                   do not use the src directory when creating a new project.
  --css-variables                use css variables for theming. (default: true)
  --no-css-variables             do not use css variables for theming.
  --no-base-style                do not install the base shadcn style
  -h, --help                     display help for command
```

---

## add

Use the `add` command to add components and dependencies to your project.

```bash
npx shadcn@latest add [component]
```

**Options**

```bash
Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
  components         name, url or local path to component

Options:
  -y, --yes           skip confirmation prompt. (default: false)
  -o, --overwrite     overwrite existing files. (default: false)
  -c, --cwd <cwd>     the working directory. defaults to the current directory.
  -a, --all           add all available components (default: false)
  -p, --path <path>   the path to add the component to.
  -s, --silent        mute output. (default: false)
  --src-dir           use the src directory when creating a new project. (default: false)
  --no-src-dir        do not use the src directory when creating a new project.
  --css-variables     use css variables for theming. (default: true)
  --no-css-variables  do not use css variables for theming.
  -h, --help          display help for command
```

---

## view

Use the `view` command to view items from the registry before installing them.

```bash
npx shadcn@latest view [item]
```

You can view multiple items at once:

```bash
npx shadcn@latest view button card dialog
```

Or view items from namespaced registries:

```bash
npx shadcn@latest view @acme/auth @v0/dashboard
```

**Options**

```bash
Usage: shadcn view [options] <items...>

view items from the registry

Arguments:
  items            the item names or URLs to view

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -h, --help       display help for command
```

---

## search

Use the `search` command to search for items from registries.

```bash
npx shadcn@latest search [registry]
```

You can search with a query:

```bash
npx shadcn@latest search @shadcn -q "button"
```

Or search multiple registries at once:

```bash
npx shadcn@latest search @shadcn @v0 @acme
```

The `list` command is an alias for `search`:

```bash
npx shadcn@latest list @acme
```

**Options**

```bash
Usage: shadcn search|list [options] <registries...>

search items from registries

Arguments:
  registries             the registry names or urls to search items from. Names
                         must be prefixed with @.

Options:
  -c, --cwd <cwd>        the working directory. defaults to the current directory.
  -q, --query <query>    query string
  -l, --limit <number>   maximum number of items to display per registry (default: "100")
  -o, --offset <number>  number of items to skip (default: "0")
  -h, --help             display help for command
```

---

## list

Use the `list` command to list all items from a registry.

```bash
npx shadcn@latest list @acme
```

**Options**

```bash
Usage: shadcn list [options] <registries...>

list items from registries

Arguments:
  registries             the registry names or urls to list items from. Names
    must be prefixed with @.
```

**Options**

```bash
Usage: shadcn list [options] <registries...>

list items from registries

Arguments:
  registries             the registry names or urls to list items from. Names
    must be prefixed with @.
```

---

## build

Use the `build` command to generate the registry JSON files.

```bash
npx shadcn@latest build
```

This command reads the `registry.json` file and generates the registry JSON files in the `public/r` directory.

**Options**

```bash
Usage: shadcn build [options] [registry]

build components for a shadcn registry

Arguments:
  registry             path to registry.json file (default: "./registry.json")

Options:
  -o, --output <path>  destination directory for json files (default: "./public/r")
  -c, --cwd <cwd>      the working directory. defaults to the current directory.
  -h, --help           display help for command
```

To customize the output directory, use the `--output` option.

```bash
npx shadcn@latest build --output ./public/registry
```

---

## migrate

Use the `migrate` command to run migrations on your project.

```bash
npx shadcn@latest migrate [migration]
```

**Available Migrations**

| Migration | Description                                             |
| --------- | ------------------------------------------------------- |
| `icons`   | Migrate your UI components to a different icon library. |
| `radix`   | Migrate to radix-ui.                                    |
| `rtl`     | Migrate your components to support RTL (right-to-left). |

**Options**

```bash
Usage: shadcn migrate [options] [migration] [path]

run a migration.

Arguments:
  migration        the migration to run.
  path             optional path or glob pattern to migrate.

Options:
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -l, --list       list all migrations. (default: false)
  -y, --yes        skip confirmation prompt. (default: false)
  -h, --help       display help for command
```

---

### migrate rtl

The `rtl` migration transforms your components to support RTL (right-to-left) languages.

```bash
npx shadcn@latest migrate rtl
```

This will:

1. Update `components.json` to set `rtl: true`
2. Transform physical CSS properties to logical equivalents (e.g., `ml-4` → `ms-4`, `text-left` → `text-start`)
3. Add `rtl:` variants where needed (e.g., `space-x-4` → `space-x-4 rtl:space-x-reverse`)

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file
npx shadcn@latest migrate rtl src/components/ui/button.tsx

# Migrate files matching a glob pattern
npx shadcn@latest migrate rtl "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui` directory (from `components.json`).

---

### migrate radix

The `radix` migration updates your imports from individual `@radix-ui/react-*` packages to the unified `radix-ui` package.

```bash
npx shadcn@latest migrate radix
```

This will:

1. Transform imports from `@radix-ui/react-*` to `radix-ui`
2. Add the `radix-ui` package to your `package.json`

**Before**

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as SelectPrimitive from "@radix-ui/react-select"
```

**After**

```tsx
import { Dialog as DialogPrimitive, Select as SelectPrimitive } from "radix-ui"
```

**Migrate specific files**

You can migrate specific files or use glob patterns:

```bash
# Migrate a specific file.
npx shadcn@latest migrate radix src/components/ui/dialog.tsx

# Migrate files matching a glob pattern.
npx shadcn@latest migrate radix "src/components/ui/**"
```

If no path is provided, the migration will transform all files in your `ui` directory (from `components.json`).

Once complete, you can remove any unused `@radix-ui/react-*` packages from your `package.json`.
