# shadcn CLI Reference

All commands use `shadcn <command>`. Configuration is read from `components.json`.

> **IMPORTANT:** Always use the `shadcn` command directly. Never prefix with `npx`, `pnpm dlx`, or any package runner.

## Contents

- Commands: init, add (dry-run, smart merge), search, view, docs, diff, info, build
- Templates: next, vite, start, react-router, astro
- Presets: named, code, URL formats and fields
- Switching presets

---

## Commands

### `init` — Initialize or create a project

```bash
shadcn init [components...] [options]
```

Initializes shadcn/ui in an existing project or creates a new project (when `--name` is provided). Optionally installs components in the same step.

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--template <template>` | `-t` | Template (next, start, vite, next-monorepo, react-router) | — |
| `--preset [name]` | `-p` | Preset configuration (named, code, or URL) | — |
| `--yes` | `-y` | Skip confirmation prompt | `true` |
| `--defaults` | `-d` | Use defaults (`--template=next --preset=base-nova`) | `false` |
| `--force` | `-f` | Force overwrite existing configuration | `false` |
| `--cwd <cwd>` | `-c` | Working directory | current |
| `--name <name>` | `-n` | Name for new project | — |
| `--silent` | `-s` | Mute output | `false` |
| `--rtl` | | Enable RTL support | — |
| `--reinstall` | | Re-install existing UI components | `false` |
| `--monorepo` | | Scaffold a monorepo project | — |
| `--no-monorepo` | | Skip the monorepo prompt | — |

`shadcn create` is an alias for `shadcn init`.

### `add` — Add components

> **IMPORTANT:** To compare local components against upstream or to preview changes, ALWAYS use `shadcn add <component> --dry-run`, `--diff`, or `--view`. NEVER fetch raw files from GitHub or other sources manually. The CLI handles registry resolution, file paths, and CSS diffing automatically.

```bash
shadcn add [components...] [options]
```

Accepts component names, registry-prefixed names (`@magicui/shimmer-button`), URLs, or local paths.

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--yes` | `-y` | Skip confirmation prompt | `false` |
| `--overwrite` | `-o` | Overwrite existing files | `false` |
| `--cwd <cwd>` | `-c` | Working directory | current |
| `--all` | `-a` | Add all available components | `false` |
| `--path <path>` | `-p` | Target path for the component | — |
| `--silent` | `-s` | Mute output | `false` |
| `--dry-run` | | Preview all changes without writing files | `false` |
| `--diff <path>` | | Show the diff for a specific file (implies `--dry-run`) | — |
| `--view <path>` | | Show the full content of a specific file (implies `--dry-run`) | — |

#### Dry-Run Mode

Use `--dry-run` to preview what `add` would do without writing any files. `--diff` and `--view` both imply `--dry-run`.

```bash
# Preview all changes.
shadcn add button --dry-run

# Show the diff for a specific file.
shadcn add button --diff button.tsx

# Show the full content of a specific file.
shadcn add button --view button.tsx

# Works with URLs too.
shadcn add https://api.npoint.io/abc123 --dry-run

# CSS diffs.
shadcn add button --diff globals.css
```

**When to use dry-run:**

- When the user asks "what files will this add?" or "what will this change?" — use `--dry-run`.
- Before overwriting existing components — use `--diff` to preview the changes first.
- When the user wants to inspect component source code without installing — use `--view`.
- When checking what CSS changes would be made to `globals.css` — use `--diff globals.css`.
- When the user asks to review or audit third-party registry code before installing — use `--view` to inspect the source.

> **`shadcn add --dry-run` vs `shadcn view`:** Prefer `shadcn add --dry-run/--diff/--view` over `shadcn view` when the user wants to preview changes to their project. `shadcn view` only shows raw registry metadata. `shadcn add --dry-run` shows exactly what would happen in the user's project: resolved file paths, diffs against existing files, and CSS updates. Use `shadcn view` only when the user wants to browse registry info without a project context.

#### Smart Merge from Upstream

