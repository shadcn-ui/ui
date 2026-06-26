# RglDashboard AI Context

## What this block is

`RglDashboard` is a draggable and resizable dashboard built on `react-grid-layout`.
It includes:

- Dashboard state and CRUD flows.
- Tile rendering by widget type.
- Edit mode with drag and resize.
- Optional local persistence via `storageKey`.

Use it when you need a ready-to-extend dashboard shell with sensible defaults.

## Installed files and ownership

- `components/rgl-dashboard/rgl-dashboard.tsx`: public facade export (`RglDashboard`).
- `components/rgl-dashboard/rgl-dashboard-demo.tsx`: stateful implementation.
- `components/rgl-dashboard/tile-widgets.tsx`: tile helper re-exports.
- `components/ui/rgl-dashboard-grid.tsx`: grid wrapper and handle styles.
- `components/ui/rgl-dashboard-tile.tsx`: tile primitives.
- `lib/rgl-dashboard-types.ts`: dashboard and widget types.
- `lib/rgl-dashboard-storage.ts`: load/save helpers for local persistence.
- `lib/rgl-dashboard-example.ts`: default seed spec (`DASHBOARD_EXAMPLE_SPEC`).

## Public component API

`RglDashboardProps` (aliased from `DashboardDemoProps`):

- `embedded?: boolean` - tighter layout for embedded contexts.
- `initialDashboard?: DashboardRecord` - initial seed; defaults to `DASHBOARD_EXAMPLE_SPEC`.
- `storageKey?: string | false` - `false` by default (memory-only). Provide a string to persist to `localStorage`.

## Common usage patterns

### Basic

```tsx
import { RglDashboard } from "@/components/rgl-dashboard/rgl-dashboard"

export default function Page() {
  return <RglDashboard />
}
```

### Persisted

```tsx
<RglDashboard storageKey="my-app-dashboard" />
```

### Deterministic seeded data

```tsx
<RglDashboard initialDashboard={mySeed} storageKey={false} />
```

## Safe extension points

- Add new widget type definitions in `rgl-dashboard-types`.
- Extend tile rendering in `rgl-dashboard-tile`.
- Add toolbar or actions in `rgl-dashboard-demo`.
- Customize grid sizing/spacing in `rgl-dashboard-grid`.

## Avoid

- Mutating `DASHBOARD_EXAMPLE_SPEC` directly; clone and pass your own seed.
- Hard-coding `localStorage` keys in library code; use `storageKey`.
- Changing `react-grid-layout` internals without checking drag/resize behavior.
