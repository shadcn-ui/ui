import { ChartsToolbar } from "@/components/charts-toolbar"
import * as Charts from "@/registry/new-york/block/charts"
import { Separator } from "@/registry/new-york/ui/separator"

export default function ChartsPage() {
  return (
    <div className="flex items-start gap-6">
      <div className="grid flex-1 gap-12">
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartAreaStacked />
          <Charts.ChartBarMultiple />
          <Charts.ChartBarHorizontal />
        </div>
        <Separator />
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartAreaSimple />
          <Charts.ChartAreaSimpleLinear />
          <Charts.ChartAreaSimpleStep />
          <Charts.ChartAreaSimpleLegend />
          <Charts.ChartAreaStacked />
          <Charts.ChartAreaStackedExpand />
        </div>
        <Separator />
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartBarMultiple />
          <Charts.ChartBarHorizontal />
          <Charts.ChartBarStacked />
          <Charts.ChartBarHorizontalMixed />
        </div>
        <Separator />
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartLineSimple />
          <Charts.ChartLineCurved />
          <Charts.ChartLineMultiple />
          <Charts.ChartLineDots />
          <Charts.ChartLineLabel />
        </div>
        <Separator />
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartPieSimple />
          <Charts.ChartPieSimpleNoSeparator />
          <Charts.ChartPieLabel />
          <Charts.ChartPieLabelCustom />
          <Charts.ChartPieLabelList />
          <Charts.ChartPieLabelCustomList />
        </div>
        <Separator />
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <Charts.ChartRadarSimple />
          <Charts.ChartRadarDots />
          <Charts.ChartRadarGridNone />
          <Charts.ChartRadarGridCircle />
          <Charts.ChartRadarGridCircleNoLines />
          <Charts.ChartRadarGridAngles />
          <Charts.ChartRadarMultiple />
          <Charts.ChartRadarLegend />
          <Charts.ChartRadarRadius />
        </div>
      </div>
      <ChartsToolbar className="sticky top-20" />
    </div>
  )
}
