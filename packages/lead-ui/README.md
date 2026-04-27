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
- `Checkbox` — Radix-backed checkbox; sizes `sm` / `md` / `lg`, plus `disabled`, `invalid`, and tri-state `indeterminate`. Controlled (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`).
- `Switch` — Radix-backed toggle; sizes `sm` / `md` / `lg`, plus `disabled`. Same control patterns as `Checkbox`.
- `RadioGroup` / `RadioGroupItem` — Radix-backed radio group; sizes propagate from group to items via context (overridable per-item). Supports controlled (`value` + `onValueChange`), uncontrolled (`defaultValue`), and group-wide or per-item `disabled`.
- `Badge` — non-interactive `<span>` for status/labels; variants `neutral` / `brand` / `success` / `warning` / `danger`, sizes `sm` / `md` / `lg`, optional leading `dot`.
- `Alert` family — inline alert composed of `Alert`, `AlertTitle`, `AlertDescription`. Variants `neutral` / `info` / `success` (polite, `role="status"`) and `warning` / `danger` (assertive, `role="alert"`). Optional caller-supplied `icon?: ReactNode` slot (rendered `aria-hidden`). Callers can override `role` for special cases.
- `Dialog` family — Radix-backed modal dialog. Compose `Dialog` + `DialogTrigger` + `DialogContent` (size `sm` / `md` / `lg`) + `DialogHeader` / `DialogTitle` / `DialogDescription` / `DialogFooter` (align `start` / `end` / `between`) + `DialogClose`. Includes overlay, focus trap, ESC-to-close, and proper `aria-labelledby` / `aria-describedby` wiring. `DialogTrigger` and `DialogClose` expose Radix's `asChild` so you can wrap any focusable element (typically a Lead `Button`) without an extra wrapper.
- `Tooltip` family — Radix-backed tooltip. Wrap your app once with `TooltipProvider` (set `delayDuration` here), then compose `Tooltip` + `TooltipTrigger` + `TooltipContent` at each anchor. Supports `side` (top/right/bottom/left), `align` (start/center/end), `sideOffset`, and an opt-out `withArrow` prop. `TooltipTrigger` exposes `asChild` for the same reason as `DialogTrigger`.
- `Select` family — Radix-backed select. Compose `Select` + `SelectTrigger` (size `sm`/`md`/`lg`, `invalid`) + `SelectValue` (placeholder support) + `SelectContent` (popper-positioned, portal) + `SelectItem` (with optional `disabled`); group with `SelectGroup` + `SelectLabel` + `SelectSeparator`. Optional `SelectScrollUpButton` / `SelectScrollDownButton` for long lists. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Group-wide `disabled` cascades; per-item `disabled` overrides. `data-size` and `data-invalid` on the trigger are hardened against user override.
- `Skeleton` — decorative loading placeholder; shapes `text` / `rect` / `circle`, shimmer animation, width/height via `style`. Decorative by default (`role="none"`, `aria-hidden=true`); set `decorative={false}` for a semantic `role="status"` announcement.
- `Progress` — Radix-backed progress bar; sizes `sm`/`md`/`lg`, variants `default`/`success`/`warning`/`danger`, plus indeterminate when `value` is omitted or `null`. Always pair with `aria-label` or `aria-labelledby`.
- `Popover` family — Radix-backed popover. Compose `Popover` + `PopoverTrigger` + `PopoverContent` + (optional) `PopoverClose` + `PopoverAnchor`. Side/align/sideOffset passthrough; opt-out `withArrow`. Trigger and Close expose `asChild`.
- `DropdownMenu` family — Radix-backed menu with `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, plus state-bearing `DropdownMenuCheckboxItem` and `DropdownMenuRadioGroup` + `DropdownMenuRadioItem`. Submenus via `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent`. Trigger exposes `asChild`.
- `Tabs` family — Radix-backed tabs. Compose `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent`. Sizes (`sm`/`md`/`lg`) cascade from `Tabs` root via context (overridable per trigger). Supports horizontal (default) and vertical orientation via Radix's `orientation` prop. Active state styled via `data-state="active"`.
- `Accordion` family — Radix-backed accordion. Compose `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent`. `type="single"` (with `collapsible`) for one-open-at-a-time; `type="multiple"` for any combination open. Built-in chevron rotates on open via `data-state`.

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
