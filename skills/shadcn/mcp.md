# shadcn MCP Server

The CLI includes an MCP server that lets AI assistants search, browse, view, and install components from registries.

---

## Setup

```bash
shadcn mcp        # start the MCP server (stdio)
shadcn mcp init   # write config for your editor
```

Editor config files:

| Editor | Config file |
|--------|------------|
| Claude Code | `.mcp.json` |
| Cursor | `.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` |
| OpenCode | `opencode.json` |
| Codex | `~/.codex/config.toml` (manual) |

---

## Tools

> **Tip:** MCP tools handle registry operations (search, view, install). For project configuration (aliases, framework, Tailwind version), use `npx shadcn@latest info` — there is no MCP equivalent.

### `shadcn:get_project_registries`

Returns registry names from `components.json`. Errors if no `components.json` exists.

**Input:** none

### `shadcn:list_items_in_registries`

Lists all items from one or more registries.

**Input:** `registries` (string[]), `limit` (number, optional), `offset` (number, optional)

### `shadcn:search_items_in_registries`

Fuzzy search across registries.

**Input:** `registries` (string[]), `query` (string), `limit` (number, optional), `offset` (number, optional)

### `shadcn:view_items_in_registries`

View item details including full file contents.

**Input:** `items` (string[]) — e.g. `["@shadcn/button", "@shadcn/card"]`

### `shadcn:get_item_examples_from_registries`

Find usage examples and demos with source code.

**Input:** `registries` (string[]), `query` (string) — e.g. `"accordion-demo"`, `"button example"`

### `shadcn:get_add_command_for_items`

Returns the CLI install command.

**Input:** `items` (string[]) — e.g. `["@shadcn/button"]`

### `shadcn:get_audit_checklist`

Returns a checklist for verifying components (imports, deps, lint, TypeScript).

**Input:** none

### `shadcn:get_project_info`

Returns framework, Tailwind config, import aliases, installed components, and `components.json` settings. Use before adding or modifying components to understand the project structure.

**Input:** none

### `shadcn:get_component_docs`

Returns documentation links for shadcn components — official docs, API reference, and source code.

**Input:** `components` (string[]) — e.g. `["button", "card"]`

### `shadcn:get_skills_context`

Returns shadcn best practices from skills files installed in the project (styling, forms, icons, composition, etc). If no skills are installed, returns installation instructions.

**Input:** `topics` (string[], optional) — `styling | forms | icons | composition | base-vs-radix | cli | customization | mcp`

### `shadcn:dry_run_add`

Preview what `shadcn add` would change without writing anything. Returns files to create/overwrite/skip, npm dependencies, CSS variables, and env vars.

**Input:** `components` (string[]), `overwrite` (boolean, optional)

### `shadcn:add_component`

Install components into the project. Writes files, installs npm dependencies, updates CSS. Use `dry_run_add` first to preview changes.

**Input:** `components` (string[]), `overwrite` (boolean, optional)

### `shadcn:get_component_diff`

Show a per-file diff between what is in the project and what `shadcn add` would write — without making any changes.

- New files: full content shown in a code block
- Changed files: unified diff (current → incoming)
- Unchanged files: listed as skipped

Show this diff to the user and ask which files to accept or skip, then call `apply_component_diff` with their choices.

**Input:** `components` (string[])

### `shadcn:apply_component_diff`

Apply per-file resolutions from `get_component_diff`. Writes accepted files, skips rejected ones. Always installs dependencies and updates CSS/env vars regardless of file resolutions.

**Input:** `components` (string[])`, `resolutions` (Array<`{ path: string, resolution: "accept" | "skip" }`>)

---

## Selective Updates

To update a component while keeping local changes in specific files:

1. Call `get_component_diff` with the component name — get a per-file diff
2. Show the diff to the user and ask which files to accept or skip
3. Call `apply_component_diff` with their choices

Dependencies and CSS updates always apply regardless of which files are accepted.

---

## Configuring Registries

Registries are set in `components.json`. The `@shadcn` registry is always built-in.

```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@private": {
      "url": "https://private.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${MY_TOKEN}" }
    }
  }
}
```

- Names must start with `@`.
- URLs must contain `{name}`.
- `${VAR}` references are resolved from environment variables.

Community registry index: `https://ui.shadcn.com/r/registries.json`
