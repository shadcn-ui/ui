import type { Layout } from "react-grid-layout"

/** Widget kinds — each tile renders from this + pre-written demo data */
export type WidgetType = "intro" | "kpi" | "chart" | "bar" | "table" | "metric"

export type DashboardRecord = {
  id: string
  name: string
  layout: Layout[]
  /** Maps tile id (`layout[].i`) → widget type */
  widgets: Record<string, { type: WidgetType }>
}

export type PersistedDashboards = {
  dashboards: DashboardRecord[]
  activeDashboardId: string
}

const LEGACY_TILE_TYPES: Record<string, WidgetType> = {
  "tile-intro": "intro",
  "tile-kpi": "kpi",
  "tile-chart": "chart",
  "tile-bar": "bar",
  "tile-table": "table",
  "tile-metric": "metric",
}

export function inferWidgetType(tileId: string): WidgetType {
  return LEGACY_TILE_TYPES[tileId] ?? "kpi"
}

export function createDefaultLayout(): Layout[] {
  return [
    { i: "tile-intro", x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 },
    { i: "tile-kpi", x: 0, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
    { i: "tile-chart", x: 3, y: 2, w: 6, h: 5, minW: 4, minH: 3 },
    { i: "tile-bar", x: 9, y: 2, w: 3, h: 5, minW: 2, minH: 3 },
    { i: "tile-table", x: 0, y: 7, w: 7, h: 5, minW: 4, minH: 3 },
    { i: "tile-metric", x: 7, y: 7, w: 5, h: 4, minW: 2, minH: 2, static: true },
  ]
}

export function createDefaultWidgets(): Record<string, { type: WidgetType }> {
  return {
    "tile-intro": { type: "intro" },
    "tile-kpi": { type: "kpi" },
    "tile-chart": { type: "chart" },
    "tile-bar": { type: "bar" },
    "tile-table": { type: "table" },
    "tile-metric": { type: "metric" },
  }
}

/** New user-added tile: place below existing rows */
export function defaultLayoutItemForNewTile(id: string, layout: Layout[]): Layout {
  const bottom = layout.reduce((max, l) => Math.max(max, l.y + l.h), 0)
  return {
    i: id,
    x: 0,
    y: bottom,
    w: 4,
    h: 3,
    minW: 2,
    minH: 2,
  }
}
