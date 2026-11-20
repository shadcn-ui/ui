# Radix UI → Base UI props migration mapping (overlays)

Components covered: dialog, alert-dialog, popover, tooltip, hover-card (Base UI: preview-card).

Sources: radix-ui.com primitives docs (fetched 2026-07-02) and base-ui.com `/react/components/*.md` endpoints (fetched 2026-07-02).

Global conventions that apply to every component below:

- `asChild` (Radix, every part) → `render` (Base UI, every part). Radix: `asChild?: boolean` merges props onto the single child. Base UI: `render?: ReactElement | ((props: HTMLProps, state: Part.State) => ReactElement)`. For buttons replaced with non-button elements, also set `nativeButton={false}`.
- `onOpenChange` signature changed everywhere. Radix: `(open: boolean) => void`. Base UI: `(open: boolean, eventDetails: X.Root.ChangeEventDetails) => void` where `eventDetails` is `{ reason, event, trigger, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, preventUnmountOnClose() }`.
- Radix per-interaction dismiss callbacks (`onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`) have NO 1:1 Base UI props. They are replaced by `onOpenChange`'s `eventDetails.reason` (`'escape-key'`, `'outside-press'`, `'focus-out'`) + `eventDetails.cancel()` to prevent the close (the equivalent of Radix `event.preventDefault()`).
- `forceMount` (Radix, Portal/Overlay/Content) → `keepMounted` on Base UI `Portal` only (`boolean`, default `false`). For exit animations Base UI does not need it: it holds the popup mounted itself and exposes `data-starting-style` / `data-ending-style`, `onOpenChangeComplete`, and `actionsRef.current.unmount()` for externally-controlled animations.
- Base UI `className` and `style` accept state callbacks (`(state) => ...`) on every rendered part.
- Radix `[data-state="open" | "closed"]` → Base UI presence attributes `data-open` / `data-closed`.

---

# dialog

Part mapping: Root→Root, Trigger→Trigger, Portal→Portal, Overlay→Backdrop, Content→Popup (centered modal: no Positioner), Title→Title, Description→Description, Close→Close.

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base default `false`) | `defaultOpen` | Same. |
| `open` | `boolean` / - | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => void`. Reasons: `'trigger-press' \| 'outside-press' \| 'escape-key' \| 'close-press' \| 'focus-out' \| 'imperative-action' \| 'none'`. |
| `modal` | `boolean` / `true` | `modal` | Widened: `boolean \| 'trap-focus'`, default `true`. `'trap-focus'` traps focus without scroll lock / outside-pointer blocking. |

## Trigger → Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | `render={<MyButton />}`; add `nativeButton={false}` if the rendered element is not a `<button>`. |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | Renamed + inverted intent: `keepMounted?: boolean` (default `false`) keeps the portal in the DOM while hidden. Usually droppable; Base UI keeps the popup mounted during exit animations automatically. |
| `container` | `HTMLElement` / `document.body` | `container` | Same name, wider type: `HTMLElement \| ShadowRoot \| React.RefObject<HTMLElement \| ShadowRoot \| null> \| null`. Note: Base UI Portal renders a `<div>` wrapper (Radix Portal renders nothing extra per child). |

## Overlay → Backdrop

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same pattern. |
| `forceMount` | `boolean` / - | dropped | Backdrop stays mounted through exit animations natively; use `Portal keepMounted` if you need always-mounted DOM. Base-only: `forceRender` (`boolean`, default `false`) forces the backdrop to render even when the dialog is nested. |

## Content → Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same pattern. |
| `forceMount` | `boolean` / - | dropped | See Portal `keepMounted` + `Root actionsRef.unmount()` + `onOpenChangeComplete`. |
| `onOpenAutoFocus` | `(event: Event) => void` / - | moved to Popup `initialFocus` | Signature changed. Radix: prevent via `event.preventDefault()`. Base: `initialFocus?: boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null)`. `false` = don't move focus; ref/element = focus target; function receives `'mouse' \| 'touch' \| 'pen' \| 'keyboard'`. |
| `onCloseAutoFocus` | `(event: Event) => void` / - | moved to Popup `finalFocus` | Same shape as `initialFocus` but for close (`closeType: InteractionType`). |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | `if (eventDetails.reason === 'escape-key') eventDetails.cancel()` replaces `event.preventDefault()`. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | moved to Root `onOpenChange` | Reason `'outside-press'`; cancel with `eventDetails.cancel()`. Declarative shortcut: Root `disablePointerDismissal` (`boolean`, default `false`). |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / - | moved to Root `onOpenChange` | Covers reasons `'outside-press'` and `'focus-out'` (focus-out applies to non-modal dialogs). |

## Title → Title / Description → Description / Close → Close

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` (Title) | `boolean` / `false` | `render` | Base Title renders `<h2>`. |
| `asChild` (Description) | `boolean` / `false` | `render` | Base Description renders `<p>`. |
| `asChild` (Close) | `boolean` / `false` | `render` | Base Close renders `<button>`; `nativeButton` available. |

