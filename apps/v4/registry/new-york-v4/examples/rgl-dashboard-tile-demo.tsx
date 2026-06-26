import { TileByWidget } from "@/registry/new-york-v4/ui/rgl-dashboard-tile"

export default function RglDashboardTileDemo() {
  return (
    <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-h-[200px]">
        <TileByWidget id="kpi" type="kpi" />
      </div>
      <div className="min-h-[220px]">
        <TileByWidget id="chart" type="chart" />
      </div>
    </div>
  )
}
