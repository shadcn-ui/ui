# shadcn/ui project conventions (for Aider)

Aider does not support user-defined slash commands, so this file is the
Aider-equivalent entry point for the shadcn/ui skill. Load it per
session with:

    aider --read CONVENTIONS.md

or add it to `.aider.conf.yml`:

    read: CONVENTIONS.md

---

You are working in a shadcn/ui project. Follow the shadcn/ui skill context
and enforce its patterns for the rest of the session.

## 1. The full skill

If these files exist in the current project, treat them as authoritative:

- `skills/shadcn/SKILL.md` — master skill definition
- `skills/shadcn/rules/styling.md` — Tailwind rules
- `skills/shadcn/rules/forms.md` — form composition
- `skills/shadcn/rules/composition.md` — component structure
- `skills/shadcn/rules/icons.md` — icon usage
- `skills/shadcn/rules/base-vs-radix.md` — Base UI vs Radix API differences
- `skills/shadcn/rules/chat.md` — chat primitives
- `skills/shadcn/cli.md` — full CLI reference
- `skills/shadcn/mcp.md` — MCP tools reference

Add them to the Aider chat with `/read skills/shadcn/SKILL.md` (and the
other files as needed).

If the skill files are not present, install the skill:

    npx skills add shadcn/ui

or see https://ui.shadcn.com/docs/skills.

## 2. Detect the project

If `components.json` is missing at the project root, run `npx shadcn@latest init` before continuing. Get current project context with:

    npx shadcn@latest info --json

## 3. Composition rules — always enforced

- Semantic colors only (`bg-primary`, `text-muted-foreground`) — never raw values like `bg-blue-500`.
- Use `flex` + `gap-*` for layout — never `space-x-*` / `space-y-*`.
- Forms use `FieldGroup` + `Field` — never raw `div` with `space-y-*` or `grid gap-*`.
- Icons in `Button` use `data-icon`; no sizing classes on icons inside components.
- `Dialog`, `Sheet`, `Drawer` always need a `Title` (use `className="sr-only"` if visually hidden).
- Use full `Card` composition (`CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`).
- Use `asChild` (Radix) or `render` (Base UI) for custom triggers — check the `base` field from `shadcn info`.
- For chat UI use `MessageScroller`, `Message`, `Bubble` — not hand-rolled markup.

Full Correct/Incorrect examples live in `skills/shadcn/rules/`.

## 4. Prefer the CLI over hand-rolled work

Substitute the runner that matches the project's `packageManager`:

- `npx shadcn@latest search <query>` — search registries before writing custom UI
- `npx shadcn@latest view <item>` — inspect a component before adding
- `npx shadcn@latest add <item>` — add a component
- `npx shadcn@latest docs <component>` — component docs URL

If the shadcn MCP server is configured, prefer these tools:

- `shadcn:get_project_registries`
- `shadcn:search_items_in_registries`
- `shadcn:view_items_in_registries`
- `shadcn:get_add_command_for_items`
- `shadcn:get_audit_checklist`
