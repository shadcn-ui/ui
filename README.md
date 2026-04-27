# Lead Design System

Lead's design-system monorepo: the CLI-ready token pipeline that feeds the Figma library and downstream app builds, plus the Figma Code Connect publishing pipeline.

## What's Here

- `packages/lead-design-tokens-cli/` contains the Lead token pipeline: import, normalize, lint, build, decision checks, schemas, and authored token inputs.
- `packages/lead-ui/` contains `@leadbank/ui`, the React component library. Currently a skeleton with one component (`Button`); see the package README for status.
- `docs/figma-to-code-sync.md` documents the Figma-to-code release process.
- `figma.config.json` and `.github/workflows/figma-code-connect.yml` drive Figma Code Connect publishing.

## Quick Start

```bash
pnpm install
npm ci --prefix packages/lead-design-tokens-cli --workspaces=false
npm test --prefix packages/lead-design-tokens-cli --workspaces=false
```

Useful Lead token commands:

```bash
pnpm lead:tokens:test
pnpm lead:tokens:lint-schemas
pnpm lead:tokens:check-decisions
```

## Token Pipeline

The token CLI is intentionally scaffold-first. It has tested implementations for importing paper-authored tokens, checking source exceptions, and checking `[D##]` decision references. The transform-heavy commands (`normalize`, `lint`, `build`) are ready to fill in against the documented contract.

Start here:

- `packages/lead-design-tokens-cli/README.md`
- `packages/lead-design-tokens-cli/docs/cli-spec.md`
- `packages/lead-design-tokens-cli/docs/DESIGN-DECISIONS.md`
- `packages/lead-design-tokens-cli/docs/DESIGN.md`

## Component Package

`packages/lead-ui/` is the first coded component surface. It is a private, package-local React library (`@leadbank/ui`) that consumes Lead token CSS variables. It is intentionally minimal — one component (`Button`) and a placeholder `tokens.css` — so the pipeline can be exercised end to end before the surface area grows. Storybook, GitHub Pages deploy, and Figma Code Connect mappings are scheduled as follow-up PRs.

The package manages its own dependencies via npm with an isolated `package-lock.json`, matching the tokens CLI pattern. Useful commands from the repo root:

```bash
npm install --prefix packages/lead-ui
npm run lead:ui:build
npm run lead:ui:typecheck
npm run lead:ui:test
```

See `packages/lead-ui/README.md` for status, exports, and what's planned.

## Figma Pairing

The companion Figma staging file is organized as a CLI-ready design system library with foundations, documentation, component pages, Lead Blocks pages, and local variables for light/dark modes.

For the Figma-to-code release process, see [docs/figma-to-code-sync.md](docs/figma-to-code-sync.md).
