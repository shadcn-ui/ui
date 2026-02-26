# Switch Parity Review

Compared files:
- `apps/v4/examples/base/ui/switch.tsx`
- `packages/shadcn/rescript/ui/Switch.res`

## Runtime behavior
- ReScript renders caller `children` after `Switch.Thumb`; TSX effectively renders only `SwitchPrimitive.Thumb`.
- ReScript `dataSize` can take broader `Size.t` values than TSX supports. For non-`default`/`sm` values, size-specific classes do not apply, creating potential visual/runtime drift.

## Prop API parity
- Prop naming mismatch: TSX uses `size`; ReScript uses `dataSize`.
- TSX `size` is constrained to `"sm" | "default"`.
- ReScript accepts a broader enum and passes only a subset of root props (rather than full primitive passthrough parity).

## DOM structure parity
- Root + thumb structure matches in the default case.
- Extra caller children can appear in ReScript only.

## className parity
- Root and thumb class strings match for supported size values (`default`, `sm`).

## Data-attributes parity
- Both emit `data-slot="switch"` and `data-slot="switch-thumb"`.
- Both emit size data, but ReScript may emit values TSX does not support.

## Default values
- Default size aligns to `default`.