## Base UI only props worth knowing (dialog)

- Root: `actionsRef` (`RefObject<{ unmount(), close() }>`), `onOpenChangeComplete: (open: boolean) => void`, `disablePointerDismissal`, `modal: 'trap-focus'`, `handle` / `triggerId` / `defaultTriggerId` + `Dialog.createHandle()` (detached and multiple triggers), `children` as payload render function.
- Trigger: `payload`, `handle`, `id`, `nativeButton`.
- Popup: `initialFocus`, `finalFocus`.
- Backdrop: `forceRender`.
- New part: `Viewport` (scrollable positioning container for the popup, useful for outside-scroll dialogs).

## Data attributes (dialog)

| Radix | Base UI | Where |
| --- | --- | --- |
| `[data-state="open"]` | `data-open` | Backdrop, Popup, Viewport (presence attr). |
| `[data-state="closed"]` | `data-closed` | Backdrop, Popup, Viewport. |
| `[data-state]` on Trigger | `data-popup-open` | Trigger (presence attr). |
| - | `data-disabled` | Trigger, Close. |
| - | `data-starting-style` / `data-ending-style` | Backdrop, Popup, Viewport; hooks for enter/exit CSS transitions (replaces Radix animate-on-`data-state` idiom). |
| - | `data-nested`, `data-nested-dialog-open` | Popup, Viewport. |

## CSS variables (dialog)

| Radix | Base UI |
| --- | --- |
| (none documented) | `--nested-dialogs` (`number`, on Popup): count of dialogs nested within. |

---

# alert-dialog

Part mapping: Root→Root, Trigger→Trigger, Portal→Portal, Overlay→Backdrop, Content→Popup, Title→Title, Description→Description, Cancel→Close, Action→NO primitive (render a plain button; close via controlled state, `Root actionsRef.close()`, or reuse `AlertDialog.Close` with action semantics in the wrapper). Base UI AlertDialog is always modal and never closes on outside press by default (no `modal` prop, reasons still include `'outside-press'`/`'focus-out'` in the type but pointer dismissal is disabled by design).

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base default `false`) | `defaultOpen` | Same. |
| `open` | `boolean` / - | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: AlertDialog.Root.ChangeEventDetails) => void`. Same reason union as dialog. |

(Radix AlertDialog.Root has no `modal` prop; Base UI AlertDialog.Root also has none. Parity.)

## Trigger → Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Plus `nativeButton`, `payload`, `handle`, `id`. |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | Same as dialog. |
| `container` | `HTMLElement` / `document.body` | `container` | Same as dialog (wider type, renders a `<div>`). |

## Overlay → Backdrop

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same pattern. |
| `forceMount` | `boolean` / - | dropped | Base-only `forceRender` exists for nested cases. |

## Content → Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same pattern. |
| `forceMount` | `boolean` / - | dropped | See dialog notes. |
| `onOpenAutoFocus` | `(event: Event) => void` / - | moved to Popup `initialFocus` | Same semantics as dialog. Note: Radix alert-dialog focuses `Cancel` by default; Base UI focuses the first tabbable element. To preserve Radix behavior pass `initialFocus={cancelRef}`. |
| `onCloseAutoFocus` | `(event: Event) => void` / - | moved to Popup `finalFocus` | Same as dialog. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | Reason `'escape-key'` + `eventDetails.cancel()`. |

(Radix AlertDialog.Content intentionally has no `onPointerDownOutside`/`onInteractOutside`; nothing to map.)

## Title → Title / Description → Description

Same as dialog: `asChild` → `render`. Title renders `<h2>`, Description renders `<p>`.

## Cancel → Close

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` on `AlertDialog.Close` | Renamed part. `nativeButton` available. Radix's "Cancel receives focus on open" default must be recreated with Popup `initialFocus`. |

