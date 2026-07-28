# Class-string rewrites (layer 2)

Apply these across ALL class strings (className, cva definitions, cn calls),
including app code. They are safe, mechanical rewrites.

## Data-attribute selectors

| Radix pattern | Base UI pattern |
|---|---|
| `data-[state=open]:` | `data-open:` |
| `data-[state=closed]:` | `data-closed:` |
| `data-[state=checked]:` | `data-checked:` |
| `data-[state=unchecked]:` | `data-unchecked:` |
| `data-[state=active]:` (tabs) | `data-active:` |
| `data-[state=on]:` (toggle) | `data-pressed:` |
| `data-[highlighted]:` | `data-highlighted:` (unchanged) |
| `data-[disabled]:` | `data-disabled:` (unchanged) |
| `data-[side=...]:` | `data-[side=...]:` (unchanged, still parameterized) |
| `group-data-[state=open]` / `peer-data-[state=open]` | `group-data-open` / `peer-data-open` |
| submenu trigger open marker `data-[state=open]:` | `data-popup-open:` |

## Animation idiom

Radix (tw-animate/keyframes):
`data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0`

Base UI (transition + starting/ending styles):
`transition-[opacity,transform] data-starting-style:opacity-0 data-ending-style:opacity-0` (plus translate/scale equivalents).

Do not translate animate-in/out utilities 1:1; restate the intent with
`data-starting-style:` / `data-ending-style:` transitions. When the original
uses per-side slide classes, keep the `data-[side=...]` or
`data-[swipe-direction=...]` parameterization.

## CSS variables

| Radix var | Base UI var |
|---|---|
| `--radix-<comp>-content-transform-origin` | `--transform-origin` |
| `--radix-<comp>-content-available-height` | `--available-height` |
| `--radix-<comp>-content-available-width` | `--available-width` |
| `--radix-<comp>-trigger-width` | `--anchor-width` |
| `--radix-<comp>-trigger-height` | `--anchor-height` |
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-collapsible-content-height` | `--collapsible-panel-height` |
| `--radix-navigation-menu-viewport-height/width` | `--positioner-height` / `--positioner-width` |

## Element changes kill pseudo-class variants

When a part's rendered element changes from a form control to a generic
element (checkbox/switch/radio Roots render `<span>` in Base UI), `disabled:`
and `:disabled` Tailwind variants become dead code. Replace them with
`data-disabled:` equivalents. (Note: the shadcn base registry's checkbox
still carries the dead `disabled:*` classes; treat that as an upstream quirk,
not a pattern to copy.)

## Disabled-state hooks

Some Base UI triggers surface disabled state as `aria-disabled` rather than
the `disabled` attribute (accordion trigger, tabs tab). Where the radix code
used `disabled:opacity-50`, add or substitute `aria-disabled:opacity-50`
according to the wrapper's reference file.
