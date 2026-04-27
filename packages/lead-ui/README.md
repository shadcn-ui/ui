# `@leadbank/ui`

Lead design system React component library. Package-local, private. Not published.

## Status

PR #1 skeleton. One component (`Button`) wired against placeholder CSS variables in `src/tokens.css`. The placeholder will be replaced by generated output from `@leadbank/design-tokens-cli` once the CLI's `build` command lands.

## Components

- `Button` — variants `primary` / `secondary` / `outline` / `ghost` / `danger`, sizes `sm` / `md` / `lg`, plus `disabled` and `loading` states.
- `Input` — variants `default` / `error`, sizes `sm` / `md` / `lg`, plus `disabled` and `invalid` states. Maps `invalid` to `aria-invalid`.
- `Label` — sizes `sm` / `md` / `lg`, plus `disabled` and `required` states. Pairs with `Input` via `htmlFor`.
- `Field` family — composes Label + Input + Description + Error with shared ids and `aria-describedby` wiring:
  - `Field` — root container; provides id/disabled/invalid via context. Vertical or horizontal orientation.
  - `FieldGroup` — stacks multiple `Field`s with consistent spacing; `role="group"` by default.
  - `FieldLabel` — Field-aware Label that inherits `htmlFor` from context.
  - `FieldDescription` — paragraph that auto-wires its id into the control's `aria-describedby`.
  - `FieldError` — `role="alert"` paragraph; only contributes to `aria-describedby` when the surrounding Field is `invalid`.
  - `FieldControl` — slot that propagates id, disabled, invalid, and aria-describedby to its single child control without overriding caller-supplied values.
- `Card` family — layout container with semantic subcomponents:
  - `Card` — root container; padding (`none`/`sm`/`md`/`lg`) and variant (`default`/`muted`/`outline`).
  - `CardHeader`, `CardContent`, `CardFooter` (align `start`/`end`/`between`).
  - `CardTitle` — heading element; `level` selects `h1`–`h6` (default `h3`).
  - `CardDescription` — muted paragraph for sub-headings.
- `Separator` — 1px divider, horizontal or vertical, `default` or `strong` variant. Decorative by default (`role="none"`); set `decorative={false}` for a semantic `role="separator"` with `aria-orientation`.

## Setup

This package manages its own dependencies via npm with a workspace-isolated lockfile (matching the `@leadbank/design-tokens-cli` pattern). Do not install root-level dependencies for it.

```bash
npm install --prefix packages/lead-ui
```

## Scripts

- `npm run --prefix packages/lead-ui build` — Vite library build + emit `.d.ts`.
- `npm run --prefix packages/lead-ui typecheck` — `tsc --noEmit`.
- `npm run --prefix packages/lead-ui test` — Vitest run.

The repo root exposes the same commands as `lead:ui:build`, `lead:ui:typecheck`, and `lead:ui:test`.

## Build output

`dist/`:

- `index.js` — ESM bundle.
- `index.cjs` — CJS bundle.
- `index.d.ts` — type declarations.
- `leadui.css` — combined component + token CSS, exported as `@leadbank/ui/styles.css`.

Token CSS is currently bundled into `@leadbank/ui/styles.css` alongside component styles. A separate `@leadbank/ui/tokens.css` export will be added once the token CLI's `build` command emits a real `tokens.css` artifact this package can re-export.

## Tokens

Until the token build pipeline emits real CSS, this package ships a small `src/tokens.css` placeholder declaring the Lead variable names the components consume. Component CSS is written against those names directly, so swapping the placeholder for the generated file later is a one-file change.

## Out of scope (future PRs)

- Storybook (`apps/storybook/`).
- GitHub Pages deploy.
- Figma Code Connect mappings.
- Tailwind v4 integration.
- Radix-based primitives for components that need accessibility/state machinery.