See [Updating Components in SKILL.md](./SKILL.md#updating-components) for the full workflow.

### `search` — Search registries

```bash
shadcn search <registries...> [options]
```

Fuzzy search across registries. Also aliased as `shadcn list`. Without `-q`, lists all items.

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--query <query>` | `-q` | Search query | — |
| `--limit <number>` | `-l` | Max items per registry | `100` |
| `--offset <number>` | `-o` | Items to skip | `0` |
| `--cwd <cwd>` | `-c` | Working directory | current |

### `view` — View item details

```bash
shadcn view <items...> [options]
```

Displays item info including file contents. Example: `shadcn view @shadcn/button`.

### `docs` — Get component documentation URLs

```bash
shadcn docs <components...> [options]
```

Outputs resolved URLs for component documentation, examples, and API references. Accepts one or more component names. Fetch the URLs to get the actual content.

Example output for `shadcn docs input button`:

```
base  radix

input
  docs      https://ui.shadcn.com/docs/components/radix/input
  examples  https://raw.githubusercontent.com/.../examples/input-example.tsx

button
  docs      https://ui.shadcn.com/docs/components/radix/button
  examples  https://raw.githubusercontent.com/.../examples/button-example.tsx
```

Some components include an `api` link to the underlying library (e.g. `cmdk` for the command component).

### `diff` — Check for updates

```bash
shadcn diff [component] [options]
```

Compares local components against the registry. Without a component name, shows all with updates.

### `info` — Project information

```bash
shadcn info [options]
```

Displays project info and `components.json` configuration. Run this first to discover the project's framework, aliases, Tailwind version, and resolved paths.

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--cwd <cwd>` | `-c` | Working directory | current |

**Project Info fields:**

| Field | Type | Meaning |
|-------|------|---------|
| `framework` | `string` | Detected framework (`next`, `vite`, `react-router`, `start`, etc.) |
| `frameworkVersion` | `string` | Framework version (e.g. `15.2.4`) |
| `isSrcDir` | `boolean` | Whether the project uses a `src/` directory |
| `isRSC` | `boolean` | Whether React Server Components are enabled |
| `isTsx` | `boolean` | Whether the project uses TypeScript |
| `tailwindVersion` | `string` | `"v3"` or `"v4"` |
| `tailwindConfigFile` | `string` | Path to the Tailwind config file |
| `tailwindCssFile` | `string` | Path to the global CSS file |
| `aliasPrefix` | `string` | Import alias prefix (e.g. `@`, `~`, `@/`) |
| `packageManager` | `string` | Detected package manager (`npm`, `pnpm`, `yarn`, `bun`) |

**Components.json fields:**

| Field | Type | Meaning |
|-------|------|---------|
| `base` | `string` | Primitive library (`radix` or `base`) — determines component APIs and available props |
| `style` | `string` | Visual style (e.g. `nova`, `vega`) |
| `rsc` | `boolean` | RSC flag from config |
| `tsx` | `boolean` | TypeScript flag |
| `tailwind.config` | `string` | Tailwind config path |
| `tailwind.css` | `string` | Global CSS path — this is where custom CSS variables go |
| `iconLibrary` | `string` | Icon library — determines icon import package (e.g. `lucide-react`, `@tabler/icons-react`) |
| `aliases.components` | `string` | Component import alias (e.g. `@/components`) |
| `aliases.utils` | `string` | Utils import alias (e.g. `@/lib/utils`) |
| `aliases.ui` | `string` | UI component alias (e.g. `@/components/ui`) |
| `aliases.lib` | `string` | Lib alias (e.g. `@/lib`) |
| `aliases.hooks` | `string` | Hooks alias (e.g. `@/hooks`) |
| `resolvedPaths` | `object` | Absolute file-system paths for each alias |
| `registries` | `object` | Configured custom registries |

**Links fields:**

The `info` output includes a **Links** section with templated URLs for component docs, source, and examples. For resolved URLs, use `shadcn docs <component>` instead.

### `build` — Build a custom registry

```bash
shadcn build [registry] [options]
```

Builds `registry.json` into individual JSON files for distribution. Default input: `./registry.json`, default output: `./public/r`.

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--output <path>` | `-o` | Output directory | `./public/r` |
| `--cwd <cwd>` | `-c` | Working directory | current |

---

## Templates

| Value | Framework | Monorepo support |
|-------|-----------|-----------------|
| `next` | Next.js | Yes |
| `vite` | Vite | Yes |
| `start` | TanStack Start | Yes |
| `react-router` | React Router | Yes |
| `astro` | Astro | Yes |

All templates support monorepo scaffolding via the `--monorepo` flag. When passed, the CLI uses a monorepo-specific template directory (e.g. `next-monorepo`, `vite-monorepo`). When neither `--monorepo` nor `--no-monorepo` is passed, the CLI prompts interactively.

---

## Presets

Three ways to specify a preset via `--preset`:

1. **Named:** `--preset base-nova` or `--preset radix-nova`
2. **Code:** `--preset a2r6bw` (base62 string, starts with lowercase `a`)
3. **URL:** `--preset "https://ui.shadcn.com/init?base=radix&style=nova&..."`

> **IMPORTANT:** Never try to decode, fetch, or resolve preset codes manually. Preset codes are opaque — pass them directly to `shadcn init --preset <code>` and let the CLI handle resolution.

### Named Presets

| Name | Base | Style | Font | Icon Library |
|------|------|-------|------|-------------|
| `radix-nova` | radix | nova | geist | lucide |
| `base-nova` | base | nova | geist | lucide |

Both use neutral base color, neutral theme, default radius, subtle menu accent, default menu color.

### Preset Fields

| Field | Valid Values | Default |
|-------|-------------|---------|
| `base` | `radix`, `base` | `radix` |
| `style` | `nova`, `vega`, `maia`, `lyra`, `mira` | `nova` |
| `baseColor` | `neutral`, `stone`, `zinc`, `gray` | `neutral` |
| `theme` | `neutral`, `stone`, `zinc`, `gray`, `amber`, `blue`, `cyan`, `emerald`, `fuchsia`, `green`, `indigo`, `lime`, `orange`, `pink`, `purple`, `red`, `rose`, `sky`, `teal`, `violet`, `yellow` | `neutral` |
| `iconLibrary` | `lucide`, `hugeicons`, `tabler`, `phosphor`, `remixicon` | `lucide` |
| `font` | `inter`, `noto-sans`, `nunito-sans`, `figtree`, `roboto`, `raleway`, `dm-sans`, `public-sans`, `outfit`, `jetbrains-mono`, `geist`, `geist-mono` | `inter` |
| `radius` | `default`, `none`, `small`, `medium`, `large` | `default` |
| `menuAccent` | `subtle`, `bold` | `subtle` |
| `menuColor` | `default`, `inverted` | `default` |

---

## Switching Presets

Ask the user first: **reinstall**, **merge**, or **skip** existing components?

- **Reinstall** → `shadcn init --preset <code> --force --reinstall`. Overwrites all component files with the new preset styles. Use when the user hasn't customized components.
- **Merge** → `shadcn init --preset <code> --force --no-reinstall`, then run `shadcn info` to get the list of installed components and use the [smart merge workflow](./SKILL.md#updating-components) to update them one by one, preserving local changes. Use when the user has customized components.
- **Skip** → `shadcn init --preset <code> --force --no-reinstall`. Only updates config and CSS variables, leaves existing components as-is.