## Action → (no primitive)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | dropped | No Base UI part. Wrapper renders a styled `<button>`; close after the action via controlled `open`, `actionsRef.current.close()`, or by composing `AlertDialog.Close` and running the action in `onClick`. |

## Base UI only props worth knowing (alert-dialog)

- Root: `actionsRef`, `onOpenChangeComplete`, `handle` / `triggerId` / `defaultTriggerId` + `AlertDialog.createHandle()`, payload-render `children`.
- Popup: `initialFocus`, `finalFocus`.
- Backdrop: `forceRender`. New part: `Viewport`.

## Data attributes (alert-dialog)

Identical table to dialog: `data-state="open"/"closed"` → `data-open`/`data-closed` (Backdrop, Popup, Viewport); Trigger `data-state` → `data-popup-open`; Base-only `data-disabled` (Trigger, Close), `data-starting-style`, `data-ending-style`, `data-nested`, `data-nested-dialog-open`.

## CSS variables (alert-dialog)

| Radix | Base UI |
| --- | --- |
| (none documented) | `--nested-dialogs` (`number`, on Popup). |

---

# popover

Part mapping: Root→Root, Trigger→Trigger, Anchor→(Positioner `anchor` prop), Portal→Portal, Content→Portal>Positioner>Popup (positioning props move to Positioner; focus/dismiss concerns split between Popup and Root), Close→Close, Arrow→Arrow. Base UI also has Backdrop, Title, Description, Viewport parts with no Radix counterpart.

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base default `false`) | `defaultOpen` | Same. |
| `open` | `boolean` / - | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Popover.Root.ChangeEventDetails) => void`. Reasons add hover/focus: `'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'close-press' \| 'focus-out' \| 'imperative-action' \| 'none'`. |
| `modal` | `boolean` / `false` | `modal` | Widened: `boolean \| 'trap-focus'`, default `false`. When `true`, focus trapping requires a `Popover.Close` inside the Popup (can be `sr-only`). |

## Trigger → Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Plus `nativeButton`. Base-only on Trigger: `openOnHover` (`false`), `delay` (`300`), `closeDelay` (`0`), `payload`, `handle`, `id`. |

