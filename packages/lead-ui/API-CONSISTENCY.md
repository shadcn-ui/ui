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
| `Alert` family | none (Lead) | `Alert`, `AlertTitle`, `AlertDescription`. Variants `neutral`/`info`/`success` use `role="status"`; `warning`/`danger` use `role="alert"`. Optional caller-supplied `icon?: ReactNode` slot (no default icons). |
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

### Popover — `Popover.test.tsx`
Tests cover open/close via trigger, `defaultOpen`, `PopoverClose`, controlled `open` + `onOpenChange`, side/align props, `withArrow` opt-in/opt-out, className passthrough, and ref forwarding. Resolved popper coordinates and `sideOffset` are not asserted — visual coverage in Storybook.

### DropdownMenu — `DropdownMenu.test.tsx`
Two specific jsdom gaps documented inline:
1. **Click-on-trigger does not open the menu under jsdom.** Radix uses `pointerdown`/`pointerup` interception, not click events. Tests use `defaultOpen` or controlled `open` instead. Visual coverage in Storybook.
2. **Selecting an item auto-closes the menu** (Radix default). For radio-group state changes, tests assert the `onValueChange` callback fires rather than re-querying the DOM after the menu has unmounted.

Submenu open/close (`DropdownMenuSub*`) is also not tested for the same reasons; covered visually in Storybook.

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
| Skeleton + Radix Progress | 175.7 kB | 47.2 kB | 26.0 kB | 3.8 kB | +7.5 kB |
| API decisions (Alert icon slot) | 175.97 kB | 47.28 kB | 26.17 kB | 3.83 kB | +0.07 kB |
| Radix Popover + DropdownMenu | **215.1 kB** | **54.73 kB** | **29.1 kB** | **4.11 kB** | +7.45 kB |

**Pattern confirmed:** the first Radix PR in a primitive family pays a one-time tax for shared internals (`react-portal`, `react-presence`, `react-popper`, `floating-ui`, etc.). Subsequent components in the same family add their behavioral cost only. Per-component cost is **falling**: Popover + DropdownMenu added only +7.45 kB gzipped JS combined despite shipping 18 new component exports — they share overlay internals already paid for by Dialog/Tooltip/Select. Current 54.73 kB gzipped is 🟢 OK against the §8.3 budget (warn at 60).

When the consumer build pipeline is properly set up (named ESM imports + tree-shaking), unused components are excluded. The `dist/` numbers above are the worst-case "import everything" baseline.

---

## 8. Resolved API decisions

Decisions made and recorded here are now binding policy. New components and PRs are reviewed against this section.

### 8.1 Button polymorphism — **Decision: defer; ship a separate `LinkButton` when needed**

`Button` will not expose `asChild` and will not accept an `as` prop in the foreseeable future.

