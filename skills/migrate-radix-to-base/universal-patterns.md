# Radix -> Base UI migration mapping

Sources: (1) mechanical diff of the 61 component pairs in
`apps/v4/registry/bases/{radix,base}/ui/` (ground truth, authored by us),
(2) `radix-ui@1.4.3` package exports, (3) base-ui.com docs index for
`@base-ui/react@1.6.0`. Built 2026-07-02 as the knowledge base for the
migration agent's `primitives/` skills.

## Coverage matrix

All radix-ui exports, classified for migration:

| Radix primitive | Base UI target | Class |
|---|---|---|
| Accordion | Accordion | direct (Content->Panel) |
| AlertDialog | Alert Dialog | restructured (Overlay->Backdrop, Content->Popup, Cancel->Close, Action dropped) |
| AspectRatio | none | missing: plain div + CSS `aspect-ratio` (`--ratio` var) |
| Avatar | Avatar | direct |
| Checkbox | Checkbox | direct (cleanest 1:1) |
| Collapsible | Collapsible | direct (Content->Panel) |
| ContextMenu | Context Menu | restructured (menu mapping) |
| Dialog | Dialog | restructured (Overlay->Backdrop, Content->Popup) |
| DropdownMenu | Menu | RENAMED + restructured (canonical menu mapping) |
| Form | Form + Field + Fieldset | restructured (split into three) |
| HoverCard | Preview Card | RENAMED + positioner model |
| Label | none | missing: native `<label>` (Field.Label inside forms) |
| Menubar | Menubar + Menu | restructured (menubar root only; menus delegate to Menu) |
| NavigationMenu | Navigation Menu | heavily restructured (Viewport -> Positioner/Popup/Viewport, Indicator->Icon) |
| Popover | Popover | positioner model (Anchor dropped; verify vs docs) |
| Progress | Progress | restructured (new Track/Label/Value parts, no manual transform) |
| RadioGroup | Radio Group + Radio | restructured (Item -> Radio.Root, two subpath imports) |
| ScrollArea | Scroll Area | direct (Scrollbar/Thumb renames) |
| Select | Select | restructured (Viewport->List, ScrollButtons->ScrollArrows, alignItemWithTrigger) |
| Separator | Separator | direct (callable; `decorative` dropped) |
| Slider | Slider | restructured (Range->Indicator, new Control, thumbAlignment) |
| Switch | Switch | direct (1:1) |
| Tabs | Tabs | direct (Trigger->Tab, Content->Panel) |
| Toast | Toast | restructured (not in our registry pairs; spec from docs; shadcn users mostly use sonner) |
| Toggle | Toggle | direct (callable) |
| ToggleGroup | Toggle Group + Toggle | direct (items use Toggle primitive) |
| Toolbar | Toolbar | direct-ish (not in our pairs; spec from docs) |
| Tooltip | Tooltip | positioner model (delayDuration->delay on Provider) |
| unstable_OneTimePasswordField | OTP Field | from docs (our registry uses input-otp instead) |
| unstable_PasswordToggleField | none | missing: Input + custom toggle |

Utilities:

| Radix utility | Base UI equivalent |
|---|---|
| Slot / asChild | `render` prop; `useRender` + `mergeProps` for the manual Slot idiom |
| Portal | none standalone; per-component `Portal` parts |
| VisuallyHidden | none; `sr-only` class |
| AccessibleIcon | none; aria-label + sr-only text |
| Direction | Direction Provider |

Base UI-only (new capabilities, NOT migration targets): Autocomplete, Combobox,
Input, Number Field, Checkbox Group, Meter, Filter, CSP Provider.

CORRECTION (dry-run finding): Base UI also ships a `Button` primitive
(`@base-ui/react/button`) that supports `render`. A shadcn button.tsx using
the Slot/asChild idiom migrates to `<ButtonPrimitive>` directly, NOT to a
hand-rolled useRender wrapper. useRender + mergeProps remains correct for
non-button polymorphic components (breadcrumb link, marker).

