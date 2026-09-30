# Radix → Base UI props mapping: disclosure + toggle family

Scope: accordion, collapsible, tabs, toggle, toggle-group, toolbar.
Sources: radix-ui.com primitives docs + base-ui.com `.md` docs, cross-checked against installed `@base-ui/react@1.6.0` `.d.ts` files (the published docs page for accordion lagged; types are authoritative here).

Conventions that apply to every component below:

- `asChild` (boolean, default `false`) → `render` (`ReactElement | (props: HTMLProps, state) => ReactElement`). Signature changed: instead of a lone child element, pass the element to `render`; Base UI merges props onto it. Button-rendering parts additionally accept `nativeButton` (default `true`), set it to `false` when `render` produces a non-`<button>` element.
- Base UI `className` and `style` also accept a `(state) => value` function form.
- Radix `data-[state=...]` value attributes become Base UI presence attributes (`data-open`, `data-closed`, `data-pressed`, `data-active`).
- Base UI change callbacks all gained a second `eventDetails` argument (`{ reason, event, cancel(), ... }`).
- Radix `dir` props are dropped everywhere; Base UI reads direction from the DOM `dir` attribute / `DirectionProvider`.

---

# accordion

Part mapping: `Root → Root`, `Item → Item`, `Header → Header`, `Trigger → Trigger`, `Content → Panel`.

## Accordion.Root → Accordion.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. Pass element to `render` instead of wrapping a child. |
| `type` (required) | `"single" \| "multiple"` / — | `multiple` | Signature changed. `type="multiple"` → `multiple` (boolean, default `false`); `type="single"` → omit. |
| `value` | `string` (single) or `string[]` (multiple) / — | `value` | Signature changed. Base UI is ALWAYS an array (`Value[]`, `Value = any`), even in single mode: `value="a"` → `value={["a"]}`. |
| `defaultValue` | `string` or `string[]` / — | `defaultValue` | Same array caveat as `value`. |
| `onValueChange` | `(value: string) => void` or `(value: string[]) => void` / — | `onValueChange` | Signature changed: `(value: Value[], eventDetails: Accordion.Root.ChangeEventDetails) => void`. Always receives an array; unwrap `value[0]` for single mode. |
| `collapsible` | `boolean` / `false` | — dropped | Base UI single mode is always collapsible. To forbid closing the last open item (Radix `collapsible={false}` default), control `value` and ignore updates where the array is empty, or call `eventDetails.cancel()` when `value.length === 0`. |
| `disabled` | `boolean` / `false` | `disabled` (default `false`) | Same. |
| `dir` | `"ltr" \| "rtl"` / `"ltr"` | — dropped | Use DOM `dir` attribute / `DirectionProvider`. |
| `orientation` | `"vertical" \| "horizontal"` / `"vertical"` | — dropped (prop exists but deprecated no-op) | Base UI removed roving arrow-key focus per the APG guidance update, so `orientation` (and `loopFocus`) no longer affect keyboard behavior. Do not carry it over. |

## Accordion.Item → Accordion.Item

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `value` (required) | `string` / — | `value` | Renamed constraint: Base UI `value` is `any` and OPTIONAL (auto-generated from index when omitted). Keep passing strings for parity. |
| `disabled` | `boolean` / `false` | `disabled` (default `false`) | Same. |

## Accordion.Header → Accordion.Header

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. Both render `<h3>` by default. |

## Accordion.Trigger → Accordion.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |

## Accordion.Content → Accordion.Panel

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `forceMount` | `true \| undefined` / — | `keepMounted` (boolean, default `false`) | Renamed. `forceMount` → `keepMounted` (closed panel stays in DOM, hidden). Also available on `Root` to apply to all panels. |

## Base UI only props worth knowing

- `Root.hiddenUntilFound` / `Panel.hiddenUntilFound` (default `false`): uses `hidden="until-found"` so browser find-in-page can expand panels; overrides `keepMounted`. No Radix equivalent.
- `Root.keepMounted`: root-level version of the per-panel prop.
- `Item.onOpenChange`: `(open: boolean, eventDetails: Accordion.Item.ChangeEventDetails) => void`, per-item open callback. No Radix equivalent.
- `Trigger.nativeButton` (default `true`).
- `className` / `style` state-function forms on every part.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `Item/Header/Content [data-state="open" \| "closed"]` | `Item`, `Header`: `data-open` (presence); `Panel`: `data-open` (presence) | No `data-closed` on accordion parts (unlike collapsible); style closed state as the absence of `data-open`. |
| `Trigger [data-state="open"]` | `Trigger [data-panel-open]` | Renamed. Trigger specifically uses `data-panel-open`, NOT `data-open`. |
| `[data-disabled]` | `[data-disabled]` | Same (Root, Item, Header, Trigger, Panel). |
| `[data-orientation]` (all parts) | `Root`, `Panel`: `data-orientation` | Deprecated along with orientation; avoid relying on it. |
| — | `Item/Header/Panel [data-index]` | Base UI only: numeric item index. |
| — | `Panel [data-starting-style]`, `[data-ending-style]` | Base UI only: CSS-transition animation hooks (replace Radix mount/unmount animation pattern). |

