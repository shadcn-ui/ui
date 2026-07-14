# Radix → Base UI props mapping: menu family

Sources: radix-ui.com primitives docs (dropdown-menu, context-menu, menubar, navigation-menu) and base-ui.com `/react/components/{menu,context-menu,menubar,navigation-menu}.md`, fetched 2026-07-02.

Part-mapping ground truth (from our wrappers): `Content` → `Portal > Positioner > Popup` (side/sideOffset/align/alignOffset live on `Positioner`); `Label` → `GroupLabel`; `ItemIndicator` → `CheckboxItemIndicator`/`RadioItemIndicator`; `Sub` → `SubmenuRoot`; `SubTrigger` → `SubmenuTrigger`; navigation-menu `Viewport` → `Positioner > Popup > Viewport`, `Indicator` → `Icon`; `asChild` → `render`.

Cross-cutting rules (apply to every part below):

| Radix pattern | Base UI equivalent |
| --- | --- |
| `asChild` (`boolean`, `false`) | `render` (`ReactElement \| ((props: HTMLProps, state) => ReactElement)`). No merge-onto-child boolean; pass the element or a function. |
| `dir` (`"ltr" \| "rtl"`) on roots | Dropped everywhere. Base UI reads direction from `<DirectionProvider>` (`@base-ui-components/react/direction-provider`) or the DOM `dir` attribute. |
| `forceMount` (`boolean`) | `keepMounted` (`boolean`, `false`) on `Portal` / indicator parts. Same use case (animation/SEO), presence is CSS-driven via `data-starting-style` / `data-ending-style` instead of Radix `data-state` + forced mount. |
| `onEscapeKeyDown` / `onPointerDownOutside` / `onFocusOutside` / `onInteractOutside` (content parts) | Dropped as separate props. Use `onOpenChange(open, eventDetails)` on the Root and branch on `eventDetails.reason` (`'escape-key'`, `'outside-press'`, `'focus-out'`, ...). Call `eventDetails.cancel()` to prevent the close (replaces `event.preventDefault()`). |
| `onSelect` on items (`(event: Event) => void`; `event.preventDefault()` keeps menu open) | `onClick` (`(event: BaseUIEvent<React.MouseEvent<HTMLDivElement>>) => void`) plus `closeOnClick` (`boolean`) to control whether the menu closes. |
| `textValue` on items (`string`, typeahead) | `label` (`string`). |
| Controlled callbacks `(value) => void` | All Base UI change callbacks take a second `eventDetails` argument (`{ reason, event, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, trigger }`). |

---

# dropdown-menu (Radix `DropdownMenu` → Base UI `Menu`)

## Root → Menu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / – | `defaultOpen` (`boolean`, `false`) | Same. |
| `open` | `boolean` / – | `open` (`boolean`) | Same. |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Menu.Root.ChangeEventDetails) => void`. `eventDetails.reason` is one of `'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'focus-out' \| 'list-navigation' \| 'escape-key' \| 'item-press' \| 'close-press' \| 'sibling-open' \| 'cancel-open' \| 'imperative-action' \| 'none'`; `eventDetails.cancel()` blocks the state change. |
| `modal` | `boolean` / `true` | `modal` (`boolean`, `true`) | Same. |
| `dir` | `"ltr" \| "rtl"` / – | – | Dropped. Use `DirectionProvider`. |

## Trigger → Menu.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | See cross-cutting rules. When rendering a non-button, also set `nativeButton={false}`. |

## Portal → Menu.Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | Renamed; keeps portal in DOM while hidden. |
| `container` | `HTMLElement` / `document.body` | `container` (`HTMLElement \| ShadowRoot \| React.RefObject<HTMLElement \| ShadowRoot \| null> \| null`) | Same, wider type (accepts refs and ShadowRoot). |

