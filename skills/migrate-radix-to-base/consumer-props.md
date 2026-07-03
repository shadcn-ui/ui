# Consumer-side prop changes (call sites, not wrappers)

The shadcn wrapper NAMES survive a radix -> base-ui migration, but these props
change or disappear at CALL SITES in app code. Sweep every consumer for this
list after migrating the wrappers. All entries verified against
@base-ui/react@1.6.0 type definitions during real migrations; when in doubt,
check node_modules/@base-ui/react/**/*.d.ts, never guess.

## Universal

| Radix | Base UI | Call-site action |
|---|---|---|
| `asChild` (any wrapper) | `render` prop | `<Trigger asChild><Button/></Trigger>` -> `<Trigger render={<Button/>}>...` |

## Per component

| Component | Radix prop | Base UI fate | Call-site action |
|---|---|---|---|
| Accordion | `type="single"\|"multiple"` + `collapsible` | dropped; `value`/`defaultValue` are ALWAYS arrays; multiple-open via `multiple` | `type="single" collapsible` -> remove both; wrap values in arrays; `type="multiple"` -> `multiple` |
| Tabs | `activationMode="manual"` | dropped; Base UI defaults to MANUAL activation | remove prop; near-equivalent opt-in is `Tabs.List activateOnFocus` (behavior delta: flag, do not auto-add) |
| Select | `position="popper"\|"item-aligned"` | `alignItemWithTrigger` boolean (on Positioner; wrappers expose it) | `position="popper"` -> `alignItemWithTrigger={false}`; `item-aligned` -> `alignItemWithTrigger` (default) |
| TooltipProvider | `delayDuration`, `skipDelayDuration` | `delay`; skip-delay concept dropped | rename / remove |
| Tooltip | `disableHoverableContent` | NO equivalent | remove; FLAG the behavior change in the report |
| Avatar.Image | `delayMs` | `delay` | rename |
| ScrollArea | `type="always"\|"scroll"\|...` | dropped | remove |
| Separator | `decorative` | dropped | remove |
| Checkbox | `checked="indeterminate"` | `indeterminate` is a SEPARATE boolean prop | `checked="indeterminate"` -> `indeterminate` + boolean `checked` |
| Slider | `onValueChange(value)` | signature gains event details; also `inverted` REMOVED | check handler arity; remove `inverted` (flag vertical-inverted usage) |
| Select | `onValueChange(value: string)` | widens to `(value: Value \| null, eventDetails)` | `useState<string>` + `onValueChange={setState}` breaks: widen state to `string \| null` or wrap the setter |
| Slider | `onValueCommit` | `onValueCommitted` | rename |
| ToggleGroup | `type="single"\|"multiple"` | `multiple` boolean; value shape arrays | same treatment as Accordion |
| ToggleGroup / Toolbar | `rovingFocus={false}` | dropped (roving focus always on); `loop` -> `loopFocus` | remove / rename |
| Menubar | `value`/`onValueChange` (active menu) | dropped; control per Menu.Root `open` | restructure if used; usually unused |
| Menubar | `loop` | `loopFocus` | rename |
| ContextMenu.Root | `modal` | REMOVED | remove |
| ContextMenu.Trigger | `disabled` | REMOVED | remove; gate the trigger yourself |
| DropdownMenu/ContextMenu items | (Radix closed menu on select) | `closeOnClick` defaults FALSE on CheckboxItem/RadioItem | behavior delta: flag; add `closeOnClick` only if the user asks |
| NavigationMenu | `delayDuration`(200), `skipDelayDuration`, `viewport` | `delay`(50) + `closeDelay`; viewport prop gone (Positioner handles it) | rename/remove; flag the 200->50 hover-delay feel change |
| Popover / HoverCard | `openDelay`/`closeDelay` on Root | move to TRIGGER as `delay`/`closeDelay` | relocate props Root -> Trigger |
| Dialog / AlertDialog | `onOpenAutoFocus` | `initialFocus` (element/ref-based, not event-based) | restructure: pass target instead of preventDefault handler |
| Dialog / AlertDialog | `onCloseAutoFocus` | `finalFocus` | same restructure |
| Dialog family | `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside` | consolidated; see the overlays reference for exact per-part signatures | consult overlays.md; do not guess |
| DirectionProvider | `dir` | `direction` | rename |

## Callback signature rule

Base UI callbacks commonly gain an event-details argument:
`onOpenChange(open, eventDetails)`, `onValueChange(value, eventDetails)`.
Passing an existing single-arg handler stays type-safe; handlers that USED
Radix's event parameter need review against the family reference file.

## Sweep procedure

1. grep app code (outside components/ui) for each LHS token above plus
   `asChild`.
2. Fix call sites file by file; typecheck after each file.
3. Anything on this list marked FLAG goes into the migration report as a
   behavior delta, never silently patched.
