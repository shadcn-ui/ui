# Resizable Parity Review

Compared files:
- `apps/v4/examples/base/ui/resizable.tsx`
- `packages/shadcn/rescript/ui/Resizable.res`

## Runtime behavior
- `Handle` children behavior differs:
  - TSX effectively renders only the optional internal handle visual (`withHandle`).
  - ReScript renders caller `children` plus optional internal handle visual.
- ReScript wrappers expose only a subset of primitive props, so some runtime features available in TSX passthrough are unavailable (for example advanced group/panel/separator options).

## Prop API parity
- Naming/export mismatch: TSX exports `ResizablePanelGroup`; ReScript uses the root component `Resizable.make` (consumed as `<Resizable ...>`).
- Group:
  - TSX uses full `ResizablePrimitive.GroupProps` passthrough.
  - ReScript root exposes limited props (`id`, `style`, click/key handlers, `orientation`, etc.).
- Panel:
  - TSX uses full `ResizablePrimitive.PanelProps`.
  - ReScript exposes only selected props (`className`, `children`, `id`, `style`, `defaultSize`, `min`, `max`).
- Handle:
  - TSX uses full `ResizablePrimitive.SeparatorProps` + `withHandle`.
  - ReScript exposes a reduced set + `withHandle`.

## DOM structure parity
- Group and panel structure are aligned.
- Handle structure diverges when caller passes children (rendered only in ReScript).

## className parity
- Group class string matches.
- Handle class string matches.
- Optional handle visual `div` class string matches.

## Data-attributes parity
- `data-slot` values for group/panel/handle match.

## Default values
- `withHandle` default (`false`) matches.