## Content → Menu.Portal > Menu.Positioner > Menu.Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` on `Popup` | See cross-cutting rules. |
| `loop` | `boolean` / `false` | `loopFocus` on **Root** (`boolean`, `true`) | Moved + renamed. Default flips: Base UI loops by default. |
| `onCloseAutoFocus` | `(event: Event) => void` / – | `finalFocus` on **Popup** | Signature changed: `boolean \| React.RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null)` where `InteractionType = 'mouse' \| 'touch' \| 'pen' \| 'keyboard'`. Return `false` to replicate `event.preventDefault()`; return an element to redirect focus. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / – | – | Dropped → `onOpenChange` with `reason === 'escape-key'`. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / – | – | Dropped → `onOpenChange` with `reason === 'outside-press'`. |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / – | – | Dropped → `onOpenChange` with `reason === 'focus-out'`. |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / – | – | Dropped → `onOpenChange` with `reason === 'outside-press' \|\| 'focus-out'`. |
| `forceMount` | `boolean` / – | `keepMounted` on **Portal** | Moved; animate with `data-starting-style`/`data-ending-style`. |
| `side` | `"top" \| "right" \| "bottom" \| "left"` / `"bottom"` | `side` on **Positioner** (`Side`, `'bottom'`) | Moved. Base adds logical values: `Side = 'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-end' \| 'inline-start'`. |
| `sideOffset` | `number` / `0` | `sideOffset` on **Positioner** (`number \| OffsetFunction`, `0`) | Moved; also accepts `(data: { side, align, anchor: {width,height}, positioner: {width,height} }) => number`. |
| `align` | `"start" \| "center" \| "end"` / `"center"` | `align` on **Positioner** (`Align`, `'center'`) | Moved, same values/default. |
| `alignOffset` | `number` / `0` | `alignOffset` on **Positioner** (`number \| OffsetFunction`, `0`) | Moved; also accepts function form. |
| `avoidCollisions` | `boolean` / `true` | `collisionAvoidance` on **Positioner** (`CollisionAvoidance`) | Signature changed: object `{ side?: 'flip' \| 'shift' \| 'none'; align?: 'flip' \| 'shift' \| 'none'; fallbackAxisSide?: 'start' \| 'end' \| 'none' }`. `avoidCollisions={false}` → `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`. |
| `collisionBoundary` | `Element \| null \| Array<Element \| null>` / `[]` | `collisionBoundary` on **Positioner** (`Boundary`, `'clipping-ancestors'`) | Default changes: Radix `[]` means viewport/clipping ancestors; Base default `'clipping-ancestors'` is equivalent. Also accepts an element or rect. |
| `collisionPadding` | `number \| Padding` / `0` | `collisionPadding` on **Positioner** (`Padding`, `5`) | Same shape; default changes 0 → 5. |
| `arrowPadding` | `number` / `0` | `arrowPadding` on **Positioner** (`number`, `5`) | Same; default changes 0 → 5. |
| `sticky` | `"partial" \| "always"` / `"partial"` | – (see note) | Different concept. Radix `sticky` controls align-axis sticking; closest Base knob is `collisionAvoidance.align` (`'shift'` ≈ partial). Base UI's own `sticky` (`boolean`, `false`) instead keeps the popup in the viewport after the anchor scrolls away, which has no Radix equivalent. |
| `hideWhenDetached` | `boolean` / `false` | – | Dropped as behavior prop. Base always exposes `data-anchor-hidden` on Positioner/Popup; hide via CSS: `[data-anchor-hidden] { visibility: hidden }`. |

## Arrow → Menu.Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Arrow renders a `<div>` you fill with an SVG (Radix renders the svg itself). Place inside `Popup`. |
| `width` | `number` / `10` | – | Dropped; size the child SVG/element with CSS. |
| `height` | `number` / `5` | – | Dropped; size with CSS. |

## Item → Menu.Item

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | For links use `Menu.LinkItem` (renders `<a>`) instead of `render`. |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | Same. |
| `onSelect` | `(event: Event) => void` / – | `onClick` (`(event: BaseUIEvent<React.MouseEvent<HTMLDivElement>>) => void`) | Renamed + signature changed. `event.preventDefault()` in `onSelect` (keep open) → `closeOnClick={false}` (`boolean`, default `true` on Item). |
| `textValue` | `string` / – | `label` (`string`) | Renamed. |

## Group → Menu.Group

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same otherwise. |

## Label → Menu.GroupLabel

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Part renamed. Base GroupLabel must be inside a `Group` (it wires `aria-labelledby`); Radix Label could float freely. |

