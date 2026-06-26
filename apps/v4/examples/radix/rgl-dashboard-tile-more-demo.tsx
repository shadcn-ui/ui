import { TileByWidget } from "@/styles/radix-nova/ui/rgl-dashboard-tile"

export default function RglDashboardTileMoreDemo() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="min-h-[200px]">
        <TileByWidget id="bar" type="bar" />
      </div>
      <div className="min-h-[220px]">
        <TileByWidget id="table" type="table" />
      </div>
      <div className="min-h-[160px]">
        <TileByWidget id="metric" type="metric" />
      </div>
    </div>
  )
}
