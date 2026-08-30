# Target wrapper shapes (golden-derived specifics)

Facts learned by diffing hand migrations against the shadcn base registry
wrappers. These close gaps the mapping tables cannot express: exact classes,
defaults, and composition shapes. When migrating shadcn-style wrappers,
prefer these shapes.

## Conventions

- Positioner parts get NO `data-slot` attribute; keep data-slot on the parts
  the radix wrapper already had.
- Menu-family Positioner: `className="isolate z-50 outline-none"`; the Popup
  KEEPS `z-50` and `outline-none` too. Tooltip: Popup keeps `z-50`,
  Positioner gets `isolate z-50`. Select: `isolate z-50` lives on the Popup,
  Positioner gets no class.
- The base registry adds `cn-<comp>-content-logical` (and for tooltip also
  `cn-tooltip-arrow-logical`) companion classes next to the existing
  `cn-<comp>-content` hooks on popover, tooltip, hover-card, dropdown,
  context-menu, select, menubar popups. Add them when the source uses cn-*
  hooks; skip for plain-Tailwind projects.

## Button

Base UI HAS a Button primitive: `import { Button as ButtonPrimitive } from
"@base-ui/react/button"`. A shadcn button.tsx with the Slot/asChild idiom
migrates to `<ButtonPrimitive>` directly (which supports `render`), NOT to a
hand-rolled useRender wrapper. Reserve useRender + mergeProps for
non-button polymorphic components (breadcrumb link, marker).

## Tooltip Arrow (literal classes)

```tsx
<TooltipPrimitive.Arrow
  className={cn(
    "cn-tooltip-arrow cn-tooltip-arrow-logical",
    "data-[side=bottom]:top-1 data-[side=left]:right-[-13px] data-[side=left]:top-1/2! data-[side=left]:-translate-y-1/2 data-[side=right]:left-[-13px] data-[side=right]:top-1/2! data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5",
    className
  )}
/>
```

Verify against the current base registry tooltip before relying on the exact
pixel values; the shape (per-side offsets + translate, no rotation) is the
stable part. Golden default: `alignOffset = 0`, `sideOffset = 4`.

## DropdownMenu / ContextMenu SubContent

Compose the PUBLIC Content wrapper, do not rebuild from primitives:

```tsx
function DropdownMenuSubContent(props) {
  return (
    <DropdownMenuContent
      align="start"
      alignOffset={-3}
      side="right"
      sideOffset={0}
      className={cn("w-auto", props.className)}
      {...props}
    />
  )
}
```

The `-3` / `0` defaults are load-bearing (visual alignment with the parent
menu). NOTE: the live registry shapes SubContent differently per menu:
context-menu is a true minimal compose (as above), while dropdown-menu's
SubContent duplicates the full content class list (including translucent menu
styling) rather than composing. When a golden pair exists, copy the golden
shape; this example is the fallback.

DANGER — do not confuse SubContent defaults with main-Content defaults. The
values above are ONLY for the *submenu* wrappers (DropdownMenuSubContent /
ContextMenuSubContent). The MAIN ContextMenuContent (the pointer-anchored
right-click menu) keeps its own positioning — do NOT apply
`side="right"`/`alignOffset` to it, or every right-click menu mispositions.
- ContextMenu SUBContent defaults: `align="start" alignOffset={4} side="right" sideOffset={0}`.
- DropdownMenu SUBContent defaults: `align="start" alignOffset={-3} side="right" sideOffset={0}`.
- Main Content (either): keep the wrapper's existing align/sideOffset; do not add a side.

## SubTrigger open styling

Base wrappers ADD `data-popup-open:bg-accent
data-popup-open:text-accent-foreground` to SubTrigger (no radix equivalent
class existed; the open styling was previously data-[state=open]).

## Select

- Bare re-export: `const Select = SelectPrimitive.Root` (no wrapper function,
  no data-slot on Root). `SelectPrimitive.Root.Props` is GENERIC
  (<Value, Multiple>), which breaks the usual ComponentProps pattern; the
  bare re-export sidesteps it.
- Drop the radix `position` prop entirely; expose `alignItemWithTrigger`
  (default true) picked from Positioner.Props, `sideOffset = 4`.
- Item anatomy: `ItemText` FIRST with `cn-select-item-text shrink-0
  whitespace-nowrap`, then `ItemIndicator render={<span
  className="cn-select-item-indicator" />}`.
- Scroll arrows get `top-0 w-full` / `bottom-0 w-full`; List has no classes.

## Accordion animation placement

`h-(--accordion-panel-height)`, `data-starting-style:h-0`, and
`data-ending-style:h-0` all go on the INNER div of the Panel (the element
that previously carried the radix height animation), not on the Panel itself.

## Tabs

The base registry accepts Base UI's manual-activation default (no
`activateOnFocus`), and does not forward `orientation` beyond what the radix
wrapper did. Match it: flag the behavior delta, do not patch it.