## CheckboxItem → Menu.CheckboxItem

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `checked` | `boolean \| 'indeterminate'` / – | `checked` (`boolean`) | `'indeterminate'` dropped. Base adds `defaultChecked` (`boolean`, `false`) for uncontrolled use. |
| `onCheckedChange` | `(checked: boolean) => void` / – | `onCheckedChange` | Signature changed: `(checked: boolean, eventDetails: Menu.CheckboxItem.ChangeEventDetails) => void`. |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | Same. |
| `onSelect` | `(event: Event) => void` / – | `onClick` + `closeOnClick` | Behavior default flips: Radix closes on select (unless prevented); Base `closeOnClick` defaults to `false` on CheckboxItem. Set `closeOnClick` explicitly to preserve Radix behavior. |
| `textValue` | `string` / – | `label` | Renamed. |

## RadioGroup → Menu.RadioGroup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `value` | `string` / – | `value` (`any`) | Type widens to `any`. Base adds `defaultValue` (`any`) and `disabled` (`boolean`, `false`). |
| `onValueChange` | `(value: string) => void` / – | `onValueChange` | Signature changed: `(value: any, eventDetails: Menu.RadioGroup.ChangeEventDetails) => void`. |

## RadioItem → Menu.RadioItem

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `value`* | `string` / – | `value`* (`any`) | Same (required); type widens. |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | Same. |
| `onSelect` | `(event: Event) => void` / – | `onClick` + `closeOnClick` | `closeOnClick` defaults to `false` on RadioItem (Radix closed by default). |
| `textValue` | `string` / – | `label` | Renamed. |

## ItemIndicator → Menu.CheckboxItemIndicator / Menu.RadioItemIndicator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Part splits: use the indicator matching the parent item type. Renders `<span>`. |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | Renamed. |

## Separator → Menu.Separator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base adds `orientation` (`'horizontal' \| 'vertical'`, `'horizontal'`). |

## Sub → Menu.SubmenuRoot

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / – | `defaultOpen` (`boolean`, `false`) | Same. |
| `open` | `boolean` / – | `open` (`boolean`) | Same. |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Menu.SubmenuRoot.ChangeEventDetails) => void` (same reason union as Root). |

## SubTrigger → Menu.SubmenuTrigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Renders `<div>`; `nativeButton` defaults `false` here. |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | Same. |
| `textValue` | `string` / – | `label` | Renamed. Base adds `openOnHover` / `delay` (`100`) / `closeDelay` (`0`) and `onClick`. |

## SubContent → Menu.Portal > Menu.Positioner > Menu.Popup (inside SubmenuRoot)

Same prop fates as **Content** above; Radix-specific defaults to be aware of: `align` default is `"start"` on SubContent (Base Positioner default is `'center'` — set `align="start"` explicitly if you relied on the Radix default; in practice submenu popups anchor to the trigger item and our wrappers set this). Radix SubContent has no `side` prop (side is implied); Base Positioner accepts `side` (use `'inline-end'` for RTL-aware submenus). All outside/escape callbacks, `forceMount`, `loop`, collision props map identically to Content.

## Base UI only props worth knowing (Menu)

- `Root`: `highlightItemOnHover` (`true`), `actionsRef` (`{ unmount(), close() }`), `onOpenChangeComplete(open)` (fires after close animation; replaces the Radix "wait for animation" dance), `closeParentOnEsc` (`false`), `disabled`, `orientation` (`'vertical'`), detached-trigger machinery: `handle` (`Menu.Handle` via `Menu.createHandle()`), `triggerId`/`defaultTriggerId`, payload-aware `children` render function.
- `Trigger`: `openOnHover`, `delay` (`100`), `closeDelay` (`0`), `payload`, `handle`, `nativeButton` (`true`).
- `Backdrop`: new part, overlay under the popup.
- `Positioner`: `anchor`, `positionMethod` (`'absolute'`), `disableAnchorTracking`, `sticky` (boolean, viewport-keeping).
- `Popup`: `finalFocus`.
- `Viewport`: new part for animating content swaps with multiple/detached triggers.
- `LinkItem`: new part, `<a>`-rendering menu item (`closeOnClick` default `false`).
- All parts: `className`/`style` accept state-callback form `(state) => ...`.

## Data-attribute mapping (dropdown/context/menubar menus)

| Radix | Base UI |
| --- | --- |
| Trigger `[data-state="open" \| "closed"]` | `data-popup-open` (presence) + `data-pressed` |
| Content `[data-state="open" \| "closed"]` | `data-open` / `data-closed` on Positioner and Popup |
| – | `data-starting-style` / `data-ending-style` (CSS transition hooks, replace animating on `data-state`) |
| Content `[data-side="left" \| "right" \| "bottom" \| "top"]` | `data-side` (`'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-end' \| 'inline-start'`) on Positioner/Popup/Arrow |
| Content `[data-align="start" \| "end" \| "center"]` | `data-align` (same values) on Positioner/Popup/Arrow |
| Content/Item `[data-orientation]` | Dropped on menu parts |
| Item `[data-highlighted]` | `data-highlighted` (same) |
| Item `[data-disabled]` | `data-disabled` (same) |
| Checkbox/RadioItem `[data-state="checked" \| "unchecked" \| "indeterminate"]` | `data-checked` / `data-unchecked` presence attrs; no indeterminate |
| ItemIndicator `[data-state]` | `data-checked` / `data-unchecked` + `data-starting-style` / `data-ending-style` on the split indicators |
| SubTrigger `[data-state="open" \| "closed"]` | `data-popup-open` on SubmenuTrigger |
| – | Popup `data-instant` (`'click' \| 'dismiss' \| 'group' \| 'trigger-change'`), Positioner `data-anchor-hidden` |

## CSS variable mapping (per menu flavor: `dropdown-menu` / `context-menu` / `menubar`)

| Radix (on Content/SubContent) | Base UI (on Positioner) |
| --- | --- |
| `--radix-<name>-content-transform-origin` | `--transform-origin` |
| `--radix-<name>-content-available-width` | `--available-width` |
| `--radix-<name>-content-available-height` | `--available-height` |
| `--radix-<name>-trigger-width` | `--anchor-width` |
| `--radix-<name>-trigger-height` | `--anchor-height` |

Base UI Menu.Viewport additionally exposes `--popup-width` / `--popup-height` (previous-content dimensions during transitions).

---

# context-menu (Radix `ContextMenu` → Base UI `ContextMenu`)

Base UI ContextMenu shares the Menu part set: `Root, Trigger, Portal, Backdrop, Positioner, Popup, Arrow, Item, Group, GroupLabel, Separator, SubmenuRoot, SubmenuTrigger, RadioGroup, RadioItem, RadioItemIndicator, CheckboxItem, CheckboxItemIndicator, LinkItem`. Everything not listed below maps exactly as in the dropdown-menu section.

## Root → ContextMenu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `dir` | `"ltr" \| "rtl"` / – | – | Dropped; `DirectionProvider`. |
| `open` | `boolean` / – | `open` (`boolean`) | Same. Base also adds `defaultOpen` (`false`), which Radix ContextMenu lacked. |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: ContextMenu.Root.ChangeEventDetails) => void` (same reason union as Menu). |
| `modal` | `boolean` / `true` | – | **Dropped.** Base UI ContextMenu.Root has no `modal` prop (behavior is fixed). If you relied on `modal={false}`, there is no direct equivalent. |

