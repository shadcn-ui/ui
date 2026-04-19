import type { DashboardRecord } from "@/registry/bases/base/lib/rgl-dashboard-types"
import { createDefaultLayout, createDefaultWidgets } from "@/registry/bases/base/lib/rgl-dashboard-types"

/**
 * Canonical dashboard spec for docs and examples: one object holds `layout` + `widgets` for every tile.
 * Pass this to `<DashboardDemo initialDashboard={DASHBOARD_EXAMPLE_SPEC} persistToStorage={false} />`.
 */
export const DASHBOARD_EXAMPLE_SPEC: DashboardRecord = {
  id: "main",
  name: "Main",
  layout: createDefaultLayout(),
  widgets: createDefaultWidgets(),
}
