# Radix UI → Base UI props mapping: progress, scroll-area, separator, avatar, toast, form

Sources: radix-ui/website `data/primitives/docs/components/*.mdx` (full inline prop tables) and base-ui.com `/react/components/{progress,scroll-area,separator,avatar,toast,form,field,fieldset}.md` (fetched 2026-07-02, `@base-ui/react`, formerly `@base-ui-components/react`).

Universal conventions (apply to every part below, not repeated per table):

- `asChild` (boolean) → `render` (`ReactElement | ((props: HTMLProps, state) => ReactElement)`). Signature changed: `<Part asChild><a/></Part>` → `<Part render={<a/>} />`.
- Base UI `className` and `style` also accept a function of the part's `State` object.
- Every Base part exposes `Part.Props` and `Part.State` types (e.g. `Progress.Root.Props`).

---

# progress

Part mapping: `Progress.Root` → `Progress.Root`, `Progress.Indicator` → `Progress.Indicator` (now MUST be nested in the new `Progress.Track`). Base UI adds `Track`, `Label`, `Value` parts. The primitive computes the Indicator fill width itself (inline style), so the Radix pattern `style={{ transform: translateX(-(100 - value)%) }}` on Indicator is deleted, not ported.

## Progress.Root → Progress.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed (see header). |
| `value` | `number \| null` / - | `value` | Same. Required in Base UI (default `null`). `null` = indeterminate in both. |
| `max` | `number` / - | `max` | Same. Base UI default `100`; Base UI also adds `min` (default `0`). |
| `getValueLabel` | `(value: number, max: number) => string` / - | `getAriaValueText` | Renamed + signature changed: Base UI is `(formattedValue: string \| null, value: number \| null) => string`. Percent math is gone; use `format`/`locale` for formatting instead. |

## Progress.Indicator → Progress.Indicator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop. Nest inside `Progress.Track`; width is set by the primitive. |

### Base UI only props worth knowing

- Root: `min` (`0`), `format` (`Intl.NumberFormatOptions`), `locale` (`Intl.LocalesArgument`), `aria-valuetext`.
- New parts: `Progress.Track` (contains Indicator), `Progress.Label` (accessible label, `<span>`), `Progress.Value` (formatted value text, `<span>`, `children` render fn `(formattedValue, value) => ReactNode`).

### Data attributes

| Radix | Base UI |
| --- | --- |
| `[data-state="loading"]` | `[data-progressing]` (boolean-presence attrs replace the enum) |
| `[data-state="complete"]` | `[data-complete]` |
| `[data-state="indeterminate"]` | `[data-indeterminate]` |
| `[data-value]`, `[data-max]` | Dropped. Read `value` in a `className`/`style` state function or set your own attribute. |

All Base attrs are present on Root, Track, Indicator, Label, and Value alike. State type: `{ status: 'indeterminate' | 'progressing' | 'complete' }`.

### CSS variables

None on either side.

---

# scroll-area

Part mapping: `ScrollArea.Root` → `ScrollArea.Root`, `ScrollArea.Viewport` → `ScrollArea.Viewport`, `ScrollAreaScrollbar` → `ScrollArea.Scrollbar`, `ScrollAreaThumb` → `ScrollArea.Thumb`, `ScrollArea.Corner` → `ScrollArea.Corner`. Base UI adds `ScrollArea.Content` (wraps content inside Viewport, needed for horizontal overflow measurement).

## ScrollArea.Root → ScrollArea.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `type` | `"auto" \| "always" \| "scroll" \| "hover"` / `"hover"` | Dropped | Visibility is CSS-driven: style Scrollbar `opacity` against `[data-hovering]`/`[data-scrolling]` (hover/scroll behavior), or always-visible CSS for `"always"` (+ `keepMounted` on Scrollbar). `"auto"` is the default mount behavior (scrollbar only mounts when scrollable). |
| `scrollHideDelay` | `number` / `600` | Dropped | Reproduce with a CSS `transition-delay` on the scrollbar's opacity transition. |
| `dir` | `"ltr" \| "rtl"` / - | Dropped | Base UI reads direction from the DOM (`dir` attribute) / its DirectionProvider utility; no per-component prop. |
| `nonce` | `string` / - | Dropped | No documented CSP nonce equivalent. |