## Trigger → ContextMenu.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Trigger renders a `<div>` (also handles long-press on touch). |
| `disabled` | `boolean` / `false` | – | **Dropped.** ContextMenu.Trigger has only `className`/`style`/`render`. Workaround: conditionally render content outside the Trigger, or intercept `onContextMenu` with `preventDefault` + `stopPropagation` on a child. |

## Portal → ContextMenu.Portal

Identical mapping to Menu.Portal (`forceMount` → `keepMounted`, `container` widened).

## Content → ContextMenu.Portal > Positioner > Popup

Same fates as dropdown-menu Content for: `asChild`, `loop` (→ Root `loopFocus`), `onCloseAutoFocus` (→ Popup `finalFocus`), `onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside` (→ Root `onOpenChange` reasons), `forceMount` (→ Portal `keepMounted`), `avoidCollisions` (→ `collisionAvoidance`), `collisionBoundary` (default `[]` → `'clipping-ancestors'`), `collisionPadding` (`0` → `5`), `sticky` (dropped, see menu note), `hideWhenDetached` (→ CSS on `data-anchor-hidden`).

Radix-specific deltas:

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `alignOffset` | `number` / `0` | `alignOffset` on Positioner (`number \| OffsetFunction`, `0`) | Radix ContextMenu.Content has no `side`/`sideOffset`/`align` props (anchored to pointer). Base Positioner still accepts `side`/`align`/`sideOffset` but anchors to the pointer position by default; usually leave them off. |
| (no `arrowPadding` on Content) | – | `arrowPadding` (`5`) on Positioner | Available in Base if you add an Arrow. |

