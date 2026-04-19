import type { DashboardRecord, PersistedDashboards } from "@/registry/new-york-v4/lib/rgl-dashboard-types"
import {
  createDefaultLayout,
  createDefaultWidgets,
  inferWidgetType,
} from "@/registry/new-york-v4/lib/rgl-dashboard-types"

function uid() {
  return crypto.randomUUID()
}

function migrateRecord(raw: unknown): DashboardRecord | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Partial<DashboardRecord> & { layout?: unknown }
  if (!d.id || !d.name || !Array.isArray(d.layout)) return null
  const layout = d.layout as DashboardRecord["layout"]
  let widgets = d.widgets
  if (!widgets || typeof widgets !== "object") {
    widgets = {}
    for (const item of layout) {
      widgets[item.i] = { type: inferWidgetType(item.i) }
    }
  }
  return { id: d.id, name: d.name, layout, widgets }
}

export function loadPersisted(key: string): PersistedDashboards {
  if (typeof window === "undefined") {
    return seed()
  }
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return seed()
    }
    const parsed = JSON.parse(raw) as PersistedDashboards
    if (
      !parsed?.dashboards?.length ||
      !parsed.activeDashboardId ||
      !parsed.dashboards.some((d) => d.id === parsed.activeDashboardId)
    ) {
      return seed()
    }
    const dashboards = parsed.dashboards
      .map((x) => migrateRecord(x))
      .filter(Boolean) as DashboardRecord[]
    if (dashboards.length !== parsed.dashboards.length) return seed()
    return { ...parsed, dashboards }
  } catch {
    return seed()
  }
}

export function savePersisted(key: string, data: PersistedDashboards) {
  localStorage.setItem(key, JSON.stringify(data))
}

function seed(): PersistedDashboards {
  const id = uid()
  const dashboard: DashboardRecord = {
    id,
    name: "Main",
    layout: createDefaultLayout(),
    widgets: createDefaultWidgets(),
  }
  return {
    dashboards: [dashboard],
    activeDashboardId: id,
  }
}

export function createDashboard(name: string): DashboardRecord {
  return {
    id: uid(),
    name: name.trim() || "Untitled",
    layout: createDefaultLayout(),
    widgets: createDefaultWidgets(),
  }
}