## Anchor → Positioner `anchor` prop

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | dropped (part removed) | No Anchor part. Pass `anchor` to Positioner: `Element \| VirtualElement \| React.RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null`. Default anchor is the trigger. |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`, default `false`. |
| `container` | `HTMLElement` / `document.body` | `container` | Wider type (adds ShadowRoot/RefObject); Portal renders a `<div>`. |

## Content → Positioner + Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | Same pattern. |
| `onOpenAutoFocus` | `(event: Event) => void` / - | moved to Popup `initialFocus` | Same shape as dialog (`boolean \| RefObject \| (openType: InteractionType) => ...`). |
| `onCloseAutoFocus` | `(event: Event) => void` / - | moved to Popup `finalFocus` | Same shape. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | Reason `'escape-key'` + `eventDetails.cancel()`. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | moved to Root `onOpenChange` | Reason `'outside-press'` + `eventDetails.cancel()`. |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / - | moved to Root `onOpenChange` | Reason `'focus-out'` + `eventDetails.cancel()`. |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / - | moved to Root `onOpenChange` | Handle both `'outside-press'` and `'focus-out'`. |
| `forceMount` | `boolean` / - | dropped | Use Portal `keepMounted`, `onOpenChangeComplete`, `actionsRef.unmount()`. |
| `side` | `"top" \| "right" \| "bottom" \| "left"` / `"bottom"` | moved to Positioner `side` | Type is `Side` which adds logical values `'inline-start' \| 'inline-end'`. Default `'bottom'` (same). |
| `sideOffset` | `number` / `0` | moved to Positioner `sideOffset` | Widened: `number \| OffsetFunction` where the function receives `{ anchor, positioner, side, align }`. Default `0` (same). |
| `align` | `"start" \| "center" \| "end"` / `"center"` | moved to Positioner `align` | Same values/default. |
| `alignOffset` | `number` / `0` | moved to Positioner `alignOffset` | Widened: `number \| OffsetFunction`. Default `0` (same). |
| `avoidCollisions` | `boolean` / `true` | moved to Positioner `collisionAvoidance` | Signature changed. Radix boolean → Base `CollisionAvoidance` object `{ side?: 'flip' \| 'shift' \| 'none'; align?: 'flip' \| 'shift' \| 'none'; fallbackAxisSide?: 'start' \| 'end' \| 'none' }`. `avoidCollisions={false}` → `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`. |
| `collisionBoundary` | `Boundary (Element \| null \| Array<Element \| null>)` / `[]` | moved to Positioner `collisionBoundary` | Same name; Base `Boundary` defaults to `'clipping-ancestors'` (Radix default = viewport/clipping ancestors via `[]`). |
| `collisionPadding` | `number \| Padding` / `0` | moved to Positioner `collisionPadding` | Same shape; default changes `0` → `5`. |
| `arrowPadding` | `number` / `0` | moved to Positioner `arrowPadding` | Same; default changes `0` → `5`. |
| `sticky` | `"partial" \| "always"` / `"partial"` | dropped (repurposed name) | Radix `sticky` governed alignment-axis sticking; Base equivalent is `collisionAvoidance.align` (`'shift'` ≈ sticky behavior). CAUTION: Base UI Positioner has a `sticky: boolean` (default `false`) prop with a DIFFERENT meaning: keep the popup in the viewport after the anchor scrolls out of view. Do not copy the Radix value across. |
| `hideWhenDetached` | `boolean` / `false` | dropped (with workaround) | Positioner/Popup expose `data-anchor-hidden` when the anchor is hidden; recreate with CSS: `[data-anchor-hidden] { visibility: hidden }` on the Positioner. |

## Close → Close

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Plus `nativeButton`. |

## Arrow → Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Radix renders an `<svg>`; Base renders a `<div>` — supply your own SVG child. |
| `width` | `number` / `10` | dropped | Size the arrow element/SVG via CSS. |
| `height` | `number` / `5` | dropped | Size via CSS. Arrow must be a child of Popup (inside Positioner). |

## Base UI only props worth knowing (popover)

- Root: `actionsRef`, `onOpenChangeComplete`, `handle` / `triggerId` / `defaultTriggerId` + `Popover.createHandle()`, payload-render `children`, `modal: 'trap-focus'`.
- Trigger: `openOnHover` + `delay` + `closeDelay` (hover-open popovers), `payload`, `nativeButton`, `id`.
- Positioner: `positionMethod` (`'absolute' \| 'fixed'`), `disableAnchorTracking`, `anchor`, `collisionAvoidance`.
- Popup: `initialFocus`, `finalFocus`.
- New parts: `Backdrop`, `Title`, `Description`, `Viewport` (animated content swaps between multiple triggers).

## Data attributes (popover)

| Radix (on Content/Trigger/Arrow) | Base UI | Where |
| --- | --- | --- |
| `[data-state="open"/"closed"]` | `data-open` / `data-closed` | Backdrop, Positioner, Popup, Arrow. |
| `[data-state]` on Trigger | `data-popup-open` | Trigger. Base also adds `data-pressed`. |
| `[data-side]` `"left" \| "right" \| "bottom" \| "top"` | `data-side` | Positioner, Popup, Arrow; values extended with `'inline-start' \| 'inline-end'`. |
| `[data-align]` `"start" \| "end" \| "center"` | `data-align` | Positioner, Popup, Arrow. |
| - | `data-starting-style` / `data-ending-style` | Popup, Backdrop (enter/exit animation hooks). |
| - | `data-anchor-hidden` | Positioner (replaces `hideWhenDetached`). |
| - | `data-instant` (`'click' \| 'dismiss' \| 'focus' \| 'trigger-change'`) | Popup. |
| - | `data-uncentered` | Arrow (arrow can't center on anchor). |

## CSS variables (popover)

| Radix (on Content) | Base UI (on Positioner unless noted) |
| --- | --- |
| `--radix-popover-content-transform-origin` | `--transform-origin` |
| `--radix-popover-content-available-width` | `--available-width` |
| `--radix-popover-content-available-height` | `--available-height` |
| `--radix-popover-trigger-width` | `--anchor-width` |
| `--radix-popover-trigger-height` | `--anchor-height` |
| - | `--positioner-width` / `--positioner-height` (Positioner), `--popup-width` / `--popup-height` (Popup, and on Viewport's previous container) |

---

# tooltip

Part mapping: Provider→Provider, Root→Root, Trigger→Trigger, Portal→Portal, Content→Portal>Positioner>Popup, Arrow→Arrow. Delay control moves: Radix `delayDuration` lives on Provider/Root; Base UI open/close delays live on Provider (`delay`/`closeDelay`) and Trigger (`delay`/`closeDelay`).

## Provider → Provider

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `delayDuration` | `number` / `700` | `delay` | Renamed. Base has no documented default on Provider (Trigger default is `600`). |
| `skipDelayDuration` | `number` / `300` | `timeout` | Renamed + semantics kept: another tooltip opens instantly if the previous closed within `timeout` ms. Default `300` → `400`. |
| `disableHoverableContent` | `boolean` / - | dropped at Provider; see Root `disableHoverablePopup` | Base UI equivalent exists only per-Root (renamed). |

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base default `false`) | `defaultOpen` | Same. |
| `open` | `boolean` / - | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: Tooltip.Root.ChangeEventDetails) => void`. Reasons: `'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'disabled' \| 'imperative-action' \| 'none'`. |
| `delayDuration` | `number` / `700` | moved to Trigger `delay` | `number`, default `600`. `closeDelay` (default `0`) is also on Trigger. |
| `disableHoverableContent` | `boolean` / - | `disableHoverablePopup` | Renamed; `boolean`, default `false`. |

