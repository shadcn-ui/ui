# Radix UI to Base UI props mapping: form controls

Scope: select, checkbox, radio-group, switch, slider.
Sources: radix-ui.com primitives docs and base-ui.com `/react/components/*.md` (fetched 2026-07-02).

Global conventions that apply to every part below:

- `asChild` (Radix, `boolean`, default `false`) -> `render` (Base UI, `ReactElement | ((props, state) => ReactElement)`). Every Base UI part accepts `render`, plus `className`/`style` as either plain values or state callbacks (`(state) => ...`).
- Base UI parts that render interactive elements accept `nativeButton` (tells Base UI whether the `render` target is a native `<button>`), which has no Radix equivalent.
- Callbacks fire with a second `eventDetails` argument (`{ reason, event, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, trigger }`). `eventDetails.cancel()` replaces Radix's `event.preventDefault()` pattern for preventing default component behavior.
- Radix `data-state="x"` tokens become presence attributes in Base UI (`data-checked`, `data-unchecked`, `data-open`, ...). Base UI adds Field-integration attributes everywhere (`data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`) and animation attributes (`data-starting-style`, `data-ending-style`).
- Radix `dir` props have no Base UI per-component equivalent, direction comes from `DirectionProvider` (or the `dir` HTML attribute).

---

# select

