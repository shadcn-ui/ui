# Direction Parity Review

Compared files:
- `apps/v4/examples/base/ui/direction.tsx`
- `packages/shadcn/rescript/ui/Direction.res`

## Runtime behavior
- TSX is a direct re-export of `@base-ui/react/direction-provider`, so consumers get the full provider behavior/options.
- ReScript wraps the provider with a narrowed prop surface and does not expose provider-specific options such as explicit direction configuration.
- Result: configuration scenarios available in TSX may be unreachable in ReScript.

## Prop API parity
- TSX parity target: full upstream `DirectionProvider` props.
- ReScript `DirectionProvider.make` currently exposes only `children`, `className`, and `style`.
- `useDirection` hook export is aligned functionally.

## DOM structure parity
- No wrapper DOM mismatch identified in this file-level comparison.

## className parity
- Not directly comparable at this wrapper level (TSX re-export vs ReScript wrapper).

## Data-attributes parity
- No local data-attribute behavior is introduced in either file.

## Default values
- No explicit default value discrepancy identified beyond the missing provider config props.