**Why:** Both options leak React-typing complexity into the public API (forwardRef + generic `as` constraints; or Radix's Slot pattern leaking into a component that has no other Radix surface). Neither pays its cost yet — the only known concrete need is "link styled as a button," which is better served by a dedicated `LinkButton` component when it lands.

**Rules:**
- Do not add `asChild` to `Button` without explicit re-decision in this section.
- When the link-as-button use case becomes real, add a separate `LinkButton` component that renders an `<a>` and shares `Button`'s `data-*` styling contract via shared CSS (`.lead-Button` selector).
- Until then, callers wrap an `<a>` themselves and apply the `lead-Button` class manually if absolutely necessary. This is intentionally inconvenient — it discourages the pattern.

### 8.2 Tooltip semantics — **Decision: tooltip as supplemental description only**

A Tooltip in `@leadbank/ui` is **always supplemental**. The user must be able to understand and operate the underlying control without ever seeing the tooltip.

**Why:** Tooltips are unavailable to keyboard-only users on touch devices, often miss in noisy hover environments, and can be hidden by viewport boundaries. Treating a tooltip as the *only* affordance breaks accessibility on every input modality except mouse-on-desktop.

**Rules:**
- ✅ **Use Tooltip for:** extra context on an already-labeled control ("Why is this disabled?", "What does this metric mean?", expanded help on a `?` icon).
- ❌ **Do not use Tooltip for:** the accessible name of an icon-only button (use `aria-label` directly), required-info disclosure (use `FieldDescription`), error messages (use `FieldError`), or content the user must read to understand state.
- Icon-only triggers should set their own `aria-label`. The Tooltip then *describes*, not labels.
- This is enforced by review and convention, not at runtime — Radix supports both modes; Lead's policy is "we use the description mode."

### 8.3 Bundle budget — **Decision: 60 kB / 75 kB / 90 kB gzipped JS thresholds**

Soft budget for `@leadbank/ui` `dist/index.js` gzipped size, measured at every component-introducing PR.

| Threshold | At | Action |
|---|---|---|
| 🟢 OK | < 60 kB | No action; record the new size in §7. |
| 🟡 Warn | 60 kB ≤ size < 75 kB | PR description must include a one-paragraph justification: what the component adds, whether tree-shaking already addresses it, whether a smaller alternative exists. Reviewer scrutinizes. |
| 🟠 Review | 75 kB ≤ size < 90 kB | PR cannot merge without a documented review of the bundle size in `API-CONSISTENCY.md`. The review must consider splitting the package, switching off Radix for that component, or deferring the component. |
| 🔴 Block | ≥ 90 kB | PR cannot merge without an explicit, named approval recorded in this document. |

**Current size:** 47.21 kB gzipped JS (after Skeleton + Progress merge). 🟢 OK with ~13 kB of headroom before the warn threshold.

**Notes:**
- Budget covers the `dist/index.js` "import everything" worst case. Properly tree-shaken consumer builds will be smaller; that does not exempt the budget.
- The thresholds are chosen so the next two Radix overlays (Popover, DropdownMenu) — predicted at +7-15 kB each based on the post-overlay-tax pattern — fit comfortably under the warn line.

### 8.4 Select content width — **Decision: match trigger width by default; never expand silently**

`SelectContent` continues to use `min-width: var(--radix-select-trigger-width)` so the listbox is at least as wide as the trigger. This is the default and only behavior shipped.

**Rules:**
- The listbox **may grow taller** than the trigger to fit available items (Radix handles this).
- The listbox **does not grow wider** than the trigger by default — long labels truncate inside the trigger and inside the items, with `text-overflow: ellipsis` if needed.
- Callers who specifically need a wider listbox (e.g. the trigger is a small icon button) override via `className` on `SelectContent` and accept the visual responsibility. This is intentionally a manual opt-in, not a prop.
- No new `width` prop will be added to `SelectContent` for now. Revisit only if a real product need surfaces.

### 8.5 Alert icon slot — **Decision: caller-supplied `icon?: ReactNode`; no default icons**

`Alert` accepts an optional `icon?: ReactNode` prop. When provided, the icon is rendered in a fixed-size slot (20×20) at the start of the alert with `aria-hidden="true"` so screen readers don't double-announce it alongside the title/description.

**Rules:**
- No variant-default icons ship in `@leadbank/ui`. Lead does not yet have an icon system; shipping defaults would couple `Alert` to a particular library and bloat the package.
- The icon slot is **purely visual**. The role policy (assertive for `warning`/`danger`, polite otherwise) is unchanged.
- `aria-hidden="true"` is set by `Alert` on the slot wrapper, regardless of what the caller passes. Callers should still ensure their icon is itself decorative (e.g. an SVG with `aria-hidden`).
- `data-with-icon` exposes `"true"` / `"false"` for callers who need to adjust surrounding layout.
- Backwards compatible — existing call sites that don't pass an `icon` render identically (apart from a small layout refactor to use a flex row + body column, which preserves visual output).

---

## 8b. Still-open API decisions

These remain open and are tracked as future work.

1. **Variant-color literals in `Badge.css` / `Alert.css`.** Status colors (success-green, warning-amber, danger-red) are currently hard-coded hex. Replace with generated tokens once `lead-design-tokens-cli build` emits the status color group. Mechanical replacement; no API change.

2. **`Field` orientation interaction with `FieldError` placement.** When `Field orientation="horizontal"`, the error renders to the right of the control, which can wrap awkwardly. Decision pending: introduce a `<FieldErrorContainer>` slot below the row, or restrict horizontal orientation to fields without errors?

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

*Last updated: API decisions PR — resolved Button polymorphism, Tooltip semantics, bundle budget, Select width, Alert icon slot.*