## Arrow / Item / Group / Label / CheckboxItem / RadioGroup / RadioItem / ItemIndicator / Separator / Sub / SubTrigger / SubContent

Identical fates to the dropdown-menu section (Label → `GroupLabel`, ItemIndicator → `CheckboxItemIndicator`/`RadioItemIndicator`, Sub → `SubmenuRoot`, SubTrigger → `SubmenuTrigger`, SubContent → `Portal > Positioner > Popup`). Menubar/ContextMenu submenus in Base are the same components with the same props (`onOpenChange` eventDetails, `label`, `onClick`/`closeOnClick`, `keepMounted`).

## Base UI only, data attributes, CSS variables

Same as the Menu lists above; ContextMenu.Root additionally supports `handle` (`MenuHandle<unknown>`), `triggerId`/`defaultTriggerId`, `actionsRef`, `onOpenChangeComplete`, `highlightItemOnHover`, `closeParentOnEsc`, `disabled`, `orientation`. Trigger data attributes: `data-popup-open`, `data-pressed` (replacing Radix Trigger `[data-state]`). CSS vars: `--radix-context-menu-*` → `--transform-origin`/`--available-*`/`--anchor-*` on Positioner.

---

# menubar (Radix `Menubar` → Base UI `Menubar` + `Menu`)

Base UI's menubar module exports a single `<Menubar>` container. Every menu inside it is built from `Menu.*` parts (`Menu.Root`, `Menu.Trigger`, `Menu.Portal`, `Menu.Positioner`, `Menu.Popup`, items, submenus...). So the Radix `Menubar.Menu/Trigger/Portal/Content/...` parts all map to the `Menu` component family from the dropdown-menu section.

## Root → Menubar

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same pattern. |
| `defaultValue` | `string` / – | – | **Dropped.** Base Menubar has no controlled/uncontrolled active-menu value. To pre-open a menu, use `defaultOpen` on that `Menu.Root`. |
| `value` | `string` / – | – | **Dropped.** Control individual `Menu.Root` `open` props instead. |
| `onValueChange` | `(value: string) => void` / – | – | **Dropped.** Listen via each `Menu.Root` `onOpenChange`. |
| `dir` | `"ltr" \| "rtl"` / – | – | Dropped; `DirectionProvider`. |
| `loop` | `boolean` / `false` | `loopFocus` (`boolean`, `true`) | Renamed; default flips to `true`. |

Base UI only on `Menubar`: `modal` (`boolean`, `true`), `disabled` (`boolean`, `false`), `orientation` (`'horizontal' \| 'vertical'`, `'horizontal'`).

## Menu → Menu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | – | Menu.Root renders no element; drop it. |
| `value` | `string` / – | – | Dropped with the Menubar value system (see Root). |

Note: `Menu.Root` inside a Menubar accepts all Menu.Root props (`open`, `defaultOpen`, `onOpenChange(open, eventDetails)`, `modal`, `loopFocus`, `orientation`, `disabled`, ...). Hover-switching between menubar menus is built in.

## Trigger → Menu.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton={false}` for non-buttons) | Radix Menubar.Trigger data attrs `[data-state]`/`[data-highlighted]`/`[data-disabled]` → `data-popup-open`/`data-pressed` (no highlighted state on Base trigger). |

## Portal / Content / Arrow / Item / Group / Label / CheckboxItem / RadioGroup / RadioItem / ItemIndicator / Separator / Sub / SubTrigger / SubContent

All identical to the **dropdown-menu** section (they are literally the same Base UI `Menu` components):

- `Portal.forceMount` → `keepMounted`; `container` widened.
- `Content` (`loop`, `onCloseAutoFocus`, outside/escape callbacks, `forceMount`, `side`/`sideOffset`/`align`/`alignOffset`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `arrowPadding`, `sticky`, `hideWhenDetached`) → `Menu.Portal > Menu.Positioner > Menu.Popup` with the exact fates listed for dropdown-menu Content.
- `SubContent` `align` default `"start"` note applies as in dropdown-menu.
- Items: `onSelect` → `onClick` + `closeOnClick`, `textValue` → `label`.
- Radix Menubar CheckboxItem/RadioItem `[data-state="checked" \| "unchecked"]` → `data-checked`/`data-unchecked`.

## Data attributes / CSS variables

