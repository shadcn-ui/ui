# Checkbox Parity Review

Compared files:
- `apps/v4/examples/base/ui/checkbox.tsx`
- `packages/shadcn/rescript/ui/Checkbox.res`

## Runtime behavior
- ReScript renders user `children` after the indicator.
- TSX does not render caller children in practice, because the explicit `<CheckboxPrimitive.Indicator />` child replaces `props.children` coming from spread props.
- This can produce extra DOM/content in ReScript that never appears in TSX.

## Prop API parity
- TSX accepts full `CheckboxPrimitive.Root.Props`.
- ReScript exposes an explicit subset of root props; broad passthrough parity is not preserved.

## DOM structure parity
- Both render root + indicator.
- ReScript may additionally render arbitrary caller children; TSX does not.

## className parity
- Root class string matches.
- Indicator class string matches.

## Data-attributes parity
- `data-slot="checkbox"` and `data-slot="checkbox-indicator"` match.

## Default values
- No meaningful default-state discrepancy found for checked/unchecked behavior.
- ReScript sets `children=React.null` by default, but unlike TSX it can still render caller children when provided.