## Trigger → Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base-only on Trigger: `delay` (`600`), `closeDelay` (`0`), `closeOnClick` (`true`), `disabled` (`false`), `payload`, `handle`. |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`, default `false`. |
| `container` | `HTMLElement` / `document.body` | `container` | Wider type; renders a `<div>`. |

## Content → Positioner + Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | Same pattern. |
| `aria-label` | `string` / - | dropped (plain DOM attr) | Pass `aria-label` straight through to Popup if needed; no special prop. |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | Reason `'escape-key'` + `eventDetails.cancel()`. |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | moved to Root `onOpenChange` | Reason `'outside-press'` + `eventDetails.cancel()`. |
| `forceMount` | `boolean` / - | dropped | Portal `keepMounted` / `actionsRef.unmount()`. |
| `side` | enum / `"top"` | moved to Positioner `side` | `Side` (adds `'inline-start' \| 'inline-end'`); default `'top'` (same). |
| `sideOffset` | `number` / `0` | moved to Positioner `sideOffset` | `number \| OffsetFunction`; default `0`. |
| `align` | enum / `"center"` | moved to Positioner `align` | Same values/default. |
| `alignOffset` | `number` / `0` | moved to Positioner `alignOffset` | `number \| OffsetFunction`; default `0`. |
| `avoidCollisions` | `boolean` / `true` | moved to Positioner `collisionAvoidance` | Same conversion as popover (`false` → all-`'none'` object). |
| `collisionBoundary` | `Boundary` / `[]` | moved to Positioner `collisionBoundary` | Base default `'clipping-ancestors'`. |
| `collisionPadding` | `number \| Padding` / `0` | moved to Positioner `collisionPadding` | Default `0` → `5`. |
| `arrowPadding` | `number` / `0` | moved to Positioner `arrowPadding` | Default `0` → `5`. |
| `sticky` | `"partial" \| "always"` / `"partial"` | dropped (repurposed name) | Same caveat as popover: Base `sticky: boolean` means "stay in viewport when anchor scrolls away"; alignment sticking is `collisionAvoidance.align`. |
| `hideWhenDetached` | `boolean` / `false` | dropped (with workaround) | Style `[data-anchor-hidden]` on Positioner. |

