# `@leadbank/ui` API consistency audit

This document is a living reference for the public API surface of `@leadbank/ui`. It captures the conventions every new component is expected to follow, the deliberate exceptions, and the open decisions that haven't been made yet.

Update this file when adding a component, changing a contract, or revisiting an open decision.

**Storybook** (live, deployed on every push to `main`): <https://jnanthak83.github.io/lead-design-system/>

---

## 1. Component inventory

As of the latest merge to `main`, the package exports the following components:

### Form-input primitives
| Component | Backed by | Notes |
|---|---|---|
| `Button` | none (Lead) | Variants `primary`/`secondary`/`outline`/`ghost`/`danger`, sizes `sm`/`md`/`lg`, `disabled`, `loading`, `leadingIcon`, `trailingIcon`. |
| `Input` | none (Lead) | Variants `default`/`error`, sizes `sm`/`md`/`lg`, `disabled`, `invalid`. |
| `Label` | none (Lead) | Sizes `sm`/`md`/`lg`, `disabled`, `required`. |
| `Checkbox` | `@radix-ui/react-checkbox` | Sizes `sm`/`md`/`lg`, `invalid`, `disabled`, tri-state via `checked={"indeterminate"}`. |
| `Switch` | `@radix-ui/react-switch` | Sizes `sm`/`md`/`lg`, `disabled`. |
| `RadioGroup` / `RadioGroupItem` | `@radix-ui/react-radio-group` | Group exposes size; items inherit via context (overridable per item). |
| `Select` family | `@radix-ui/react-select` | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`. |

### Form composition
| Component | Backed by | Notes |
|---|---|---|
| `Field` family | none (Lead context) | `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl`. Provides shared id, `aria-describedby`, and `disabled`/`invalid` propagation. |

### Layout / surface
| Component | Backed by | Notes |
|---|---|---|
| `Card` family | none (Lead) | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Padding `none`/`sm`/`md`/`lg`, variant `default`/`muted`/`outline`. |
| `Separator` | none (Lead) | Horizontal/vertical, `default`/`strong`, decorative-by-default. |

### Feedback / status
| Component | Backed by | Notes |
|---|---|---|
| `Badge` | none (Lead) | Variants `neutral`/`brand`/`success`/`warning`/`danger`, sizes `sm`/`md`/`lg`, optional `dot`. |
| `Alert` family | none (Lead) | `Alert`, `AlertTitle`, `AlertDescription`. Variants `neutral`/`info`/`success` use `role="status"`; `warning`/`danger` use `role="alert"`. |
| `Skeleton` | none (Lead) | Shapes `text`/`rect`/`circle`. Decorative by default (`role="none"`, `aria-hidden=true`); set `decorative={false}` for `role="status"`. |
| `Progress` | `@radix-ui/react-progress` | Sizes `sm`/`md`/`lg`, variants `default`/`success`/`warning`/`danger`, indeterminate when `value` is omitted/null. |

### Overlays
| Component | Backed by | Notes |
|---|---|---|
| `Dialog` family | `@radix-ui/react-dialog` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`. Sizes `sm`/`md`/`lg`. |
| `Tooltip` family | `@radix-ui/react-tooltip` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`. Side/align props passthrough. |

---

## 2. Conventions

### 2.1 `size` prop

Every component that accepts a size uses the same scale:

```ts
type Size = "sm" | "md" | "lg"
```

Default: `"md"` everywhere. Components that surface a size prop today: `Button`, `Input`, `Label`, `Field` (via children), `Badge`, `Checkbox`, `Switch`, `RadioGroup` (with per-item override), `SelectTrigger`. The `Card` family uses `padding` (not `size`) because the variation describes container density rather than control density. `Dialog` uses `size` on `DialogContent` for max-width selection.

### 2.2 `variant` prop

Components that accept a variant use a small, named set per component (no shared "global" variant union). The values that recur across components map onto the same underlying token semantics:

| Component | Variants |
|---|---|
| `Button` | `primary`, `secondary`, `outline`, `ghost`, `danger` |
| `Input` | `default`, `error` |
| `Card` | `default`, `muted`, `outline` |
| `Separator` | `default`, `strong` |
| `Badge` | `neutral`, `brand`, `success`, `warning`, `danger` |
| `Alert` | `neutral`, `info`, `success`, `warning`, `danger` |

**Convention:** when a variant maps to a Lead token color group, the variant name matches the token group (`success`, `warning`, `danger`). When a variant describes a visual treatment (`outline`, `ghost`, `muted`), the name describes the treatment.

Default: each component picks its own most-common default.

### 2.3 `invalid` and `disabled` conventions

- **`disabled`** is the controlling prop. Components forward it to the underlying DOM/Radix primitive. When set, the component:
  - Disables interaction (no events fire).
  - Sets `data-disabled="true"` (or Radix's `data-disabled` attribute on Radix-backed components, which is set without a value).
  - Renders disabled visuals from `tokens.css` (muted background, disabled text, no hover state).
- **`invalid`** is a Lead-specific boolean separate from native `:invalid` and from `aria-invalid`. When set, the component:
  - Sets `data-invalid="true"`.
  - Sets `aria-invalid="true"` so assistive tech announces the field as invalid.
  - Renders the danger-bordered visual variant.
  - Does **not** disable interaction (the user must still be able to fix the invalid value).
- `Field invalid` propagates `invalid` to its `FieldControl` child. `Field disabled` propagates `disabled` similarly.
- For `Input`: `variant="error"` is treated as `invalid` unless `invalid={false}` explicitly overrides it.

### 2.4 Data-attribute contracts

Every component exposes its variant/size/state via `data-*` attributes for CSS targeting:

| Attribute | Used by |
|---|---|
| `data-variant` | `Button`, `Input`, `Card`, `Separator`, `Badge`, `Alert` |
| `data-size` | `Button`, `Input`, `Label`, `Card` (as `data-padding`), `Badge`, `Checkbox`, `Switch`, `RadioGroup`, `RadioGroupItem`, `SelectTrigger`, `DialogContent` |
| `data-invalid` | `Input`, `Field`, `Checkbox`, `SelectTrigger` |
| `data-disabled` | `Input`, `Label`, `Field`, `FieldDescription`, `FieldError`, `Checkbox` (Radix), `Switch` (Radix), `RadioGroup*` (Radix), `SelectTrigger` (Radix) |
| `data-loading` | `Button` |
| `data-orientation` | `Field`, `Separator` |
| `data-state` | Radix-driven (`checked`, `unchecked`, `indeterminate`, `open`, `closed`, `highlighted`) |
| `data-padding` | `Card` |
| `data-align` | `CardFooter`, `DialogFooter` |
| `data-active` | Storybook-only example helpers |

**Hardening contract (load-bearing):** components spread `{...rest}` *before* their internal `data-*` state attributes. JSX duplicate-key semantics mean the later assignment wins, so a caller cannot spoof `data-variant`, `data-size`, `data-invalid`, `data-padding`, or `data-align` from props. Tests pin this contract on every component that has it.

Pass-through attributes (`data-testid`, `aria-label`, etc.) are unaffected — they don't collide with internal state.

### 2.5 `asChild` exposure

`asChild` is a Radix Slot pattern that lets a primitive render its children as the actual element. Lead exposes it deliberately rather than across the board.

**Exposed (good reason: any reasonable use wraps a Lead Button or other focusable element):**
- `DialogTrigger`
- `DialogClose`
- `TooltipTrigger`

**Not exposed (Lead's chrome on those elements is non-negotiable):**
- `DialogContent`, `DialogTitle`, `DialogDescription`
- `TooltipContent`
- `SelectTrigger`, `SelectContent`, `SelectItem`
- `Checkbox` (Radix `Root`)
- `Switch` (Radix `Root`)
- `RadioGroup`, `RadioGroupItem`

If a future component exposes `asChild`, document the reason here.

### 2.6 `forwardRef`

Every DOM-backed component forwards a ref to its underlying element. Compound components forward to the *primary* element (e.g. `Card` → root `<div>`, `Field` → root `<div>`, `DialogContent` → Radix `Content` div). Tests cover ref forwarding for every component.

### 2.7 `className` merge

Every component merges a caller-supplied `className` with its base class. Pattern:

```ts
const classes = ["lead-Foo", className].filter(Boolean).join(" ")
```

Tests pin this for every component.

### 2.8 Lead CSS variables

All component styling reads from `src/tokens.css` (the placeholder until `lead-design-tokens-cli build` lands). Variable names follow `--lead-{group}-{token}` (e.g. `--lead-color-action-primary-default`, `--lead-space-3`, `--lead-font-size-md`). No Tailwind, no inline color literals, no hard-coded hex except a small set in `Badge.css` / `Alert.css` for variant tints which are flagged for replacement when the token build emits status colors.

---

## 3. Radix dependency boundaries

Lead-owned components consume Radix primitives where Radix solves an accessibility/state problem Lead would otherwise reimplement. Radix is not exposed to consumers.

### Components that wrap Radix
| Lead component | Radix package |
|---|---|
| `Checkbox` | `@radix-ui/react-checkbox` |
| `Switch` | `@radix-ui/react-switch` |
| `RadioGroup`, `RadioGroupItem` | `@radix-ui/react-radio-group` |
| `Dialog` family | `@radix-ui/react-dialog` |
| `Tooltip` family | `@radix-ui/react-tooltip` |
| `Select` family | `@radix-ui/react-select` |

### Components that do NOT use Radix
- `Button`, `Input`, `Label`, `Field` family, `Card` family, `Separator`, `Badge`, `Alert` family, `Skeleton` — pure React + CSS variables.

### What Lead exposes vs. what Lead hides

Lead's wrappers forward Radix's controlled-state props (`open`/`onOpenChange`, `checked`/`onCheckedChange`, `value`/`onValueChange`, `defaultOpen`/`defaultChecked`/`defaultValue`) and Radix's accessibility-affecting props (`disabled`, `name`, `required`, `dir`). They strip Radix internals that aren't useful at the public API level (`asChild` outside the documented exceptions, internal `Slot` types).

---

## 4. Accessibility role policies

| Component | Role / aria policy |
|---|---|
| `Alert` (variant `neutral`/`info`/`success`) | `role="status"` (polite, `aria-live="polite"`). |
| `Alert` (variant `warning`/`danger`) | `role="alert"` (assertive, `aria-live="assertive"`). |
| `Alert` (caller-overridden) | Caller's `role` wins. |
| `FieldError` | `role="alert"` (only when it has children). |
| `Separator` (decorative) | `role="none"`, no `aria-orientation`. |
| `Separator` (semantic, `decorative={false}`) | `role="separator"` + `aria-orientation`. |
| `Skeleton` (decorative) | `role="none"` + `aria-hidden="true"`. |
| `Skeleton` (semantic, `decorative={false}`) | `role="status"`, caller provides `aria-label`. |
| `Progress` | Radix manages `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`. Caller provides `aria-label`/`aria-labelledby`. |
| `FieldGroup` | `role="group"` by default; overridable to `radiogroup` etc. |
| `Dialog` | Radix manages `role="dialog"`, `aria-modal`, `aria-labelledby` (via `DialogTitle`), `aria-describedby` (via `DialogDescription`). |
| `Tooltip` | Radix manages `role="tooltip"` on the SR helper span. |
| `Checkbox` / `Switch` / `RadioGroup` / `Select` | Radix manages `role`, `aria-checked`, `aria-selected`, `aria-expanded`, `aria-controls`, etc. |
| `Field` | `aria-describedby` on the wrapped control includes the description id whenever a `FieldDescription` is rendered, and the error id only when both `invalid={true}` and `FieldError` has children. |

---

## 5. Code Connect mapping status

| Component | Mapping file | Figma node ID |
|---|---|---|
| `Button` | `packages/lead-ui/src/components/Button/Button.figma.tsx` | `29:67711` |
| Everything else | — | — |

**Rule:** never ship a Code Connect mapping with a fake or `TODO` Figma URL. New mappings land in their own follow-up PR, one component at a time, gated on the user supplying the canonical `node-id`.

The `figma-code-connect.yml` workflow publishes mappings on push to `main` only when `vars.FIGMA_CODE_CONNECT_ENABLED == 'true'`. **That variable is currently `false` (or unset). Do not flip it without explicit authorization.**

---

## 6. Known jsdom testing limitations

Documented inline in the relevant test files; collected here for reference.

### Polyfills (`packages/lead-ui/vitest.setup.ts`)
- `ResizeObserver` — stub.
- `IntersectionObserver` — stub.
- `Element.prototype.hasPointerCapture` — stub returns `false`.
- `Element.prototype.scrollIntoView` — no-op.

These keep Radix overlays from throwing; they do not implement real layout, so coordinate-dependent assertions are meaningless.

### Tooltip — `Tooltip.test.tsx`
Tests cover only structural/rendering contracts. Hover-driven open behavior, `delayDuration` timing, and resolved positioning (`side`, `align`, `sideOffset`) are exercised in Storybook only. `getByRole("tooltip")` finds Radix's SR-only helper span, not the visual content; tests query `.lead-Tooltip__content` directly.

### Select — `Select.test.tsx`
Tests cover trigger surface, controlled/uncontrolled value, disabled states, and structural rendering of the open listbox. Item selection via click, keyboard navigation, and resolved popper coordinates are not tested under jsdom.

**Select-specific testing surprise:** when the listbox is open, Radix Select sets `aria-hidden` on the trigger because focus is trapped in the popover content. `getByRole("combobox")` excludes hidden nodes by default, so open-state tests must query the trigger via `getByLabelText` or a direct selector instead. **This is intentional accessibility behavior from Radix — do not "fix" it.**

### Dialog — `Dialog.test.tsx`
Tests cover open/close via trigger and close button, controlled `open` + `onOpenChange`, sizes, aria wiring, and structural rendering. Radix may emit a warning when a `DialogContent` is rendered without a `DialogDescription`; this is advisory and does not fail the test.

---

## 7. Bundle size

Tracked at every Radix-introducing PR. Numbers are unminified `dist/index.js` (ESM); gzipped numbers in parentheses.

| Slice | JS size | Gzipped JS | CSS size | Gzipped CSS | Δ JS |
|---|---|---|---|---|---|
| Slice 1 — `lead-ui` skeleton (Button only) | 1.1 kB | 0.5 kB | 4.9 kB | 1.2 kB | — |
| Batch 1 — Input + Label | 2.3 kB | 0.8 kB | 7.6 kB | 1.5 kB | +1.2 kB |
| Batch 2 — Field family | 6.1 kB | 1.9 kB | 8.5 kB | 1.5 kB | +3.8 kB |
| Card + Separator | 8.0 kB | 2.3 kB | 10.4 kB | 1.9 kB | +1.9 kB |
| Radix Checkbox/Switch/RadioGroup | 41.3 kB | 10.8 kB | 15.6 kB | 2.4 kB | **+33.3 kB** (one-time Radix tax) |
| Badge + Alert | 42.6 kB | 11.1 kB | 18.1 kB | 2.8 kB | +1.3 kB |
| Radix Dialog + Tooltip | 134.6 kB | 37.1 kB | 20.1 kB | 3.0 kB | **+92.0 kB** (one-time overlay tax) |
| Radix Select | 168.2 kB | 44.9 kB | 24.1 kB | 3.5 kB | +33.6 kB |
| Skeleton + Radix Progress | TBD per build | TBD | TBD | TBD | small (filled in below) |

**Pattern:** the first Radix PR in a primitive family pays a one-time tax for shared internals (`react-portal`, `react-presence`, `react-popper`, `floating-ui`, etc.). Subsequent components in the same family add their behavioral cost only. Per-component cost is **falling**: future overlays (Popover, DropdownMenu) should each add 10–20 kB, not 30+.

When the consumer build pipeline is properly set up (named ESM imports + tree-shaking), unused components are excluded. The `dist/` numbers above are the worst-case "import everything" baseline.

---

## 8. Open API decisions

Items flagged for revisit before they propagate further into the surface.

1. **Variant-color literals in `Badge.css` / `Alert.css`.** Status colors (success-green, warning-amber, danger-red) are currently hard-coded hex. Replace with generated tokens once `lead-design-tokens-cli build` emits the status color group. Mechanical replacement; no API change.

2. **`Alert` icon slot.** `Alert.css` reserves layout space for a future leading icon, but no `icon` prop exists yet. Decision pending: accept a `ReactNode` slot or default to variant-keyed icons (info circle / check / warning triangle / error octagon) shipped from the package?

3. **`Field` orientation interaction with `FieldError` placement.** When `Field orientation="horizontal"`, the error renders to the right of the control, which can wrap awkwardly. Decision pending: introduce a `<FieldErrorContainer>` slot below the row, or restrict horizontal orientation to fields without errors?

4. **`Button` `as` prop / polymorphism.** Currently `Button` is always a `<button>`. Several real-world cases want it to render as an `<a>` (link styled as button). Either expose `asChild`, accept an `as` prop, or ship a separate `LinkButton`. Not blocking, but worth a decision before downstream consumers diverge.

5. **`Tooltip` content as a label vs. description.** Some triggers benefit from the tooltip *being* their accessible name (e.g. icon-only buttons), and some benefit from the tooltip being a *description* (e.g. extra context on a labeled control). Radix has both modes; Lead currently passes through whatever the caller wires. Worth documenting a recommendation.

6. **`Select` width vs. trigger width.** `SelectContent` currently uses `min-width: var(--radix-select-trigger-width)`. There's a design question whether tall menus with long labels should expand beyond the trigger or stay clipped. Open.

7. **Bundle size budget.** Gzipped JS is 44.9 kB after Select. No formal budget set. Decision: set one before adding more overlays?

---

## 9. Auditing checklist for new components

Before merging a PR that adds a component, confirm:

- [ ] `forwardRef` to the primary DOM element.
- [ ] `className` merge with the component's base class (`lead-{Component}`).
- [ ] Pass-through props for the underlying element type.
- [ ] If applicable: `size` from the `sm`/`md`/`lg` set, `variant` from a documented per-component set, `disabled`, `invalid`.
- [ ] `data-*` attributes for variant/size/state where useful.
- [ ] `{...rest}` spread **before** internal `data-*` state attributes (hardening contract).
- [ ] Accessibility role policy documented (or a comment "Radix manages this").
- [ ] Tests for variant/size/state, ref forwarding, className merge, data-* hardening, and any controlled-state behavior.
- [ ] Storybook story group for the component.
- [ ] Radix dep added to `packages/lead-ui/dependencies` only (never root).
- [ ] No Code Connect mapping unless a Figma node URL is supplied.
- [ ] README updated (`packages/lead-ui/README.md` and root `README.md`).
- [ ] This document updated if the component introduces a new convention.

---

*Last updated: PR for Skeleton + Progress (Slice 3 of overnight worker run).*