Never touched by migration (third-party on both sides): cmdk (command), vaul*
(drawer; see drawer section: our base drawer moved vaul -> @base-ui/react/drawer),
sonner, input-otp, react-day-picker (calendar), recharts (chart).

## Universal patterns (apply across all components)

### Imports
Radix appears in TWO import forms; both map to the same Base UI subpath:
- Unified package (current shadcn):
  `import { X as XPrimitive } from "radix-ui"` ->
  `import { X as XPrimitive } from "@base-ui/react/<kebab-name>"`.
- Individual packages (legacy/2024-era, e.g. fixture 03):
  `import * as XPrimitive from "@radix-ui/react-<name>"` ->
  `import { X as XPrimitive } from "@base-ui/react/<kebab-name>"`.
  (The namespace `* as` import becomes a named import; remove the individual
  `@radix-ui/react-*` package from package.json.)
One subpath per component either way.
- Types: `React.ComponentProps<typeof XPrimitive.Part>` -> `XPrimitive.Part.Props`.
  Positioner props via `Pick<XPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`.
- Single-part primitives are callable: radix `XPrimitive.Root` -> `XPrimitive`
  (separator, toggle, toggle-group root, radio-group root, menubar root).

### asChild -> render
- `<Primitive.Close asChild><Button/></Primitive.Close>` ->
  `<Primitive.Close render={<Button/>}>...</Primitive.Close>`.
- Manual Slot idiom (`const Comp = asChild ? Slot.Root : "a"`) ->
  `useRender` + `mergeProps` from `@base-ui/react/use-render` /
  `@base-ui/react/merge-props`; prop type `useRender.ComponentProps<"a">`.