## CSS var mapping

| Radix | Base UI |
|---|---|
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-accordion-content-width` | `--accordion-panel-width` |

---

# collapsible

Part mapping: `Root → Root`, `Trigger → Trigger`, `Content → Panel`.

## Collapsible.Root → Collapsible.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `defaultOpen` | `boolean` / — | `defaultOpen` (default `false`) | Same. |
| `open` | `boolean` / — | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / — | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Collapsible.Root.ChangeEventDetails) => void`. |
| `disabled` | `boolean` / — | `disabled` (default `false`) | Same. |

## Collapsible.Trigger → Collapsible.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |

## Collapsible.Content → Collapsible.Panel

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `forceMount` | `true \| undefined` / — | `keepMounted` (boolean, default `false`) | Renamed. |

## Base UI only props worth knowing

- `Panel.hiddenUntilFound` (default `false`): find-in-page support via `hidden="until-found"`; overrides `keepMounted`.
- `Trigger.nativeButton` (default `true`).
- `className` / `style` state-function forms.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `Root/Content [data-state="open" \| "closed"]` | `Panel [data-open]` / `[data-closed]` | Renamed to presence attributes. Base UI Root renders a plain `<div>`; state attrs live on Panel/Trigger. |
| `Trigger [data-state="open"]` | `Trigger [data-panel-open]` | Renamed; trigger-specific name. |
| `[data-disabled]` | — (not emitted on collapsible parts) | Gate styles on the `disabled` prop / `:disabled` on the trigger instead. |
| — | `Panel [data-starting-style]`, `[data-ending-style]` | Base UI only: animation hooks. |

## CSS var mapping

| Radix | Base UI |
|---|---|
| `--radix-collapsible-content-height` | `--collapsible-panel-height` |
| `--radix-collapsible-content-width` | `--collapsible-panel-width` |

---

# tabs

Part mapping: `Root → Root`, `List → List`, `Trigger → Tab`, `Content → Panel`. Base UI adds an `Indicator` part with no Radix equivalent.

