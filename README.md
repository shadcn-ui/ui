# Lead Design System

Lead's design-system monorepo: component-library source, registry tooling, and the CLI-ready token pipeline that feeds the Figma library and downstream app builds.

This repository is based on the public `shadcn-ui/ui` codebase so we can keep the component-registry structure, templates, and CLI patterns while layering Lead-owned tokens, governance, and documentation on top.

## What's Here

- `apps/v4/` contains the upstream documentation and registry app structure that the component library builds from.
- `packages/shadcn/` contains the upstream component CLI package that this fork can evolve into a Lead-flavored library surface.
- `packages/lead-design-tokens-cli/` contains the Lead token pipeline scaffold: import, normalize, lint, build, decision checks, schemas, and authored token inputs.
- `templates/` contains starter app templates inherited from the upstream library.

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

## Figma Pairing

The companion Figma staging file is organized as a CLI-ready design system library with foundations, documentation, component pages, Lead Blocks pages, and local variables for light/dark modes.

## Upstream

The `upstream` git remote points at `https://github.com/shadcn-ui/ui.git` for history and future reference. Lead-owned changes should be made on branches in this repository and reviewed before merging.
