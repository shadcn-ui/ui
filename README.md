# Lead Design System

Lead's design-system monorepo: the CLI-ready token pipeline that feeds the Figma library and downstream app builds, plus the Figma Code Connect publishing pipeline.

## What's Here

- `packages/lead-design-tokens-cli/` contains the Lead token pipeline: import, normalize, lint, build, decision checks, schemas, and authored token inputs.
- `packages/lead-ui/` contains `@leadbank/ui`, the React component library. Components today: `Button`, `Input`, `Label`, the `Field` family (`Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl`), the `Card` family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Separator`, the Radix-backed interactive controls (`Checkbox`, `Switch`, `RadioGroup`, `RadioGroupItem`), `Badge`, the `Alert` family (`Alert`, `AlertTitle`, `AlertDescription`), the Radix-backed `Dialog` family (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`), the Radix-backed `Tooltip` family (`Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`), and the Radix-backed `Select` family (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, plus optional `SelectScrollUpButton` / `SelectScrollDownButton`). See the package README for the full surface.
- `apps/storybook/` contains the Storybook visual catalog for `@leadbank/ui`, with a `Foundations/Tokens` page and stories for every component.
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

`packages/lead-ui/` is the coded component surface. It is a private, package-local React library (`@leadbank/ui`) that consumes Lead token CSS variables. The package ships `Button`, `Input`, `Label`, the `Field` family, the `Card` family, `Separator`, the first Radix-backed interactive controls (`Checkbox`, `Switch`, `RadioGroup`), `Badge`, the `Alert` family, the Radix-backed overlays (`Dialog`, `Tooltip`), and the Radix-backed `Select` family today; additional core components are tracked in subsequent PRs. A placeholder `tokens.css` ships with the package and will be replaced by generated output once the token CLI's `build` command lands.

The package manages its own dependencies via npm with an isolated `package-lock.json`, matching the tokens CLI pattern. Useful commands from the repo root:

```bash
npm install --prefix packages/lead-ui
npm run lead:ui:build
npm run lead:ui:typecheck
npm run lead:ui:test
```

See `packages/lead-ui/README.md` for status, exports, and what's planned.

## Storybook

`apps/storybook/` hosts the visual catalog for `@leadbank/ui` — Storybook + Vite + React, package-local tooling (no pnpm/turbo). It consumes `@leadbank/ui` via a `file:` dependency, so `packages/lead-ui` must be built before Storybook can resolve it.

```bash
# One-time / after changes to packages/lead-ui:
npm install --prefix packages/lead-ui
npm run lead:ui:build

# Then run Storybook:
npm install --prefix apps/storybook
npm run lead:storybook:dev    # http://localhost:6006
npm run lead:storybook:build  # static build at apps/storybook/storybook-static
```

The static build is deployed to GitHub Pages on every push to `main` by `.github/workflows/storybook-deploy.yml`. Live URL: <https://jnanthak83.github.io/lead-design-system/>. The workflow can also be re-run manually via `workflow_dispatch`.

Storybook now also includes an **Examples** section (`Examples/Settings Panel`, `Examples/Signup Form`, `Examples/Preferences Form`) that composes the components into realistic product UI — useful for spotting integration gaps that single-component stories don't catch.

## Figma Pairing

The companion Figma staging file is organized as a CLI-ready design system library with foundations, documentation, component pages, Lead Blocks pages, and local variables for light/dark modes.

For the Figma-to-code release process, see [docs/figma-to-code-sync.md](docs/figma-to-code-sync.md).