## Arrow → Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base renders `<div>`; bring your own SVG. |
| `width` | `number` / `10` | dropped | CSS sizing. |
| `height` | `number` / `5` | dropped | CSS sizing. |

## Base UI only props worth knowing (tooltip)

- Root: `trackCursorAxis` (`'none' \| 'x' \| 'y' \| 'both'`, default `'none'`), `disabled`, `disableHoverablePopup`, `actionsRef`, `onOpenChangeComplete`, `handle` / `triggerId` / `defaultTriggerId` + `Tooltip.createHandle()`, payload-render `children`.
- Provider: `closeDelay` (shared close delay, no Radix counterpart).
- Trigger: `closeOnClick`, `disabled`, `delay`, `closeDelay`, `payload`.
- Positioner: `positionMethod`, `disableAnchorTracking`, `anchor`, `collisionAvoidance`.
- New part: `Viewport`.

## Data attributes (tooltip)

| Radix | Base UI | Where |
| --- | --- | --- |
| `[data-state]` `"closed" \| "delayed-open" \| "instant-open"` (Content) | `data-open` / `data-closed` + `data-instant` (`'delay' \| 'dismiss' \| 'focus'`) | Popup, Arrow, Positioner (open/closed). The delayed/instant distinction becomes the `data-instant` value. |
| `[data-state]` (Trigger) | `data-popup-open` | Trigger. Base also adds `data-trigger-disabled`. |
| `[data-side]` | `data-side` | Positioner, Popup, Arrow; adds `'inline-start' \| 'inline-end'`. |
| `[data-align]` | `data-align` | Positioner, Popup, Arrow. |
| - | `data-starting-style` / `data-ending-style` | Popup. |
| - | `data-anchor-hidden` | Positioner. |
| - | `data-uncentered` | Arrow. |

## CSS variables (tooltip)

| Radix (on Content) | Base UI (on Positioner) |
| --- | --- |
| `--radix-tooltip-content-transform-origin` | `--transform-origin` |
| `--radix-tooltip-content-available-width` | `--available-width` |
| `--radix-tooltip-content-available-height` | `--available-height` |
| `--radix-tooltip-trigger-width` | `--anchor-width` |
| `--radix-tooltip-trigger-height` | `--anchor-height` |
| - | `--popup-width` / `--popup-height` (Viewport's previous container). |

---

# hover-card → preview-card

Part mapping: HoverCard.Root→PreviewCard.Root, Trigger→Trigger, Portal→Portal, Content→Portal>Positioner>Popup, Arrow→Arrow. Delays move from Root to Trigger. Both libraries render the trigger as an `<a>` element.

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base default `false`) | `defaultOpen` | Same. |
| `open` | `boolean` / - | `open` | Same. |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | Signature changed: `(open: boolean, eventDetails: PreviewCard.Root.ChangeEventDetails) => void`. Reasons: `'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'imperative-action' \| 'none'`. |
| `openDelay` | `number` / `700` | moved to Trigger `delay` | Renamed + moved; default changes `700` → `600`. |
| `closeDelay` | `number` / `300` | moved to Trigger `closeDelay` | Moved; default `300` (same). |

