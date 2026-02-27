---
name: shadcn
description: Manages shadcn/ui components — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file. Also triggers for "shadcn init", "create an app with --preset", or "switch to --preset".
user-invocable: false
---

# shadcn/ui

Copy-paste component library. Components are added as source code to the user's project via the CLI or MCP tools.

> **IMPORTANT:** Always use the `shadcn` command directly. Never prefix with `npx`, `pnpm dlx`, or any package runner.

## Current Project Context

```json
!`shadcn info --json 2>/dev/null || echo '{"error": "No shadcn project found. Run shadcn init first."}'`
```

The JSON above contains the project config and installed components. Use `shadcn docs <component>` to get documentation and example URLs for any component.

## Principles

1. **Use existing components first.** Check registries via MCP or `shadcn search` before writing custom UI. Check community registries too.
2. **Compose, don't reinvent.** Settings page = Tabs + Card + form controls. Dashboard = Sidebar + Card + Chart + Table.
3. **Use built-in variants before custom styles.** `variant="outline"`, `size="sm"`, etc.
4. **Use semantic colors.** `bg-primary`, `text-muted-foreground` — never raw values like `bg-blue-500`.

## Critical Rules

These rules are **always enforced**. See [patterns.md](./patterns.md) for full examples.

1. **Forms use `FieldGroup` + `Field`.** Never use raw `div` with `space-y-*` or `grid gap-*` for form layout.
2. **Items always inside their Group.** `SelectItem`/`SelectLabel` → `SelectGroup`. `DropdownMenuItem`/`DropdownMenuLabel`/`DropdownMenuSub` → `DropdownMenuGroup`. `MenubarItem` → `MenubarGroup`. `ContextMenuItem` → `ContextMenuGroup`. `CommandItem` → `CommandGroup`.
3. **Icons in `Button` use `data-icon`.** Add `data-icon="inline-start"` (prefix) or `data-icon="inline-end"` (suffix). No sizing classes on the icon.
4. **`InputGroup` uses `InputGroupInput`/`InputGroupTextarea`.** Never use raw `Input` or `Textarea` inside an `InputGroup`.
5. **Option sets (2–7 choices) use `ToggleGroup`.** Don't loop `Button` components with manual active state.
6. **Callouts use `Alert`.** Don't build custom styled `div` containers for info/warning messages.
7. **Empty states use `Empty`.** Don't build custom empty state markup.
8. **Use existing components before custom markup.** Check if a component exists before writing a styled `div`.
9. **`className` for layout, not styling.** Add layout utilities (`w-full`, `grid`, `flex`, `gap-*`) but never override component colors or typography.
10. **Use `asChild` (radix) or `render` (base) for custom triggers.** Don't wrap triggers in extra elements. Check the `base` field from `shadcn info` to determine which prop to use.
11. **Toast via `sonner`.** Use `toast()` from `sonner`. Don't build custom toast/notification markup.
12. **Pass icons as objects, not string keys.** Use `icon={CheckIcon}`, not a string key to a lookup map.
13. **Buttons inside inputs use `InputGroup` + `InputGroupAddon`.** Never place a `Button` directly inside or adjacent to an `Input` with custom positioning. Wrap in `InputGroup` and use `InputGroupAddon` for the button.

## Key Fields

The injected project context contains these key fields:

- **`aliases`** → use the actual alias prefix for imports (e.g. `@/`, `~/`), never hardcode.
- **`isRSC`** → when `true`, components using `useState`, `useEffect`, event handlers, or browser APIs need `"use client"`.
- **`tailwindVersion`** → `"v4"` uses `@theme inline` blocks; `"v3"` uses `tailwind.config.js`.
- **`tailwindCssFile`** → the global CSS file where custom CSS variables are defined. Always edit this file, never create a new one.
- **`style`** → component visual treatment (e.g. `nova`, `vega`).
- **`base`** → primitive library (`radix` or `base`). Affects component APIs and available props.
- **`iconLibrary`** → determines icon imports. Use `lucide-react` for `lucide`, `@tabler/icons-react` for `tabler`, etc. Never assume `lucide-react`.
- **`resolvedPaths`** → exact file-system destinations for components, utils, hooks, etc.
- **`framework`** → routing and file conventions (e.g. Next.js App Router vs Vite SPA).
- **`packageManager`** → use this for any non-shadcn dependency installs (e.g. `pnpm add date-fns` vs `npm install date-fns`).