- Menubar container: Radix Root had none; Base `Menubar` exposes `data-orientation` (`'horizontal' \| 'vertical'`), `data-has-submenu-open`, `data-modal`.
- Menu-part attributes and `--radix-menubar-*` CSS vars map exactly as in the dropdown-menu tables (`--transform-origin`, `--available-width/height`, `--anchor-width/height` on `Menu.Positioner`).

---

# navigation-menu (Radix `NavigationMenu` → Base UI `NavigationMenu`)

Base UI parts: `Root, List, Item, Trigger, Icon, Content, Portal, Backdrop, Positioner, Popup, Arrow, Viewport, Link`. Popup positioning is real anchored positioning (like Menu): the shared popup renders as `Portal > Positioner > Popup > Viewport`, and each `Item`'s `Content` is moved into the `Viewport` when active. Radix's "Viewport rendered below the list" model is replaced by this anchored Positioner model (our wrappers removed the `viewport` boolean prop accordingly).

## Root → NavigationMenu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultValue` | `string` / – | `defaultValue` (`Value \| null`, `null`) | Type widens (`Value = any`); `null` = closed. |
| `value` | `string` / – | `value` (`Value \| null`, `null`) | Same; non-nullish = open. |
| `onValueChange` | `(value: string) => void` / – | `onValueChange` | Signature changed: `(value: Value \| null, eventDetails: NavigationMenu.Root.ChangeEventDetails) => void`; reasons: `'trigger-press' \| 'trigger-hover' \| 'outside-press' \| 'list-navigation' \| 'focus-out' \| 'escape-key' \| 'link-press' \| 'none'`. |
| `delayDuration` | `number` / `200` | `delay` (`number`, `50`) | Renamed; default 200 → 50. |
| `skipDelayDuration` | `number` / `300` | – | **Dropped.** No skip-delay window; Base instead has `closeDelay` (`number`, `50`). |
| `dir` | `"ltr" \| "rtl"` / – | – | Dropped; `DirectionProvider`. |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation` (same values/default) | Same. |

Base UI only on Root: `closeDelay` (`50`), `actionsRef` (`{ unmount() }`), `onOpenChangeComplete(open)`. Root renders a `<nav>` element (Radix Root also rendered `<nav>`; Base renders `<div>` when nested).

## Sub → nested NavigationMenu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultValue` / `value` / `onValueChange` / `orientation` | as Root | same props on the nested `Root` | Part dropped: nest a whole `NavigationMenu.Root` (with its own `List`/`Portal`/`Positioner`/`Popup`) inside a `Content`; it renders a `<div>` when nested. Unlike Radix Sub, a nested Base menu is closed by default (`null`), not required to always have an active item. |

## List → NavigationMenu.List

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base List renders `<ul>` (Radix also `<ul>`). Radix `[data-orientation]` attr dropped. |

## Item → NavigationMenu.Item

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Item renders `<li>`. |
| `value` | `string` / – | `value` (`any`) | Same; auto-generated if omitted. |

## Trigger → NavigationMenu.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | `[data-state="open" \| "closed"]` → `data-popup-open`; `[data-disabled]` dropped (no disabled prop either — gate at the item level yourself). |

## Content → NavigationMenu.Content

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / – | – | Dropped → Root `onValueChange` with `reason === 'escape-key'` + `eventDetails.cancel()`. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / – | – | Dropped → `reason === 'outside-press'`. |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / – | – | Dropped → `reason === 'focus-out'`. |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / – | – | Dropped → `'outside-press' \| 'focus-out'`. |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | Renamed, stays on Content (keeps content in DOM while closed, e.g. for SEO/SSR). |

## Link → NavigationMenu.Link

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | For framework links: `render={<NextLink href=... />}`. |
| `active` | `boolean` / `false` | `active` (`boolean`, `false`) | Same (sets `aria-current` + `data-active`). |
| `onSelect` | `(event: Event) => void` / – | – | Dropped. Use `onClick` (plain DOM prop) and `closeOnClick` (`boolean`, `false`) — note Radix closed the menu on link select by default, Base does not; set `closeOnClick` for parity. |

## Indicator → NavigationMenu.Icon (per wrapper ground truth)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Different role: Radix Indicator tracked the active trigger below the List; Base `Icon` is a chevron inside the Trigger (`data-popup-open` when its menu is open). For a popup-anchored pointer, Base's `Arrow` (inside `Popup`, with `data-side`/`data-align`/`data-uncentered`) is the closest visual analogue. There is no Base part that tracks the active trigger along the list. |
| `forceMount` | `boolean` / – | – | Dropped (Icon is always rendered). |
| `[data-state="visible" \| "hidden"]`, `[data-orientation]` | – | – | Dropped; Icon exposes only `data-popup-open`. |