Part mapping: `Root -> Root`, `Trigger -> Trigger`, `Value -> Value`, `Icon -> Icon`, `Portal -> Portal`, `Content -> Portal > Positioner > Popup` (split into three parts), `Viewport -> List`, `Item -> Item`, `ItemText -> ItemText`, `ItemIndicator -> ItemIndicator`, `ScrollUpButton -> ScrollUpArrow`, `ScrollDownButton -> ScrollDownArrow`, `Group -> Group`, `Label -> GroupLabel` (Base UI's `Select.Label` is a NEW part that labels the trigger, not groups), `Separator -> Separator`, `Arrow -> Arrow`.

## Select.Root → Select.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultValue` | `string`, no default | `defaultValue: Value[] \| Value \| null` | Same name, widened type. Values can be any type (objects supported), arrays for `multiple`. |
| `value` | `string`, no default | `value: Value[] \| Value \| null` | Same name, widened type. `null` means "no value" (placeholder shown). |
| `onValueChange` | `(value: string) => void` | `onValueChange: (value: Value[] \| Value \| null, eventDetails: Select.Root.ChangeEventDetails) => void` | Signature changed: second `eventDetails` arg with `reason` (`'trigger-press' \| 'outside-press' \| 'escape-key' \| 'window-resize' \| 'item-press' \| 'focus-out' \| 'list-navigation' \| 'cancel-open' \| 'none'`) and `cancel()`. |
| `defaultOpen` | `boolean`, no default | `defaultOpen: boolean`, default `false` | Same. |
| `open` | `boolean`, no default | `open: boolean` | Same. |
| `onOpenChange` | `(open: boolean) => void` | `onOpenChange: (open: boolean, eventDetails: Select.Root.ChangeEventDetails) => void` | Signature changed: added `eventDetails` (same reason union as above). Radix Content's `onEscapeKeyDown`/`onPointerDownOutside` interception moves here (check `eventDetails.reason === 'escape-key'` / `'outside-press'`, call `eventDetails.cancel()` to keep open). |
| `dir` | `"ltr" \| "rtl"`, no default | dropped | Use Base UI `DirectionProvider` or the `dir` attribute on an ancestor. |
| `name` | `string`, no default | `name: string` | Same (Base UI renders a hidden `<input>`). |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | Same. |
| `required` | `boolean`, no default | `required: boolean`, default `false` | Same. |

Base UI `Select.Root` renders no HTML element (Radix Root doesn't either).

## Select.Trigger → Select.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | See global conventions. Base UI Trigger renders `<button>` by default; `nativeButton` defaults to `true` here, set it to `false` when rendering a non-button via `render`. |
| (none) | - | `disabled: boolean` | Base UI allows disabling just the trigger. |

## Select.Value → Select.Value

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `placeholder` | `ReactNode`, no default | `placeholder: React.ReactNode` | Same name. Behavior change: Radix `Value` renders the selected Item's `ItemText` content; Base UI renders the raw value string unless you pass `items` on Root or a `children` function (`(value) => ReactNode`). If your item labels differ from values, supply `items` on Root or format via `children`. |

## Select.Icon → Select.Icon

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. Base UI Icon exposes `data-popup-open` for rotate-when-open styling. |

## Select.Portal → Select.Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `container` | `HTMLElement`, default `document.body` | `container: HTMLElement \| ShadowRoot \| React.RefObject<...> \| null` | Same concept, type widened (accepts refs and ShadowRoot). Base UI Portal renders a `<div>` and accepts `className`/`style`/`render`. |

## Select.Content → Select.Portal > Select.Positioner > Select.Popup (moved/split)

Radix `Content` handled positioning, collision, and the panel in one part. In Base UI, positioning props live on `Positioner`, panel/focus props live on `Popup`, dismiss interception lives on `Root.onOpenChange` eventDetails.

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` (on Positioner and/or Popup) | Same pattern. |
| `position` | `"item-aligned" \| "popper"`, default `"item-aligned"` | `alignItemWithTrigger: boolean` on Positioner, default `true` | Signature changed: enum becomes boolean. `"item-aligned"` -> `alignItemWithTrigger` (true, the default), `"popper"` -> `alignItemWithTrigger={false}`. Base UI auto-disables it when space is insufficient or on touch input. |
| `side` | `"top" \| "right" \| "bottom" \| "left"`, default `"bottom"` | `side: Side` on Positioner, default `'bottom'` | Moved. Base UI adds `'inline-start' \| 'inline-end'` logical values. Only applies when `alignItemWithTrigger` is off (as with Radix popper mode). |
| `sideOffset` | `number`, default `0` | `sideOffset: number \| OffsetFunction` on Positioner, default `0` | Moved, type widened (accepts a function of `{ side, align, anchor, positioner }`). |
| `align` | `"start" \| "center" \| "end"`, default `"start"` | `align: Align` on Positioner, default `'center'` | Moved. Default differs: Radix `"start"` vs Base UI `'center'`. Pass `align="start"` explicitly to preserve Radix behavior. |
| `alignOffset` | `number`, default `0` | `alignOffset: number \| OffsetFunction` on Positioner, default `0` | Moved, type widened. |
| `avoidCollisions` | `boolean`, default `true` | `collisionAvoidance: CollisionAvoidance` on Positioner | Signature changed: boolean becomes a config object `{ side: 'flip' \| 'shift' \| 'none', align: 'flip' \| 'shift' \| 'none', fallbackAxisSide: 'start' \| 'end' \| 'none' }`. `avoidCollisions={false}` ~ `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`. |
| `collisionBoundary` | `Boundary`, default `[]` | `collisionBoundary: Boundary` on Positioner, default `'clipping-ancestors'` | Moved, default differs (Radix default is the viewport, Base UI defaults to clipping ancestors). |
| `collisionPadding` | `number \| Padding`, default `10` | `collisionPadding: Padding` on Positioner, default `5` | Moved, default differs (10 -> 5). |
| `arrowPadding` | `number`, default `0` | `arrowPadding: number` on Positioner, default `5` | Moved, default differs (0 -> 5). |
| `sticky` | `"partial" \| "always"`, default `"partial"` | `sticky: boolean` on Positioner, default `false` | Signature changed and semantics differ: Base UI `sticky` keeps the popup in the viewport after the anchor scrolls out of view. There is no `"always"` equivalent. |
| `hideWhenDetached` | `boolean`, default `false` | dropped (workaround) | No prop. Style on `data-anchor-hidden` (present on Positioner when the anchor is hidden), e.g. `[data-anchor-hidden] { visibility: hidden }`. |
| `onCloseAutoFocus` | `(event: Event) => void` | `finalFocus` on Popup | Signature changed: instead of preventing default in an event handler, pass `finalFocus` as `boolean \| RefObject \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null)`. `false` = don't move focus (the `preventDefault()` equivalent), a ref/element = focus that. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | moved to `Root.onOpenChange` | Check `eventDetails.reason === 'escape-key'`; call `eventDetails.cancel()` to prevent close. |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | moved to `Root.onOpenChange` | Check `eventDetails.reason === 'outside-press'`; call `eventDetails.cancel()` to prevent close. |

## Select.Viewport → Select.List (renamed)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Renamed part, no other props on either side. Radix required `<ScrollUpButton>`/`<Viewport>`/`<ScrollDownButton>` as siblings inside Content; in Base UI, `List` and the scroll arrows are children of `Popup`. |

## Select.Item → Select.Item

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. Also `nativeButton` (default `false`, Base UI Item renders a `<div>`). |
| `value` | `string`, required | `value: any`, default `null` | Same name, widened type (objects allowed, see Root `isItemEqualToValue` / `itemToString*`). `null` value marks the placeholder item. |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | Same. |
| `textValue` | `string`, no default | `label: string` | Renamed. Both drive typeahead text matching, defaulting to the item's text content. |

## Select.ItemText → Select.ItemText

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. Note element change: Radix renders `<span>`, Base UI renders `<div>`. |

## Select.ItemIndicator → Select.ItemIndicator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| (implicit conditional mount) | - | `keepMounted: boolean` | Base UI unmounts when unselected by default, same as Radix. `keepMounted` keeps it in the DOM (Radix had no `forceMount` on select's ItemIndicator). |

## Select.ScrollUpButton / ScrollDownButton → Select.ScrollUpArrow / ScrollDownArrow (renamed)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Renamed parts. Base UI adds `keepMounted: boolean` (default `false`) to keep the arrow in the DOM while the popup is not scrollable. Base UI arrows do not render on touch input. |

## Select.Group → Select.Group

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same. |

## Select.Label → Select.GroupLabel (renamed)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Renamed. Do NOT map to Base UI `Select.Label`, which is a new part that labels the select trigger itself (rendered outside the popup). |

## Select.Separator → Select.Separator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same. Base UI adds `orientation: Orientation`, default `'horizontal'`. |

## Select.Arrow → Select.Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `width` | `number`, default `10` | dropped | Size the arrow with CSS; Base UI Arrow renders a `<div>` you fill with your own SVG. |
| `height` | `number`, default `5` | dropped | Same as above. |

## Base UI only props worth knowing (select)

- `Root.multiple: boolean` (default `false`): multi-select with `Value[]` values, no Radix equivalent.
- `Root.items`: `Record<string, ReactNode> | { label, value }[] | Group[]`, lets `Select.Value` render labels instead of raw values.
- `Root.isItemEqualToValue`, `Root.itemToStringLabel`, `Root.itemToStringValue`: object-value support.
- `Root.modal: boolean` (default `true`): scroll lock + outside pointer blocking; Radix select was always modal-ish, set `modal={false}` for non-modal behavior.
- `Root.readOnly`, `Root.autoComplete`, `Root.form`, `Root.inputRef`, `Root.id`, `Root.onOpenChangeComplete`, `Root.actionsRef` (`{ unmount() }` for externally controlled exit animations), `Root.highlightItemOnHover` (default `true`).
- New parts: `Select.Backdrop` (overlay under the popup), `Select.Label` (trigger label), `Popup.finalFocus`.
- `Positioner.anchor`, `Positioner.positionMethod` (`'absolute' | 'fixed'`), `Positioner.disableAnchorTracking`.

## Data-attribute mapping (select)

| Radix | Base UI |
| --- | --- |
| Trigger `data-state="open" \| "closed"` | Trigger `data-popup-open` (presence), plus `data-pressed`, `data-popup-side` |
| Trigger `data-placeholder` | Trigger/Value `data-placeholder` (same) |
| Trigger `data-disabled` | Trigger `data-disabled` (same), plus `data-readonly`, `data-required`, Field attrs |
| Content `data-state="open" \| "closed"` | Positioner/Popup `data-open` / `data-closed` (presence) |
| Content `data-side` (`left/right/bottom/top`) | Positioner/Popup `data-side` (`none/top/bottom/left/right/inline-start/inline-end`) |
| Content `data-align` | Positioner/Popup `data-align` (same values) |
| Item `data-state="checked" \| "unchecked"` | Item `data-selected` (presence, no unchecked token) |
| Item `data-highlighted` | Item `data-highlighted` (same) |
| Item `data-disabled` | Item `data-disabled` (same) |
| (none) | Popup/Backdrop/ItemIndicator/ScrollArrows `data-starting-style` / `data-ending-style` (animation hooks) |
| (none) | Positioner `data-anchor-hidden`, ScrollArrows `data-direction` / `data-visible` |

## CSS variable mapping (select)

All Base UI vars are set on `Select.Positioner` (Radix set them on Content, popper mode only):

| Radix | Base UI |
| --- | --- |
| `--radix-select-trigger-width` | `--anchor-width` |
| `--radix-select-trigger-height` | `--anchor-height` |
| `--radix-select-content-available-width` | `--available-width` |
| `--radix-select-content-available-height` | `--available-height` |
| `--radix-select-content-transform-origin` | `--transform-origin` |

---

# checkbox

Part mapping: `Root -> Root`, `Indicator -> Indicator`. Element change: Radix Root renders a `<button>` plus hidden input inside a form; Base UI Root renders a `<span>` plus hidden `<input>` always (use `nativeButton` + `render` to render a real button).

## Checkbox.Root → Checkbox.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | See global conventions, pair with `nativeButton` when rendering a `<button>`. |
| `defaultChecked` | `boolean \| 'indeterminate'`, no default | `defaultChecked: boolean`, default `false` | Signature changed: `'indeterminate'` is no longer a checked value. Use the separate `indeterminate: boolean` prop. |
| `checked` | `boolean \| 'indeterminate'`, no default | `checked: boolean` + `indeterminate: boolean` | Signature changed: split into two props. Radix `checked="indeterminate"` -> Base UI `indeterminate` (a checkbox can be indeterminate and unchecked/checked independently). |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | `onCheckedChange: (checked: boolean, eventDetails: Checkbox.Root.ChangeEventDetails) => void` | Signature changed: `checked` is always boolean, `eventDetails` added (`reason: 'none'`). Indeterminate transitions are managed by you via the `indeterminate` prop (or `parent` in a CheckboxGroup). |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | Same. |
| `required` | `boolean`, no default | `required: boolean`, default `false` | Same. |
| `name` | `string`, no default | `name: string` | Same. |
| `value` | `string`, default `"on"` | `value: string` | Same name. Radix documents the default as `"on"`; Base UI docs list no default but hidden-input submission matches native checkbox behavior (`"on"` when unset). |

## Checkbox.Indicator → Checkbox.Indicator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `forceMount` | `boolean`, no default | `keepMounted: boolean`, default `false` | Renamed. Both keep the element in the DOM when unchecked (for animation). Base UI also renders the indicator when `indeterminate`. |

## Base UI only props worth knowing (checkbox)

- `Root.indeterminate: boolean` (default `false`): the mixed state, decoupled from `checked`.
- `Root.parent: boolean` + `CheckboxGroup` (new component, `base-ui.com/react/components/checkbox-group`): `<CheckboxGroup value/defaultValue/onValueChange(string[], eventDetails)/allValues/disabled>` provides shared state for a set of checkboxes and enables a parent "select all" checkbox. No Radix equivalent, new capability.
- `Root.readOnly: boolean`, `Root.uncheckedValue: string` (value submitted when unchecked), `Root.form: string`, `Root.inputRef`, `Root.id`, `Root.nativeButton`.

## Data-attribute mapping (checkbox)

| Radix | Base UI |
| --- | --- |
| `data-state="checked"` | `data-checked` |
| `data-state="unchecked"` | `data-unchecked` |
| `data-state="indeterminate"` | `data-indeterminate` |
| `data-disabled` | `data-disabled` (same) |
| (none) | `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused` (Field integration) |
| (none) | Indicator `data-starting-style` / `data-ending-style` |

No CSS variables on either side.

---

# radio-group

Part mapping: Radix ships one `RadioGroup` namespace; Base UI splits it into `RadioGroup` (a single component, no sub-parts) and `Radio` (`Radio.Root`, `Radio.Indicator`). `RadioGroup.Root -> RadioGroup`, `RadioGroup.Item -> Radio.Root`, `RadioGroup.Indicator -> Radio.Indicator`. Element change: Radix Item renders `<button>`; Base UI `Radio.Root` renders `<span>` plus hidden `<input>` (use `nativeButton` + `render` for a real button).

## RadioGroup.Root → RadioGroup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `defaultValue` | `string`, no default | `defaultValue: Value` | Same name, widened type (any value type). |
| `value` | `string`, no default | `value: Value` | Same name, widened type. |
| `onValueChange` | `(value: string) => void` | `onValueChange: (value: Value, eventDetails: RadioGroup.ChangeEventDetails) => void` | Signature changed: added `eventDetails` (`reason: 'none'`). |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | Same. |
| `name` | `string`, no default | `name: string` | Same. |
| `required` | `boolean`, no default | `required: boolean`, default `false` | Same. |
| `orientation` | `enum`, default `undefined` | dropped | Base UI arrow-key navigation handles both axes automatically; there is no orientation prop (set `aria-orientation` yourself if needed for AT). |
| `dir` | `"ltr" \| "rtl"`, no default | dropped | Use `DirectionProvider`. |
| `loop` | `boolean`, default `true` | dropped | Focus wrapping is built in and not configurable. |

## RadioGroup.Item → Radio.Root (moved to Radio namespace)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern, plus `nativeButton` (default `false`). |
| `value` | `string`, required | `value: Value`, required | Same name, widened type. |
| `disabled` | `boolean`, no default | `disabled: boolean` | Same. |
| `required` | `boolean`, no default | `required: boolean` | Same. |

## RadioGroup.Indicator → Radio.Indicator (moved to Radio namespace)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `forceMount` | `boolean`, no default | `keepMounted: boolean`, default `false` | Renamed. |

## Base UI only props worth knowing (radio-group)

- `RadioGroup.readOnly`, `RadioGroup.form`, `RadioGroup.inputRef` (the group owns one hidden input).
- `Radio.Root.readOnly`, `Radio.Root.inputRef`, `Radio.Root.nativeButton`.

## Data-attribute mapping (radio-group)

| Radix | Base UI |
| --- | --- |
| Root `data-disabled` | RadioGroup `data-disabled` (same) |
| Item/Indicator `data-state="checked"` | Radio.Root/Indicator `data-checked` |
| Item/Indicator `data-state="unchecked"` | Radio.Root/Indicator `data-unchecked` |
| Item/Indicator `data-disabled` | `data-disabled` (same) |
| (none) | `data-readonly`, `data-required`, Field attrs (`data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`) |
| (none) | Indicator `data-starting-style` / `data-ending-style` |

No CSS variables on either side.

---

# switch

Part mapping: `Root -> Root`, `Thumb -> Thumb`. Element change: Radix Root renders `<button>` + hidden input in forms; Base UI Root renders `<span>` plus hidden `<input>` always (use `nativeButton` + `render` for a real button).

## Switch.Root → Switch.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern, pair with `nativeButton`. |
| `defaultChecked` | `boolean`, no default | `defaultChecked: boolean`, default `false` | Same. |
| `checked` | `boolean`, no default | `checked: boolean` | Same. |
| `onCheckedChange` | `(checked: boolean) => void` | `onCheckedChange: (checked: boolean, eventDetails: Switch.Root.ChangeEventDetails) => void` | Signature changed: added `eventDetails` (`reason: 'none'`). |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | Same. |
| `required` | `boolean`, no default | `required: boolean`, default `false` | Same. |
| `name` | `string`, no default | `name: string` | Same. |
| `value` | `string`, default `"on"` | `value: string` | Same name. Base UI submits `"on"` by default, matching native checkbox behavior. |

## Switch.Thumb → Switch.Thumb

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern, only prop on either side. |

## Base UI only props worth knowing (switch)

- `Root.readOnly: boolean`, `Root.uncheckedValue: string`, `Root.form: string`, `Root.inputRef`, `Root.id`, `Root.nativeButton` (default `false`).

## Data-attribute mapping (switch)

| Radix | Base UI |
| --- | --- |
| Root/Thumb `data-state="checked"` | `data-checked` |
| Root/Thumb `data-state="unchecked"` | `data-unchecked` |
| Root/Thumb `data-disabled` | `data-disabled` (same) |
| (none) | `data-readonly`, `data-required`, Field attrs (`data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`) |

No CSS variables on either side.

---

# slider

Part mapping: `Root -> Root`, `Track -> Track`, `Range -> Indicator` (renamed), `Thumb -> Thumb`, plus a NEW required `Control` part: Base UI anatomy is `Root > Control > Track > (Indicator, Thumb)`. `Control` is the clickable/draggable surface (Radix Root handled pointer interaction itself). Base UI also adds `Value` and `Label` parts. Element change: Radix Thumb renders a plain element wrapped by an invisible span with a hidden input in forms; Base UI Thumb renders a `<div>` with a nested `<input type="range">`.

## Slider.Root → Slider.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| `defaultValue` | `number[]`, no default | `defaultValue: number \| number[]` | Same name, widened: a single `number` gives a single-thumb slider (no array wrapper needed). |
| `value` | `number[]`, no default | `value: number \| number[]` | Same, widened. Ranged sliders still take an array. |
| `onValueChange` | `(value: number[]) => void` | `onValueChange: (value: number \| number[], eventDetails: Slider.Root.ChangeEventDetails) => void` | Signature changed: value matches the shape you pass in (number for single), `eventDetails` added with `reason: 'input-change' \| 'track-press' \| 'drag' \| 'keyboard' \| 'none'` and `activeThumbIndex: number`. |
| `onValueCommit` | `(value: number[]) => void` | `onValueCommitted: (value: number \| number[], eventDetails: Slider.Root.CommitEventDetails) => void` | Renamed (`Commit` -> `Committed`) and signature changed (same shape/eventDetails notes as above). Base UI does not fire it if the value did not change. |
| `name` | `string`, no default | `name: string` | Same. |
| `disabled` | `boolean`, default `false` | `disabled: boolean`, default `false` | Same. |
| `orientation` | `"horizontal" \| "vertical"`, default `"horizontal"` | `orientation: Orientation`, default `'horizontal'` | Same. |
| `dir` | `"ltr" \| "rtl"`, no default | dropped | Use `DirectionProvider`. |
| `inverted` | `boolean`, default `false` | dropped (workaround) | No equivalent. For horizontal sliders, wrap in `DirectionProvider dir="rtl"` (direction-based inversion); there is no built-in way to invert a vertical slider. |
| `min` | `number`, default `0` | `min: number`, default `0` | Same. |
| `max` | `number`, default `100` | `max: number`, default `100` | Same. |
| `step` | `number`, default `1` | `step: number`, default `1` | Same. |
| `minStepsBetweenThumbs` | `number`, default `0` | `minStepsBetweenValues: number`, default `0` | Renamed (`Thumbs` -> `Values`). |
| `form` | `string`, no default | `form: string` | Same. |

## Slider.Track → Slider.Track (moved inside Control)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. Structural move: Track must now be nested in the new `Slider.Control` part, and `Thumb` moves inside `Track` (Radix had Thumb as a sibling of Track under Root). |

## Slider.Range → Slider.Indicator (renamed)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Renamed part, same role (visualizes the filled portion), still a child of Track. |

## Slider.Thumb → Slider.Thumb

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | Same pattern. |
| (per-thumb accessibility via aria props) | - | `index: number`, `getAriaLabel(index)`, `getAriaValueText(formattedValue, value, index)`, `aria-valuetext` | Base UI thumbs take `index` (required for SSR of multi-thumb range sliders) and a11y formatters. Also `disabled`, `inputRef`, `tabIndex`, `onFocus`/`onBlur`/`onKeyDown` forwarded to the nested `<input type="range">`. |

## (new part) Slider.Control

No Radix equivalent. The interactive surface that receives pointer events; wrap `Track` with it. Props: `className`/`style`/`render` only.

## Base UI only props worth knowing (slider)

- `Root.thumbAlignment: 'center' | 'edge' | 'edge-client-only'` (default `'center'`): whether the thumb center or edge aligns with the control edge at min/max. Radix always behaved like `'edge'`-ish via CSS; Base UI defaults to `'center'`, set `thumbAlignment="edge"` to keep the thumb inside the track bounds.
- `Root.thumbCollisionBehavior: 'push' | 'swap' | 'none'` (default `'push'`): range-slider thumb collision handling (Radix behavior was closest to `'none'`).
- `Root.largeStep: number` (default `10`): Page Up/Down and Shift+Arrow increment.
- `Root.format: Intl.NumberFormatOptions` and `Root.locale: Intl.LocalesArgument`: value formatting for `Slider.Value` and `aria-valuetext`.
- New parts: `Slider.Value` (renders `<output>`, `children: (formattedValues: string[], values: number[]) => ReactNode`), `Slider.Label` (auto-associated label).

## Data-attribute mapping (slider)

| Radix | Base UI |
| --- | --- |
| `data-disabled` (all parts) | `data-disabled` (same, all parts) |
| `data-orientation` (`horizontal/vertical`, all parts) | `data-orientation` (same values, all parts) |
| (none) | `data-dragging` (present on all parts while dragging) |
| (none) | Thumb `data-index` (thumb index in range sliders) |
| (none) | Field attrs on all parts (`data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-focused`) |

No CSS variables on either side (Radix slider positions thumbs via inline styles; Base UI does the same).
