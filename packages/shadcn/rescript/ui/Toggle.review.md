# Toggle Parity Review

Compared files:
- `apps/v4/examples/base/ui/toggle.tsx`
- `packages/shadcn/rescript/ui/Toggle.res`

## Runtime behavior
- ReScript accepts extra variant/size enum values not present in TSX API and maps many of them to default classes.
- This means invalid-in-TSX configurations can still compile in ReScript with fallback styling behavior.

## Prop API parity
- Prop naming mismatch:
  - TSX: `variant`, `size`
  - ReScript: `dataVariant`, `dataSize`
- TSX primitive passthrough is broader (`TogglePrimitive.Props`).
- ReScript exposes an explicit subset of props and misses some generic passthrough options (for example inline `style`).

## DOM structure parity
- Both render a single toggle primitive node with pass-through children.

## className parity
- Base class string matches.
- Supported variant classes match (`default`, `outline`).
- Supported size classes match (`default`, `sm`, `lg`).

## Data-attributes parity
- `data-slot="toggle"` matches.
- No local variant/size data attribute is emitted by either implementation.

## Default values
- Default variant and size align to `default`.
