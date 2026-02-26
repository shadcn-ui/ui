# ButtonGroup Parity Review

Compared files:
- `apps/v4/examples/base/ui/button-group.tsx`
- `packages/shadcn/rescript/ui/ButtonGroup.res`

## Runtime behavior
- Root orientation attribute behavior differs when omitted:
  - TSX applies horizontal classes via `cva` default but does not necessarily emit `data-orientation` when `orientation` is undefined.
  - ReScript defaults `dataOrientation` and always emits `data-orientation`.
- ReScript supports an extra orientation value (`Responsive`) not present in TSX API; it maps to horizontal classes.

## Prop API parity
- `ButtonGroup` TSX accepts full `React.ComponentProps<"div">` + `orientation`; ReScript root exposes a smaller subset and uses `dataOrientation` naming.
- `ButtonGroupText` TSX (`useRender.ComponentProps<"div">`) has broad prop passthrough; ReScript `Text.make` only exposes a narrow set (`id`, `style`, click/key handlers, `render`, etc.).
- `ButtonGroupSeparator` TSX accepts full `Separator` props; ReScript `Separator.make` exposes limited props (`id`, `style`, `orientation`, `children`, `className`).

## DOM structure parity
- Root structure matches (`div[role=group]`).
- Text and separator each render a single node as expected.

## className parity
- Root and Text class strings match.
- Separator class token set is not strictly identical:
  - TSX runtime class list includes separator base classes from `ui/separator.tsx` plus local overrides.
  - ReScript inlines a composed class list and omits some overridden tokens (for example `bg-border`, `data-horizontal:w-full`).
  - Effective visual result is likely equivalent, but token-level parity is not exact.

## Data-attributes parity
- `data-slot` parity is present for root and separator.
- Root `data-orientation` emission differs as described in runtime behavior.

## Default values
- Root default orientation aligns to horizontal behavior.
- Separator default orientation aligns to vertical.
