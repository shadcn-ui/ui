# Alert Parity Review

Compared files:
- `apps/v4/examples/base/ui/alert.tsx`
- `packages/shadcn/rescript/ui/Alert.res`

## Runtime behavior
- ReScript writes `data-variant` on the root (`dataVariant={variant}`), while TSX does not emit a `data-variant` attribute.
- ReScript accepts many `Variant.t` values beyond `default | destructive`; unsupported TSX variants fall back to default classes in ReScript but still change `data-variant`, which can affect downstream attribute selectors.

## Prop API parity
- TSX `Alert`, `AlertTitle`, `AlertDescription`, and `AlertAction` accept full `React.ComponentProps<"div">`.
- ReScript components only expose a narrow prop subset (`id`, `style`, `onClick`, `onKeyDown`, `children`, `className`, plus `dataVariant` on root), so many DOM/event/ARIA props are not pass-through.
- Prop naming differs: TSX uses `variant`; ReScript uses `dataVariant`.

## DOM structure parity
- No structural discrepancy for the rendered node tree:
  - `Alert` root `div`
  - `Title`/`Description`/`Action` each render a single `div`.

## className parity
- Base class strings match for root/title/description/action.
- Variant class behavior matches for `default` and `destructive`.

## Data-attributes parity
- Both sides emit matching `data-slot` values.
- ReScript emits extra `data-variant`; TSX does not.

## Default values
- Default visual variant aligns (`default`/`Variant.Default`).