## ScrollArea.Viewport → ScrollArea.Viewport

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Same part role (the scrollable container). Wrap children in `ScrollArea.Content` when horizontal scrolling matters. |

## ScrollAreaScrollbar → ScrollArea.Scrollbar

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `forceMount` | `boolean` / - | `keepMounted` | Renamed; `boolean`, default `false`. Keeps the element in the DOM when the viewport is not scrollable. |
| `orientation` | `"horizontal" \| "vertical"` / `"vertical"` | `orientation` | Same, same default. |

## ScrollAreaThumb → ScrollArea.Thumb

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop on both sides. |

## ScrollArea.Corner → ScrollArea.Corner

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop on both sides. |

### Base UI only props worth knowing

- Root: `overflowEdgeThreshold` (`number | Partial<{ xStart; xEnd; yStart; yEnd }>`, default `0`), threshold before the overflow edge attributes flip.
- New part: `ScrollArea.Content` (div inside Viewport; same overflow data attributes as Root).

### Data attributes

| Radix | Base UI |
| --- | --- |
| Scrollbar `[data-state="visible" \| "hidden"]` | Dropped. Use `[data-hovering]`, `[data-scrolling]`, and `[data-has-overflow-x/y]` on Scrollbar to drive visibility styles. |
| Scrollbar/Thumb `[data-orientation]` | Same (`data-orientation` on Scrollbar and Thumb). |
| - | New, on Root/Content/Viewport/Scrollbar: `data-has-overflow-x`, `data-has-overflow-y`, `data-overflow-x-start/end`, `data-overflow-y-start/end`, `data-scrolling`; Scrollbar also `data-hovering`. |

### CSS variables

Radix's scroll-area docs list no CSS variables (its implementation ships undocumented `--radix-scroll-area-thumb-*`/`corner-*` vars). Base UI documents:

| Base UI variable | Where |
| --- | --- |
| `--scroll-area-corner-width`, `--scroll-area-corner-height` | Root |
| `--scroll-area-thumb-width`, `--scroll-area-thumb-height` | Scrollbar |
| `--scroll-area-overflow-x-start/end`, `--scroll-area-overflow-y-start/end` | Viewport (pixel distance from each edge, great for scroll fades) |

---

# separator

Part mapping: `Separator.Root` → `Separator` (callable single part, no `.Root`).

## Separator.Root → Separator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation` | Same, same default (`Orientation` type). |
| `decorative` | `boolean` / - | Dropped | Base UI's separator is always semantic (`role="separator"`). For a purely visual rule, render a plain `<div aria-hidden="true">` or use a CSS border instead. |

### Base UI only props worth knowing

None beyond the universal `className`/`style`/`render`. Renders a `<div>`.

### Data attributes

`[data-orientation]` with values `horizontal | vertical`: identical on both sides.

### CSS variables

None on either side.

---

# avatar

Part mapping: `Avatar.Root` → `Avatar.Root`, `Avatar.Image` → `Avatar.Image`, `Avatar.Fallback` → `Avatar.Fallback`. Same anatomy. Base Root renders `<span>`, Image `<img>`, Fallback `<span>`.

## Avatar.Root → Avatar.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop on both sides. Base Root can also take plain children (e.g. initials) with no Image/Fallback. |

## Avatar.Image → Avatar.Image

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `onLoadingStatusChange` | `(status: "idle" \| "loading" \| "loaded" \| "error") => void` / - | `onLoadingStatusChange` | Same name, same `ImageLoadingStatus` union. |

