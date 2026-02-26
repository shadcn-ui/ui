# Spinner Parity Review

Compared files:
- `apps/v4/examples/base/ui/spinner.tsx`
- `packages/shadcn/rescript/ui/Spinner.res`

## Runtime behavior
- TSX forwards remaining SVG props via `...props`; ReScript does not provide general SVG prop passthrough.
- ReScript ignores `children` (`let _ignoredChildren = children`), while TSX can pass caller children through to the icon component.

## Prop API parity
- TSX API parity target: `React.ComponentProps<"svg">` passthrough.
- ReScript API is narrowed to `className`, `role`, `ariaLabel`, and ignored `children`.
- Missing event, style, data-*, and other SVG attributes in ReScript.

## DOM structure parity
- Both render a single loader icon component node.

## className parity
- Base class parity matches: `size-4 animate-spin` plus user className.

## Data-attributes parity
- No component-local data attributes on either side.

## Default values
- Defaults align for accessibility props (`role="status"`, loading label).
