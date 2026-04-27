# `@leadbank/ui`

Lead design system React component library. Package-local, private. Not published.

## Status

PR #1 skeleton. One component (`Button`) wired against placeholder CSS variables in `src/tokens.css`. The placeholder will be replaced by generated output from `@leadbank/design-tokens-cli` once the CLI's `build` command lands.

## Components

- `Button` — variants `primary` / `secondary` / `outline` / `ghost` / `danger`, sizes `sm` / `md` / `lg`, plus `disabled` and `loading` states.

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

## Tokens

Until the token build pipeline emits real CSS, this package ships a small `src/tokens.css` placeholder declaring the Lead variable names the components consume. Component CSS is written against those names directly, so swapping the placeholder for the generated file later is a one-file change.

## Out of scope (future PRs)

- Storybook (`apps/storybook/`).
- GitHub Pages deploy.
- Figma Code Connect mappings.
- Tailwind v4 integration.
- Radix-based primitives for components that need accessibility/state machinery.