## Avatar.Fallback → Avatar.Fallback

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `delayMs` | `number` / - | `delay` | Renamed, same meaning (ms to wait before showing the fallback). |

### Base UI only props worth knowing

Nothing beyond the universal trio. Part `State` exposes `imageLoadingStatus` (and `transitionStatus` on Image) for `className`/`style` functions.

### Data attributes

Radix documents none. Base UI Image adds `data-starting-style` / `data-ending-style` for enter/exit transitions.

### CSS variables

None on either side.

---

# toast

The mental model changes completely: Radix toast is declarative (you render `<Toast.Root open>` yourself), Base UI toast is manager-driven. Toasts are created imperatively via `Toast.useToastManager().add({ title, description, ... })` (or a global `Toast.createToastManager()` passed to `Provider toastManager`), and you render `useToastManager().toasts.map((toast) => <Toast.Root key={toast.id} toast={toast} />)` inside the Viewport.

Part mapping:

| Radix part | Base UI part |
| --- | --- |
| `Toast.Provider` | `Toast.Provider` (props differ heavily) |
| `Toast.Viewport` | `Toast.Portal` + `Toast.Viewport` (Portal is new; appends to `<body>` by default) |
| `Toast.Root` | `Toast.Root` (requires `toast` object; typically wraps new `Toast.Content`) |
| `Toast.Title` | `Toast.Title` (renders `<h2>`) |
| `Toast.Description` | `Toast.Description` (renders `<p>`) |
| `Toast.Action` | `Toast.Action` (rendered per-toast; props can come from `toast.actionProps`) |
| `Toast.Close` | `Toast.Close` |
| - | New: `Toast.Content`, `Toast.Positioner` + `Toast.Arrow` (anchored toasts), `Toast.createToastManager`, `Toast.useToastManager` |

## Toast.Provider → Toast.Provider

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `duration` | `number` / `5000` | `timeout` | Renamed. Same default (`5000`, `0` disables auto-dismiss). Per-toast override moved to `add({ timeout })`. |
| `label` (required) | `string` / `"Notification"` | Dropped | Base UI handles screen reader announcements internally; per-toast urgency via `priority: 'low' \| 'high'` in `add()`. |
| `swipeDirection` | `"right" \| "left" \| "up" \| "down"` / `"right"` | Moved | Now `swipeDirection` on `Toast.Root`; accepts a single value or an array, default `['down', 'right']`. |
| `swipeThreshold` | `number` / `50` | Dropped | Not configurable. Opt elements out of swipe with the `data-base-ui-swipe-ignore` attribute. |
| `announcerContainer` | `Element \| DocumentFragment` / `document.body` | Dropped | Closest analog is `Toast.Portal container` for where the viewport renders. |

## Toast.Viewport → Toast.Portal + Toast.Viewport

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | On both Portal and Viewport. |
| `hotkey` | `string[]` / `["F8"]` | Dropped | Base UI hard-wires F6 to focus the viewport landmark; not configurable. |
| `label` | `string` / `"Notifications ({hotkey})"` | Dropped | Landmark labelling handled internally. |

Base UI only: `Portal.container` (`HTMLElement | ShadowRoot | ref | null`).