## Viewport → NavigationMenu.Portal > Positioner > Popup > Viewport

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` on each new part | One Radix part becomes four: `Portal` (props: `container`, `keepMounted`), `Positioner` (full anchored-positioning prop set identical to Menu.Positioner: `side`/`sideOffset`/`align`/`alignOffset` (`number \| OffsetFunction`), `anchor`, `collisionAvoidance`, `collisionBoundary` `'clipping-ancestors'`, `collisionPadding` `5`, `arrowPadding` `5`, `sticky` boolean, `positionMethod`, `disableAnchorTracking`), `Popup` (renders `<nav>`), `Viewport` (clips/animates the active `Content`). |
| `forceMount` | `boolean` / – | `keepMounted` on **Portal** | Renamed + moved. |

## Base UI only props worth knowing (NavigationMenu)

- Root: `closeDelay`, `actionsRef`, `onOpenChangeComplete`.
- New parts: `Backdrop`, `Arrow`, `Positioner` (real collision-aware positioning — Radix nav-menu had none), `Icon`.
- `Content.keepMounted` for crawler-visible SSR content.
- `Link.closeOnClick`.
- All parts accept `className`/`style` state-callback forms and `render`.

## Data-attribute mapping (navigation-menu)

| Radix | Base UI |
| --- | --- |
| Root/Sub/List/Item `[data-orientation]` | Dropped. |
| Trigger `[data-state="open" \| "closed"]` | `data-popup-open` on Trigger (and on Icon). |
| Trigger `[data-disabled]` | Dropped. |
| Content `[data-state="open" \| "closed"]` | `data-open` / `data-closed` on Content (also on Positioner/Popup/Backdrop). |
| Content `[data-motion="to-start" \| "to-end" \| "from-start" \| "from-end"]` | `data-activation-direction` (`'left' \| 'right' \| 'up' \| 'down'`) on Content — direction the newly-activated trigger is relative to the previous one; use for enter/exit animations. |
| Link `[data-active]` | `data-active` (same). |
| Indicator `[data-state="visible" \| "hidden"]` | No equivalent (see Indicator row). Arrow exposes `data-open`/`data-closed`/`data-uncentered`/`data-side`/`data-align`. |
| Viewport `[data-state]`, `[data-orientation]` | `data-open`/`data-closed` + `data-starting-style`/`data-ending-style` on Popup/Positioner; Viewport itself exposes none. |
| – | Positioner: `data-anchor-hidden`, `data-instant`; Popup: `data-side`, `data-align`. |

## CSS variable mapping (navigation-menu)

| Radix | Base UI |
| --- | --- |
| `--radix-navigation-menu-viewport-width` (on Viewport) | `--popup-width` (`number`, on **Popup**) — fixed width of the popup; animate `width: var(--popup-width)`. |
| `--radix-navigation-menu-viewport-height` (on Viewport) | `--popup-height` (`number`, on **Popup**). |
| – | Positioner also exposes `--anchor-width`, `--anchor-height`, `--available-width`, `--available-height`, `--positioner-width`, `--positioner-height`, `--transform-origin`. |

---

## Gaps / caveats

- Radix prop descriptions are rendered in JS popovers; types/defaults above were extracted from the pages' embedded type payloads (`(open: boolean) => void`, `(checked: boolean) => void`, `(value: string) => void`, `(event: KeyboardEvent) => void`, `(event: PointerDownOutsideEvent) => void`, `(event: FocusOutsideEvent) => void`, `(event: PointerDownOutsideEvent | FocusOutsideEvent) => void`, `(event: Event) => void` for `onSelect`/`onCloseAutoFocus`, `Boundary = Element | null | Array<Element | null>`, `sticky: "partial" | "always"`, `dir: "ltr" | "rtl"`) — all verified against the fetched HTML.
- Base UI ContextMenu.Root genuinely lacks `modal`; Menubar lacks the value/onValueChange system; ContextMenu.Trigger lacks `disabled`. These are the three hard drops with no one-line workaround.
- Base UI docs fetched from the `.md` endpoints reflect Base UI 1.x (repo currently pins 1.6.0).