See [cli.md — `info` command](./cli.md) for the full field reference.

## Component Docs, Examples, and Usage

Run `shadcn docs <component>` to get the URLs for a component's documentation, examples, and API reference. Fetch these URLs to get the actual content.

```bash
shadcn docs button dialog select
```

**When creating, fixing, debugging, or using a component, always run `shadcn docs` and fetch the URLs first.** This ensures you're working with the correct API and usage patterns rather than guessing.

## Workflow

1. **Get project context** — already injected above. Run `shadcn info` again if you need to refresh.
2. **Check installed components** — look in the `resolvedPaths.ui` directory before importing or adding. Don't import components that haven't been added, and don't re-add ones already installed.
3. **Find components** — MCP `shadcn:search_items_in_registries` or `shadcn search`.
4. **Get docs and examples** — run `shadcn docs <component>` to get URLs, then fetch them. Alternatively use MCP `shadcn:view_items_in_registries` or `shadcn view`. Note: `shadcn view` is for browsing registry items you haven't installed. To preview changes to installed components, use `shadcn add --diff`.
5. **Install or update** — MCP `shadcn:get_add_command_for_items` or `shadcn add`. When updating existing components, use `--dry-run` and `--diff` to preview changes first (see [Updating Components](#updating-components) below).
6. **Fix imports in third-party components** — After adding components from community registries (e.g. `@bundui`, `@magicui`), check the added non-UI files for hardcoded import paths like `@/components/ui/...`. These won't match the project's actual aliases. Use `shadcn info` to get the correct `ui` alias (e.g. `@workspace/ui/components`) and rewrite the imports accordingly. The CLI rewrites imports for its own UI files, but third-party registry components may use default paths that don't match the project.
7. **Verify** — MCP `shadcn:get_audit_checklist`.
8. **Switching presets** — Before running `shadcn init --preset <code>` in an existing project, always ask the user if they'd like to reinstall existing UI components. If yes, use the `--reinstall` flag to overwrite them with the new preset styles.

If MCP is unavailable, use CLI: `shadcn search`, `shadcn view`, `shadcn add`.

## Updating Components

When the user asks to update a component from upstream while keeping their local changes, use `--dry-run` and `--diff` to intelligently merge. **NEVER fetch raw files from GitHub manually — always use the CLI.**

1. Run `shadcn add <component> --dry-run` to see all files that would be affected.
2. For each file, run `shadcn add <component> --diff <file>` to see what changed upstream vs local.
3. Decide per file based on the diff:
   - No local changes → safe to overwrite.
   - Has local changes → read the local file, analyze the diff, and apply upstream updates while preserving local modifications.
   - User says "just update everything" → use `--overwrite`, but confirm first.
4. **Never use `--overwrite` without the user's explicit approval.**

## Quick Reference

```bash
# Create a new project.
shadcn init --name my-app --preset base-nova
shadcn init --name my-app --preset a2r6bw --template vite

# Create a monorepo project.
shadcn init --name my-app --preset base-nova --monorepo
shadcn init --name my-app --preset base-nova --template next --monorepo

# Initialize existing project.
shadcn init --preset base-nova
shadcn init --defaults  # shortcut: --template=next --preset=base-nova

# Add components.
shadcn add button card dialog
shadcn add @magicui/shimmer-button
shadcn add --all

# Preview changes before adding/updating.
shadcn add button --dry-run
shadcn add button --diff button.tsx
shadcn add button --view button.tsx

# Search registries.
shadcn search @shadcn -q "sidebar"
shadcn search @blocks -q "stats"

# Get component docs and example URLs.
shadcn docs button dialog select

# View registry item details (for items not yet installed).
shadcn view @shadcn/button
```

**Named presets:** `base-nova`, `radix-nova`
**Templates:** `next`, `vite`, `start`, `react-router`, `astro` (all support `--monorepo`)
**Preset codes:** Base62 strings starting with `a` (e.g. `a2r6bw`), from [ui.shadcn.com](https://ui.shadcn.com).

## Detailed References

- [cli.md](./cli.md) — Commands, flags, presets, templates
- [mcp.md](./mcp.md) — MCP server setup, tools, registry configuration
- [patterns.md](./patterns.md) — UI patterns and component composition rules
- [customization.md](./customization.md) — Theming, CSS variables, extending components
- [registry-authoring.md](./registry-authoring.md) — Building and publishing custom registries