## Trigger → Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Trigger renders `<a>`; Base-only: `delay` (`600`), `closeDelay` (`300`), `payload`, `handle`. No `nativeButton` (it is a link, not a button). |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`, default `false`. |
| `container` | `HTMLElement` / `document.body` | `container` | Wider type; renders a `<div>`. |

## Content → Positioner + Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | Same pattern. |
| `forceMount` | `boolean` / - | dropped | Portal `keepMounted` / `actionsRef.unmount()` / `onOpenChangeComplete`. |
| `side` | enum / `"bottom"` | moved to Positioner `side` | `Side` (adds `'inline-start' \| 'inline-end'`); default `'bottom'` (same). |
| `sideOffset` | `number` / `0` | moved to Positioner `sideOffset` | `number \| OffsetFunction`; default `0`. |
| `align` | enum / `"center"` | moved to Positioner `align` | Same values/default. |
| `alignOffset` | `number` / `0` | moved to Positioner `alignOffset` | `number \| OffsetFunction`; default `0`. |
| `avoidCollisions` | `boolean` / `true` | moved to Positioner `collisionAvoidance` | Same conversion as popover. |
| `collisionBoundary` | `Boundary` / `[]` | moved to Positioner `collisionBoundary` | Base default `'clipping-ancestors'`. |
| `collisionPadding` | `number \| Padding` / `0` | moved to Positioner `collisionPadding` | Default `0` → `5`. |
| `arrowPadding` | `number` / `0` | moved to Positioner `arrowPadding` | Default `0` → `5`. |
| `sticky` | `"partial" \| "always"` / `"partial"` | dropped (repurposed name) | Same caveat as popover/tooltip. |
| `hideWhenDetached` | `boolean` / `false` | dropped (with workaround) | Style `[data-anchor-hidden]` on Positioner. |

(Radix HoverCard.Content documents no dismiss callbacks; escape/outside dismissal maps to Root `onOpenChange` reasons `'escape-key'` / `'outside-press'` if needed.)

## Arrow → Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base renders `<div>`. |
| `width` | `number` / `10` | dropped | CSS sizing. |
| `height` | `number` / `5` | dropped | CSS sizing. |

## Base UI only props worth knowing (preview-card)

- Root: `actionsRef`, `onOpenChangeComplete`, `handle` / `triggerId` / `defaultTriggerId` + `PreviewCard.createHandle()`, payload-render `children`.
- Trigger: `payload`, `handle`, per-trigger `delay`/`closeDelay`.
- Positioner: `positionMethod`, `disableAnchorTracking`, `anchor`, `collisionAvoidance`.
- New parts: `Backdrop`, `Viewport`.

## Data attributes (preview-card)

| Radix | Base UI | Where |
| --- | --- | --- |
| `[data-state="open"/"closed"]` | `data-open` / `data-closed` | Backdrop, Positioner, Popup, Arrow. |
| `[data-state]` (Trigger) | `data-popup-open` | Trigger. |
| `[data-side]` | `data-side` | Positioner, Popup, Arrow; adds `'inline-start' \| 'inline-end'`. |
| `[data-align]` | `data-align` | Positioner, Popup, Arrow. |
| - | `data-starting-style` / `data-ending-style` | Popup, Backdrop. |
| - | `data-anchor-hidden` | Positioner. |
| - | `data-uncentered` | Arrow. |

## CSS variables (preview-card)

| Radix (on Content) | Base UI (on Positioner) |
| --- | --- |
| `--radix-hover-card-content-transform-origin` | `--transform-origin` |
| `--radix-hover-card-content-available-width` | `--available-width` |
| `--radix-hover-card-content-available-height` | `--available-height` |
| `--radix-hover-card-trigger-width` | `--anchor-width` |
| `--radix-hover-card-trigger-height` | `--anchor-height` |
| - | `--popup-width` / `--popup-height` (Viewport's previous container). |