## Toast.Root → Toast.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `type` | `"foreground" \| "background"` / `"foreground"` | `priority` in `add()` options | Moved + renamed: `foreground` ≈ `priority: 'high'` (announced urgently), `background` ≈ `'low'` (default). Careful: Base UI's `toast.type` is a different concept (a free-form styling category like `'success'`, surfaced as `data-type`). |
| `duration` | `number` / - | `timeout` in `add()` options | Moved + renamed; per-toast override of Provider `timeout`. |
| `defaultOpen` | `boolean` / `true` | Dropped | Open state lives in the manager. Create with `add()`, remove with `close(id)`. |
| `open` | `boolean` / - | Dropped | Same as above; there is no controlled-open mode. `add({ id })` upserts an existing toast in place. |
| `onOpenChange` | `(open: boolean) => void` / - | Dropped (workaround) | Use `onClose` / `onRemove` callbacks in the toast object (`add()` options). |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | Dropped | Esc-to-close still works when focus is in the viewport, but is not interceptable. |
| `onPause` / `onResume` | `() => void` / - | Dropped | Timers still pause on hover, focus, and window blur automatically, but there are no callbacks. |
| `onSwipeStart` / `onSwipeMove` / `onSwipeEnd` / `onSwipeCancel` | `(event: SwipeEvent) => void` / - | Dropped (workaround) | Swiping is styled, not scripted: `[data-swiping]`, `[data-swipe-direction]` and `--toast-swipe-movement-x/y` replace the event hooks. |
| `forceMount` | `boolean` / - | Dropped | Roots render from the `toasts` array; exit animations get `data-ending-style` + `toast.transitionStatus: 'ending'` before removal (`onRemove` fires after). |

Base UI only on Root: `toast` (required `Toast.Root.ToastObject`: `id`, `title`, `description`, `type`, `timeout`, `priority`, `updateKey`, `limited`, `height`, `onClose`, `onRemove`, `actionProps`, `positionerProps`, `data`), `swipeDirection` (single or array).

## Toast.Title → Toast.Title

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop. Base renders `<h2>` (Radix rendered `<div>`); pass `render={<div />}` to keep a div. Content usually comes from `toast.title`. |

## Toast.Description → Toast.Description

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Only prop. Base renders `<p>`. Content usually comes from `toast.description`. |

## Toast.Action → Toast.Action

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `altText` (required) | `string` / - | Dropped | No equivalent prop. When creating toasts via the manager, pass the button's props (including handlers and aria attributes) through `add({ actionProps })`. |

Base UI only: `nativeButton` (`boolean`, default `true`, set `false` when `render` is not a button).

## Toast.Close → Toast.Close

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |

Base UI only: `nativeButton` (as on Action).

### Base UI only props worth knowing

- Provider: `limit` (`number`, default `3`; overflowing toasts get `data-limited` + `inert` instead of being removed), `toastManager` (from `Toast.createToastManager()` for use outside React).
- Manager API (`useToastManager()` return / `createToastManager()`): `toasts`, `add(options) => id`, `close(id?)`, `update(id, options)`, `promise(promise, { loading, success, error })`.
- New parts: `Toast.Content` (clips overflow while the stack is collapsed; `data-behind`, `data-expanded`), `Toast.Positioner`/`Toast.Arrow` for anchored toasts (full popup positioning surface: `anchor`, `side` default `'top'`, `align`, `sideOffset`, `alignOffset`, `collisionAvoidance`, `collisionBoundary`, `collisionPadding`, `arrowPadding`, `sticky`, `positionMethod`, `disableAnchorTracking`).

### Data attributes

| Radix | Base UI |
| --- | --- |
| Root `[data-state="open" \| "closed"]` | `data-starting-style` / `data-ending-style` (CSS transition hooks) |
| Root `[data-swipe="start" \| "move" \| "cancel" \| "end"]` | `[data-swiping]` while swiping; `"end"` ≈ `[data-ending-style][data-swipe-direction=...]` |
| Root `[data-swipe-direction]` (`up/down/left/right`) | Same name and values |
| - | New: Root `data-expanded`, `data-limited`, `data-type`; Viewport `data-expanded`; Content `data-behind`, `data-expanded`; Title/Description/Close/Action `data-type`; Positioner/Arrow `data-side`, `data-align`, `data-anchor-hidden`/`data-uncentered` |

### CSS variables

| Radix | Base UI |
| --- | --- |
| `--radix-toast-swipe-move-x` / `--radix-toast-swipe-move-y` | `--toast-swipe-movement-x` / `--toast-swipe-movement-y` |
| `--radix-toast-swipe-end-x` / `--radix-toast-swipe-end-y` | Dropped; animate dismissal from `[data-ending-style][data-swipe-direction=...]` using the movement vars |
| - | New on Root: `--toast-index`, `--toast-offset-y`, `--toast-height`; Viewport: `--toast-frontmost-height`; Positioner: `--anchor-width/height`, `--available-width/height`, `--transform-origin` |

