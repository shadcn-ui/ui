# AspectRatio Parity Review

Compared files:
- `apps/v4/examples/base/ui/aspect-ratio.tsx`
- `packages/shadcn/rescript/ui/AspectRatio.res`

## Runtime behavior
- TSX requires `ratio`; ReScript defaults `ratio` to `1.`. Calling without `ratio` yields different behavior (TSX type/API requires explicit ratio, ReScript renders square by default).
- TSX forwards all remaining `div` props (`...props`) and applies them after local `style`, so caller-provided `style` can override/extend styles.
- ReScript does not expose `style` passthrough and always sets style from `--ratio`.

## Prop API parity
- TSX API: `React.ComponentProps<"div"> & { ratio: number }`.
- ReScript API is narrower: `className`, `children`, `id`, `ratio`, `onClick`, `onKeyDown`.
- Missing pass-through for many DOM/ARIA/event props in ReScript.

## DOM structure parity
- Both render a single `div`.

## className parity
- Base classes match: `relative aspect-(--ratio)` plus user className.

## Data-attributes parity
- Both emit `data-slot="aspect-ratio"`.

## Default values
- Default mismatch: TSX has no default for `ratio` (required), ReScript defaults to `1.`.