## Tabs.Root → Tabs.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `defaultValue` | `string` / — | `defaultValue` | Signature changed: Base UI value type is `Tabs.Tab.Value` (`any`), default `0` (first tab active by default; Radix has no default active tab). Strings still work unchanged. |
| `value` | `string` / — | `value` | Same shape for string values; type widened to `any`. |
| `onValueChange` | `(value: string) => void` / — | `onValueChange` | Signature changed: `(value: Tabs.Tab.Value, eventDetails: Tabs.Root.ChangeEventDetails) => void`. |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation` (default `'horizontal'`) | Same. |
| `dir` | `"ltr" \| "rtl"` / — | — dropped | Use DOM `dir` / `DirectionProvider`. |
| `activationMode` | `"automatic" \| "manual"` / `"automatic"` | moved + renamed: `List.activateOnFocus` (boolean, default `false`) | Moved from Root to List and inverted DEFAULT: Radix defaults to automatic, Base UI 1.6.0 defaults to `false` (manual). To preserve Radix default behavior set `<Tabs.List activateOnFocus>`; `activationMode="manual"` → omit. |

## Tabs.List → Tabs.List

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `loop` | `boolean` / `true` | `loopFocus` (default `true`) | Renamed. |

## Tabs.Trigger → Tabs.Tab

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |
| `value` (required) | `string` / — | `value` (required) | Type widened to `Tabs.Tab.Value` (`any`); strings unchanged. |
| `disabled` | `boolean` / `false` | `disabled` | Same. |

## Tabs.Content → Tabs.Panel

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `value` (required) | `string` / — | `value` (required) | Type widened; strings unchanged. |
| `forceMount` | `true \| undefined` / — | `keepMounted` (boolean, default `false`) | Renamed. Hidden panels stay in DOM with `data-hidden`. |

## Base UI only props worth knowing

- `Tabs.Indicator`: new part, a `<span>` that tracks the active tab for sliding-highlight UIs; `renderBeforeHydration` (default `false`) for SSR-flash avoidance. Exposes the `--active-tab-*` CSS vars below.
- `List.activateOnFocus` (see above).
- `Tab.nativeButton`, state-function `className`/`style` on all parts.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `Trigger [data-state="active" \| "inactive"]` | `Tab [data-active]` (presence) | Renamed. Inactive = absence of `data-active`. |
| `Content [data-state="active" \| "inactive"]` | `Panel [data-hidden]` (presence when hidden) | Inverted polarity: Radix marks the active state, Base UI marks the hidden state. |
| `[data-orientation]` (all parts) | `[data-orientation]` (Root, List, Tab, Panel, Indicator) | Same. |
| `Trigger [data-disabled]` | `Tab [data-disabled]` | Same. |
| — | `[data-activation-direction]` (`'left' \| 'right' \| 'up' \| 'down' \| 'none'`, all parts) | Base UI only: direction of the last tab change, useful for directional animations. |
| — | `Panel [data-index]`, `[data-starting-style]`, `[data-ending-style]` | Base UI only. |

## CSS var mapping

Radix Tabs exposes no CSS variables. Base UI only (on `Indicator`): `--active-tab-left`, `--active-tab-right`, `--active-tab-top`, `--active-tab-bottom`, `--active-tab-width`, `--active-tab-height`.

---

# toggle

Part mapping: `Toggle.Root → Toggle` (single-part; Base UI export is directly callable, no `.Root`).

## Toggle.Root → Toggle

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |
| `defaultPressed` | `boolean` / — | `defaultPressed` (default `false`) | Same. |
| `pressed` | `boolean` / — | `pressed` | Same. |
| `onPressedChange` | `(pressed: boolean) => void` / — | `onPressedChange` | Signature changed: `(pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void`. |
| `disabled` | `boolean` / — | `disabled` (default `false`) | Same. |

## Base UI only props worth knowing

- `value?: string`: identifies the toggle inside a Base UI `ToggleGroup` (this replaces Radix `ToggleGroup.Item`'s `value`, see toggle-group below).
- `nativeButton` (default `true`), state-function `className`/`style`.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `[data-state="on" \| "off"]` | `[data-pressed]` (presence) | Renamed. Off = absence of `data-pressed`. |
| `[data-disabled]` | `[data-disabled]` | Same. |

## CSS var mapping

None on either side.

---

# toggle-group

Part mapping: `ToggleGroup.Root → ToggleGroup` (callable single export), `ToggleGroup.Item → Toggle` (Base UI reuses the Toggle primitive as group items).

## ToggleGroup.Root → ToggleGroup

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `type` (required) | `"single" \| "multiple"` / — | `multiple` (boolean, default `false`) | Signature changed, same pattern as accordion. |
| `value` | `string` (single) or `string[]` (multiple) / — | `value` | Signature changed: always `readonly Value[]` (array), even single mode. `value="bold"` → `value={["bold"]}`. |
| `defaultValue` | `string` or `string[]` / — | `defaultValue` | Same array caveat. |
| `onValueChange` | `(value: string) => void` or `(value: string[]) => void` / — | `onValueChange` | Signature changed: `(groupValue: Value[], eventDetails: ToggleGroup.ChangeEventDetails) => void`. Always an array; single mode with nothing pressed = `[]` (Radix single mode signals this as `""`). |
| `disabled` | `boolean` / `false` | `disabled` (default `false`) | Same. |
| `rovingFocus` | `boolean` / `true` | — dropped | Roving focus is always on in Base UI; no opt-out. If you relied on `rovingFocus={false}` (every item tabbable), there is no direct workaround. |
| `orientation` | `"horizontal" \| "vertical"` / `undefined` | `orientation` (default `'horizontal'`) | Same name; Base UI has an explicit default. |
| `dir` | `"ltr" \| "rtl"` / — | — dropped | Use DOM `dir` / `DirectionProvider`. |
| `loop` | `boolean` / `true` | `loopFocus` (default `true`) | Renamed. |

## ToggleGroup.Item → Toggle

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |
| `value` (required) | `string` / — | `value` | Same meaning; on Base UI's `Toggle` it is optional in the type but required in practice for group membership. |
| `disabled` | `boolean` / — | `disabled` (default `false`) | Same. |

Note: the item also gains the full standalone `Toggle` API (`pressed`, `defaultPressed`, `onPressedChange` with `eventDetails`) since it IS the Toggle primitive; inside a group the group value normally drives pressed state.

## Base UI only props worth knowing

- `multiple` (covered above) and the always-array value model.
- Items are plain `Toggle`s, so per-item `onPressedChange` is available.
- State-function `className`/`style`.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `Item [data-state="on" \| "off"]` | `Toggle [data-pressed]` (presence) | Renamed. |
| `Item [data-disabled]` | `Toggle [data-disabled]` | Same. |
| `Root/Item [data-orientation]` | `ToggleGroup [data-orientation]` | On the group only; items (Toggles) do not emit it. |
| — | `ToggleGroup [data-disabled]`, `[data-multiple]` | Base UI only. |

## CSS var mapping

None on either side.

---

# toolbar

Part mapping: `Root → Root`, `Button → Button`, `Link → Link`, `Separator → Separator`. `Toolbar.ToggleGroup`/`Toolbar.ToggleItem` are DROPPED as dedicated parts: compose the standalone `ToggleGroup` with `<Toolbar.Button render={<Toggle />} value="...">` as items (Base UI docs pattern). Base UI adds `Group` and `Input` parts with no Radix equivalent.

## Toolbar.Root → Toolbar.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation` (default `'horizontal'`) | Same. |
| `dir` | `"ltr" \| "rtl"` / — | — dropped | Use DOM `dir` / `DirectionProvider`. |
| `loop` | `boolean` / `true` | `loopFocus` (default `true`) | Renamed. |

## Toolbar.Button → Toolbar.Button

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | Signature changed. |

## Toolbar.Link → Toolbar.Link

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. Both render `<a>`. |

## Toolbar.ToggleGroup → ToggleGroup (standalone, composed)

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `type` (required) | `"single" \| "multiple"` / — | `multiple` (boolean, default `false`) | Moved: use the standalone `ToggleGroup` component inside `Toolbar.Root`; same mapping as toggle-group above. |
| `value` / `defaultValue` | `string` or `string[]` / — | `value` / `defaultValue` on `ToggleGroup` | Always an array (see toggle-group). |
| `onValueChange` | `(value: string \| string[]) => void` / — | `onValueChange` on `ToggleGroup` | `(groupValue: Value[], eventDetails) => void`. |
| `disabled` | `boolean` / `false` | `disabled` on `ToggleGroup` | Same. |

## Toolbar.ToggleItem → Toolbar.Button render={<Toggle />}

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | — | Moved: the composition IS the render prop: `<Toolbar.Button render={<Toggle />} value="bold" />`. Toolbar.Button supplies toolbar focus behavior, Toggle supplies pressed state. |
| `value` (required) | `string` / — | `value` (on the composed element) | Same. |
| `disabled` | `boolean` / — | `disabled` (on `Toolbar.Button`, default `false`) | Same; note `focusableWhenDisabled` defaults to `true` (disabled items stay focusable, Radix disabled items are not). |

## Toolbar.Separator → Toolbar.Separator

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| — | — | `orientation` | Base UI only: defaults to the OPPOSITE of the toolbar's orientation (horizontal toolbar → vertical separator), which matches Radix's automatic behavior; usually omit. |

## Base UI only props worth knowing

- `Root.disabled`: disables the entire toolbar (no Radix equivalent).
- `Toolbar.Group` (new part): groups related items, with a group-level `disabled` (default `false`).
- `Toolbar.Input` (new part): `<input>` wired into toolbar arrow-key navigation; `defaultValue`, `disabled` (default `false`), `focusableWhenDisabled` (default `true`).
- `Button.disabled` (default `false`) + `Button.focusableWhenDisabled` (default `true`): disabled buttons remain focusable for discoverability; set `focusableWhenDisabled={false}` for Radix-like behavior.
- `Button.nativeButton` (default `true`), state-function `className`/`style` on all parts.

## Data-attribute mapping

| Radix | Base UI | Note |
|---|---|---|
| `[data-orientation]` (Root, Button, ToggleGroup, ToggleItem, Separator) | `[data-orientation]` (Root, Button, Link, Input, Group, Separator) | Same; Separator's value is perpendicular to the toolbar. |
| `ToggleItem [data-state="on" \| "off"]` | `[data-pressed]` (presence, from the composed `Toggle`) | Renamed. |
| `ToggleItem [data-disabled]` | `[data-disabled]` (Root, Button, Input, Group) | Same. |
| — | `Button/Input [data-focusable]` | Base UI only: present when focusable-while-disabled. |

## CSS var mapping

None on either side.