---

# form

Base UI splits Radix Form across three components: `Form` (`@base-ui/react/form`, a callable single part rendering `<form>`), `Field` (`@base-ui/react/field`: `Root`, `Label`, `Control`, `Error`, `Description`, `Validity`, `Item`), and `Fieldset` (`@base-ui/react/fieldset`: `Root`, `Legend`).

Part mapping:

| Radix part | Base UI part |
| --- | --- |
| `Form.Root` | `Form` (callable, no `.Root`) |
| `Form.Field` | `Field.Root` |
| `Form.Label` | `Field.Label` |
| `Form.Control` | `Field.Control` (or any Base UI input component: Input, Checkbox, Select, ... work inside Field out of the box) |
| `Form.Message` | `Field.Error` (validation errors); `Field.Description` for plain hint text |
| `Form.ValidityState` | `Field.Validity` |
| `Form.Submit` | Dropped; use a plain `<button type="submit">` |
| - | New: `Fieldset.Root` + `Fieldset.Legend`, `Field.Item` (per-item wrapper in checkbox/radio groups) |

## Form.Root → Form

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `onClearServerErrors` | `() => void` / - | Dropped (workaround) | The server-error model changed: pass an `errors` object (keys = `Field.Root` `name`, values = message(s)) to `Form`; clear your own error state in `onFormSubmit` (Base calls `preventDefault()` for you) or in `onValueChange` per field. |

Base UI only on Form: `errors` (`Errors`), `onFormSubmit` (`(formValues, eventDetails) => void`), `validationMode` (`'onSubmit' | 'onBlur' | 'onChange'`, default `'onSubmit'`), `actionsRef` (`{ validate(fieldName?) }`).

## Form.Field → Field.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `name` (required) | `string` / - | `name` | Same purpose (submission identity + matching `Form errors` keys); optional in Base UI and takes precedence over `name` on `Field.Control`. |
| `serverInvalid` | `boolean` / - | Dropped (workaround) | Either supply the message via `Form errors={{ [name]: message }}` (field becomes invalid and `Field.Error` shows it), or force state with the `invalid` boolean prop on `Field.Root`. |

Base UI only on Field.Root: `validate` (`(value, formValues) => string | string[] | Promise<...> | null`, the custom-validation replacement for Radix function `match`), `validationMode`, `validationDebounceTime` (`0`), `disabled`, `invalid`, `dirty`, `touched`, `actionsRef` (`{ validate() }`).

## Form.Label → Field.Label

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. Auto-association with the control is preserved. |

Base UI only: `nativeLabel` (`boolean`, default `true`; set `false` when `render` swaps in a non-label element, e.g. a `<div>` labelling a `<Select.Trigger>` button).

## Form.Control → Field.Control

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. For composite widgets, skip Control entirely: Base UI inputs (Input, Checkbox, Select, ...) wire into `Field.Root` directly, which Radix Form could not do. |

Base UI only: `defaultValue` (`string | number | string[]`), `onValueChange` (`(value, eventDetails) => void`).

## Form.Message → Field.Error

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Signature changed. |
| `match` | `'badInput' \| 'patternMismatch' \| 'rangeOverflow' \| 'rangeUnderflow' \| 'stepMismatch' \| 'tooLong' \| 'tooShort' \| 'typeMismatch' \| 'valid' \| 'valueMissing' \| ((value, formData) => boolean \| Promise<boolean>)` / - | `match` | Signature changed: Base UI is `boolean \| 'valid' \| 'badInput' \| 'customError' \| 'patternMismatch' \| 'rangeOverflow' \| 'rangeUnderflow' \| 'stepMismatch' \| 'tooLong' \| 'tooShort' \| 'typeMismatch' \| 'valueMissing'`. The function form is gone: move custom rules to `validate` on `Field.Root` (returns error string(s)); an Error without `match` then displays them. `'customError'` matches `validate` failures. |
| `forceMatch` | `boolean` / `false` | `match={true}` | Renamed/absorbed: `match` accepting `true` always shows the message (the documented hook for external libraries and server errors). |
| `name` | `string` / - | Dropped | `Field.Error` cannot target a field from outside; it must be nested in the owning `Field.Root`. |