### Portal / positioning model (biggest structural change)
- Radix: `Portal > Content`, positioning props on Content.
- Base UI: `Portal > Positioner > Popup`. `side`, `sideOffset`, `align`,
  `alignOffset` (and select's `alignItemWithTrigger`) move to Positioner;
  Popup is the styled box. Positioner conventionally gets `isolate z-50`.
- `Overlay` -> `Backdrop` (dialogs, sheets, drawers). Centered modals
  (dialog/alert-dialog) use Popup WITHOUT a Positioner.

### Data attributes / class hooks
- `data-[state=open]` -> `data-open`; `data-[state=closed]` -> `data-closed`.
- Enter/exit animations: `data-[state=open]:animate-in` /
  `data-[state=closed]:animate-out` -> `data-starting-style:*` /
  `data-ending-style:*` (transition-based, not keyframes).
- New Base UI hook: `data-popup-open` (open-submenu/trigger marker).
- Some triggers gain `aria-disabled:*` variants alongside `disabled:*`
  (accordion, tabs).

### CSS custom properties
- `--radix-<comp>-content-transform-origin` -> `--transform-origin`
- `--radix-<comp>-content-available-height` -> `--available-height`
- `--radix-<comp>-trigger-width` -> `--anchor-width`
- `--radix-accordion-content-height` -> `--accordion-panel-height`
- nav-menu `--radix-navigation-menu-viewport-height/width` ->
  `--positioner-height/width`, `--popup-height/width`, `--available-width`

### Props
- Tooltip Provider: `delayDuration` -> `delay`.
- Select: `position="popper"|"item-aligned"` -> `alignItemWithTrigger` boolean.
- Slider: gains `thumbAlignment` ("edge"); `Range` -> `Indicator` + new `Control`.
- Navigation Menu: `viewport` boolean dropped; `align` forwarded to Positioner.
- `value` / `defaultValue` / `onOpenChange` signatures pass through unchanged at
  the wrapper level (verify per-primitive callback signatures against docs when
  authoring specs; wrappers do not exercise them all).

## Part-rename quick reference

| radix part | Base UI part |
|---|---|
| `*.Root` (single-part comps) | callable `*Primitive` |
| `Overlay` | `Backdrop` |
| `Content` (overlay comps) | `Popup` (inside `Positioner`) |
| `Content` (accordion/collapsible/tabs) | `Panel` |
| tabs `Trigger` | `Tab` |
| menu `Label` | `GroupLabel` |
| menu `ItemIndicator` | `CheckboxItemIndicator` / `RadioItemIndicator` |
| `Sub` / `SubTrigger` | `SubmenuRoot` / `SubmenuTrigger` |
| slider `Range` | `Indicator` (+ new `Control`) |
| select `Viewport` | `List` |
| select `ScrollUp/DownButton` | `ScrollUp/DownArrow` |
| scroll-area `ScrollAreaScrollbar` / `ScrollAreaThumb` | `Scrollbar` / `Thumb` |
| nav-menu `Indicator` | `Icon` |
| nav-menu `Viewport` | `Positioner > Popup > Viewport` |
| hover-card `HoverCard*` | `PreviewCard*` |
| radio-group `Item` / `Indicator` | `Radio.Root` / `Radio.Indicator` |
| popover `Anchor` | dropped (verify against docs) |
| alert-dialog `Cancel` / `Action` | `Close` / dropped (plain Button) |
| separator `decorative` prop | dropped |
| Label primitive | native `<label>` |

## Per-component notes

### accordion
Root/Item/Header/Trigger same; Content -> Panel. Trigger `disabled:*` ->
`aria-disabled:*`. Height var -> `--accordion-panel-height`; add
`data-starting-style:h-0 data-ending-style:h-0`.

### dialog / alert-dialog / sheet
Overlay -> Backdrop, Content -> Popup, Close kept (`asChild` -> `render`).
Alert-dialog: Cancel -> Close; Action has no primitive (plain Button).
Sheet: slide animations rewritten from animate-in/out to
`data-starting-style` / `data-ending-style` with explicit translate per
`data-[side=...]`. Centered modals: no Positioner.

### drawer (vaul -> Base UI) — OPT-IN ONLY, not part of a radix migration
Vaul is NOT radix: during a radix -> base-ui migration, leave drawer.tsx
untouched and report it (hard rule in SKILL.md). This mapping exists only for
when the user EXPLICITLY asks to also move their drawer off vaul.
Root gains `modal`, `snapPoints`, `swipeDirection` (default "down"),
`showSwipeHandle`. Content (single) -> `Viewport > Popup > Content`.
`data-[vaul-drawer-direction=...]` -> `data-[swipe-direction=...]` /
`data-[swipe-axis=...]` + `--drawer-*` vars. New SwipeHandle part and a
context provider in our wrapper. This is a vaul migration, not radix.

### popover / tooltip / hover-card
Portal > Positioner > Popup. Popover: Anchor dropped, Title is now a real
primitive part. Tooltip: Provider `delayDuration` -> `delay`; Content gains
side/align/alignOffset; default sideOffset 0 -> 4; Arrow gets explicit
per-side positioning classes. HoverCard: primitive renamed PreviewCard
(public wrapper names stay HoverCard*).

### menus (dropdown-menu -> Menu; context-menu; menubar)
Canonical mapping: Label -> GroupLabel, ItemIndicator ->
CheckboxItemIndicator/RadioItemIndicator, Sub -> SubmenuRoot, SubTrigger ->
SubmenuTrigger, Content -> Portal > Positioner > Popup, SubContent rebuilt
from the Content component. Content hoists align/alignOffset/side/sideOffset.
SubTrigger open marker: `data-popup-open`. Context-menu has its own subpath
(`@base-ui/react/context-menu`), same anatomy. Menubar: only the root and
checkbox/radio items are menubar/menu primitives; everything else delegates
to the Menu wrappers (radix Menubar.Menu -> Menu.Root).

### select
Label -> GroupLabel, Viewport -> List, ScrollUp/DownButton ->
ScrollUp/DownArrow. Icon/ItemIndicator go `asChild` -> `render`.
`position` -> `alignItemWithTrigger` (default true) on Positioner. Vars ->
`--available-height` / `--anchor-width` / `--transform-origin`.

### form controls
Checkbox: 1:1. Switch: 1:1. Radio group: group from
`@base-ui/react/radio-group` (callable), items from `@base-ui/react/radio`
(`Radio.Root` + `Radio.Indicator`). Slider: `Root > Control > Track >
Indicator` + Thumbs, `thumbAlignment="edge"`; layout classes move Root ->
Control. Toggle/toggle-group: callable primitives; group items reuse Toggle.

### tabs / collapsible / progress / separator / scroll-area / label
Tabs: Trigger -> Tab, Content -> Panel, `aria-disabled:*` added. Collapsible:
Content -> Panel. Progress: new Track/Label/Value parts; primitive computes
fill (drop the manual translateX). Separator: callable, `decorative` dropped.
Scroll-area: Scrollbar/Thumb renames only. Label: no primitive; native
`<label>`.

### navigation-menu
Viewport moves out of Root into `Portal > Positioner > Popup > Viewport`
(our NavigationMenuPositioner). Indicator -> Icon. `viewport` boolean prop
removed; `align` forwarded to Positioner. New `data-instant`,
`data-activation-direction` hooks; vars -> `--positioner-height/width`,
`--popup-height/width`.

### breadcrumb / marker (Slot users)
`Slot.Root` + `asChild` -> `useRender` + `mergeProps`
(`useRender.ComponentProps<"a">`, `render` prop, `state.slot`).

## Doc-validation TODOs (before specs are final)

1. Popover Anchor: confirm Base UI has no anchor equivalent (Positioner may
   accept an `anchor` prop; our wrapper simply dropped the part).
2. Callback signatures: radix `onOpenChange(open)` vs Base UI
   `onOpenChange(open, event, reason)` style differences; wrappers pass
   through so the pair diff cannot see them. Check per primitive.
3. Toast, Toolbar, Form/Field/Fieldset, OTP Field: not covered by our pairs;
   author these specs from docs alone.
4. Controlled-prop names on menus/select (`open`, `value`, `highlighted`)
   and any `defaultChecked`/`checked` nuances.
5. Focus/dismissal behavior knobs (`onInteractOutside`, `onEscapeKeyDown` ->
   Base UI equivalents) which our wrappers do not surface.

## Slot -> useRender: WORKED EXAMPLE (avoid the mergeProps pitfall)

Radix:
```tsx
import { Slot } from "radix-ui"
function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return <Comp data-slot="breadcrumb-link" className={cn("...", className)} {...props} />
}
```

Base UI:
```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      // PITFALL: data-* attributes fail excess-property checking when passed
      // as an object literal into mergeProps (they are only special-cased in
      // JSX). Cast the literal:
      { "data-slot": "breadcrumb-link", className: cn("...", className) } as React.ComponentProps<"a">,
      props
    ),
  })
}
```

Two rules:
1. This pattern is ONLY for non-button polymorphic components (breadcrumb
   link, marker, badge, item...). `button.tsx` migrates to the real
   `@base-ui/react/button` primitive, which accepts `render` natively.
2. Always cast object literals containing `data-*` keys passed to
   `mergeProps` (`as React.ComponentProps<"tag">`), or tsc fails on every one.

## Positioner props: Pick means FORWARD

When a wrapper exposes positioning props via
`Pick<XPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`,
you MUST destructure each of those props in the wrapper and pass them to
`<XPrimitive.Positioner>` explicitly. If you forget, they fall through
`...props` onto the Popup (wrong DOM node) and positioning silently breaks.
No JSX-level type error catches this; only the wrapper's own destructuring
discipline and a browser check do. Checklist per overlay wrapper:
declare -> destructure -> forward. All three, every time.
