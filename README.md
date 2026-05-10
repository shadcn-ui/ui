# Lead Design System

Lead's design-system monorepo: the CLI-ready token pipeline that feeds the Figma library and downstream app builds, plus the Figma Code Connect publishing pipeline.

## What's Here

- `packages/lead-design-tokens-cli/` contains the Lead token pipeline: import, normalize, lint, build, decision checks, schemas, and authored token inputs.
- `packages/lead-ui/` contains `@leadbank/ui`, the React component library. Components today: `Button`, `Input`, `Label`, the `Field` family (`Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl`), the `Card` family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Separator`, the Radix-backed interactive controls (`Checkbox`, `Switch`, `RadioGroup`, `RadioGroupItem`), `Badge`, the `Alert` family (`Alert`, `AlertTitle`, `AlertDescription`), the Radix-backed `Dialog` family (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`), the Radix-backed `Tooltip` family (`Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`), the Radix-backed `Select` family (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, plus optional `SelectScrollUpButton` / `SelectScrollDownButton`), `Skeleton`, the Radix-backed `Progress`, the Radix-backed `Popover` family (`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`, `PopoverAnchor`), the Radix-backed `DropdownMenu` family (`DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`/`Item`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, plus submenu primitives), the Radix-backed `Tabs` family (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`), and the Radix-backed `Accordion` family (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`). See the package README for the full surface.
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

The token CLI has tested implementations for importing paper-authored tokens, checking source exceptions, checking `[D##]` decision references, and **build v1** — which emits a single `tokens.css` artifact with flattened CSS custom properties from a normalized-token JSON file. `@leadbank/ui` consumes the generated file at `packages/lead-ui/src/generated/tokens.css` (committed) so consumers work from a clean checkout without running the CLI first. Run `npm run lead:tokens:build` to regenerate after editing the token source. The transform-heavy commands `normalize` and `lint` are still scaffold-only and ready to fill in against the documented contract.

Start here:

- `packages/lead-design-tokens-cli/README.md`
- `packages/lead-design-tokens-cli/docs/cli-spec.md`
- `packages/lead-design-tokens-cli/docs/DESIGN-DECISIONS.md`
- `packages/lead-design-tokens-cli/docs/DESIGN.md`

## Component Package

`packages/lead-ui/` is the coded component surface. It is a private, package-local React library (`@leadbank/ui`) that consumes Lead token CSS variables. The package ships `Button`, `Input`, `Label`, the `Field` family, the `Card` family, `Separator`, the first Radix-backed interactive controls (`Checkbox`, `Switch`, `RadioGroup`), `Badge`, the `Alert` family, the Radix-backed overlays (`Dialog`, `Tooltip`), the Radix-backed `Select` family, `Skeleton`, the Radix-backed `Progress`, and the Radix-backed `Popover` + `DropdownMenu` families, and the Radix-backed `Tabs` + `Accordion` families today; additional core components are tracked in subsequent PRs. A placeholder `tokens.css` ships with the package and will be replaced by generated output once the token CLI's `build` command lands.

The package manages its own dependencies via npm with an isolated `package-lock.json`, matching the tokens CLI pattern. Useful commands from the repo root:

```bash
npm install --prefix packages/lead-ui
npm run lead:ui:build
npm run lead:ui:typecheck
npm run lead:ui:test
```

See `packages/lead-ui/README.md` for status, exports, and what's planned. For the cross-component API conventions, see [`packages/lead-ui/API-CONSISTENCY.md`](packages/lead-ui/API-CONSISTENCY.md).

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

Before enabling Figma Code Connect publishing, see [docs/code-connect-publish-readiness.md](docs/code-connect-publish-readiness.md) — the mapping inventory, dry-run requirement, and safe enablement checklist.

For the longer-horizon plan covering token publishing, component spec auditing, and eventual code generation, see [docs/figma-to-code-automation-roadmap.md](docs/figma-to-code-automation-roadmap.md).

## Storybook Component Parity

All 21 Lead components have production parity stories aligned to the Figma source file. Figma is the visual source of truth; Storybook renders working Lead components, and any deliberate divergence is documented inline as an accessibility, product, or API exception.

- **Working contract:** [docs/storybook-figma-parity-standard.md](docs/storybook-figma-parity-standard.md) — required story shape, exception format, verification checklist.
- **Per-component status:** [docs/storybook-figma-parity-inventory.md](docs/storybook-figma-parity-inventory.md) — Figma node URLs, parity story names, documented exceptions.
- **Live site:** <https://jnanthak83.github.io/lead-design-system/> — every merge to `main` redeploys.