Note: Radix rendered default English messages per `match` when `children` were omitted; Base UI renders the error string coming from `validate`/`Form errors`, otherwise provide `children`. `Field.Description` (className/style/render only) is the new home for non-error helper text. Error renders a `<div>`, Description a `<p>`.

## Form.ValidityState → Field.Validity

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `children` | `(validity: ValidityState \| undefined) => React.ReactNode` / - | `children` (required) | Signature changed: `(state: Field.Validity.State) => React.ReactNode` where the native flags live at `state.validity.*` (plus `state.errors`, `state.error`, `state.value`, `state.initialValue`). |
| `name` | `string` / - | Dropped | Must be nested inside `Field.Root`. |

## Form.Submit → (none)

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | Dropped | No submit part; render a plain `<button type="submit">` (or the styled Button component). |

## (new) Fieldset.Root and Fieldset.Legend

No Radix counterpart. `Fieldset.Root` renders a native `<fieldset>` (props: `className`/`style`/`render`; state `{ disabled }`, `data-disabled`). `Fieldset.Legend` renders a `<div>` automatically associated as the accessible legend. Use to group related fields under one label.

### Base UI only props worth knowing (form-wide)

- Validation timing is configurable (`validationMode` on Form or per Field, `validationDebounceTime`).
- `actionsRef` imperative `validate()` on both Form and Field.Root.
- `Field.Item` groups a single checkbox/radio inside a group with its own label/description (`disabled` prop).
- Focus is moved to the first invalid field on submit, matching Radix behavior.

### Data attributes

| Radix (Field/Label/Control/Message) | Base UI (all Field parts: Root, Item, Label, Control, Description, Error) |
| --- | --- |
| `[data-valid]` | `[data-valid]` (same) |
| `[data-invalid]` | `[data-invalid]` (same) |
| - | New: `data-dirty`, `data-touched`, `data-filled`, `data-focused`, `data-disabled`; Error also gets `data-starting-style`/`data-ending-style`. |

### CSS variables

None on either side.

---

# No Base UI counterpart

Radix utilities with no Base UI equivalent, and the recommended plain replacements:

## Label (radix `Label.Root`: `asChild`, `htmlFor`)

Use a native `<label htmlFor="...">`, or `Field.Label` when inside a `Field.Root` (which auto-wires the association, no `htmlFor` needed). Radix's only behavioral extra (preventing text selection on double click) is one line of CSS: `select-none` / `user-select: none`.

## AspectRatio (radix `AspectRatio.Root`: `asChild`, `ratio` default `1`)

Use the CSS `aspect-ratio` property, which is what the prop mapped to: `ratio={16 / 9}` → `aspect-video` or `aspect-[16/9]` (`aspect-ratio: 16 / 9`), plus `w-full` and `object-cover` on the media child.

## VisuallyHidden (radix `VisuallyHidden.Root`: `asChild`)

Use Tailwind's `sr-only` class on a `<span>` (the standard clip-rect pattern). Note: some Base UI popup components in other files still need hidden titles for a11y; `<span className="sr-only">` covers that too.

## AccessibleIcon (radix `AccessibleIcon.Root`: `label` required)

It was only VisuallyHidden + `aria-hidden` composed: render the icon with `aria-hidden="true"` (or `focusable="false"`) and add `<span className="sr-only">{label}</span>` next to it, or put `aria-label={label}` on the interactive parent (button/link) instead.
