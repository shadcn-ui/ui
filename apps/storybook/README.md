# `@leadbank/storybook`

Visual catalog for `@leadbank/ui`.

## Status

Slice 2 scaffold. One story group (`Components/Button`) and a `Foundations/Tokens` page that renders the placeholder Lead CSS variables shipped by `@leadbank/ui/styles.css`.

## Setup

This app manages its own dependencies via npm with a workspace-isolated lockfile. Same pattern as `packages/lead-ui` and `packages/lead-design-tokens-cli` — no root deps, no pnpm/turbo.

```bash
# Build the @leadbank/ui dist first so Storybook can resolve it.
npm install --prefix packages/lead-ui
npm run --prefix packages/lead-ui build

# Then install Storybook's own deps.
npm install --prefix apps/storybook
```

## Local @leadbank/ui consumption

`apps/storybook/package.json` references `@leadbank/ui` as a `file:../../packages/lead-ui` dependency. npm symlinks that package into `apps/storybook/node_modules/@leadbank/ui`, so any rebuild of `packages/lead-ui` is picked up by a Storybook restart.

This is intentional and temporary: it avoids reintroducing pnpm workspaces while keeping the import surface (`import { Button } from "@leadbank/ui"`) identical to what downstream consumers will use once the package is published.

If you change `packages/lead-ui/src`, run `npm run --prefix packages/lead-ui build` again so Storybook sees the new `dist/`.

## Scripts

- `npm run --prefix apps/storybook dev` — `storybook dev -p 6006`. Port 6006 on localhost.
- `npm run --prefix apps/storybook build` — `storybook build -o storybook-static`. Static output for the Pages deploy in the next slice.

The repo root exposes the same as `lead:storybook:dev` and `lead:storybook:build`.

## Out of scope (future PRs)

- GitHub Pages deploy of `storybook-static/` (Slice 3).
- Figma Code Connect mappings (Slice 4).
- Visual regression / Chromatic.
- Tailwind v4 / Radix.
