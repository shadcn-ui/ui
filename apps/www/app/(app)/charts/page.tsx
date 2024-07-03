import { ChartsNav } from "@/components/charts-nav"
import { ChartsToolbar } from "@/components/charts-toolbar"
import * as Charts from "@/registry/new-york/block/charts"
import { Separator } from "@/registry/new-york/ui/separator"

export default function ChartsPage() {
  return (
    <div>
      <div className="flex items-start gap-6">
        <div className="grid flex-1 gap-12">
          <div className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            <Charts.ChartAreaStacked />
            <Charts.ChartBarMultiple />
            <Charts.ChartBarHorizontal />
          </div>
          <div>
            <ChartsNav />
            <Separator />
          </div>
          <div
            id="area-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartAreaDefault />
            <Charts.ChartAreaLinear />
            <Charts.ChartAreaStep />
            <Charts.ChartAreaStacked />
            <Charts.ChartAreaStackedExpand />
            <Charts.ChartAreaLegend />
            <Charts.ChartAreaIcons />
            <Charts.ChartAreaGradient />
            <Charts.ChartAreaAxes />
            <div className="col-span-3">
              <Charts.ChartAreaInteractive />
            </div>
          </div>
          <Separator />
          <div
            id="bar-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartBarDefault />
            <Charts.ChartBarHorizontal />
            <Charts.ChartBarMultiple />
            <Charts.ChartBarLabel />
            <Charts.ChartBarLabelCustom />
            <Charts.ChartBarMixedLabel />
            <Charts.ChartBarStacked />
            <Charts.ChartBarActive />
            <Charts.ChartBarNegative />
            <div className="col-span-3">
              <Charts.ChartBarInteractive />
            </div>
          </div>
          <Separator />
          <div
            id="line-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartLineDefault />
            <Charts.ChartLineLinear />
            <Charts.ChartLineStep />
            <Charts.ChartLineMultiple />
            <Charts.ChartLineDots />
            <Charts.ChartLineDotsCustom />
            <Charts.ChartLineDotsColors />
            <Charts.ChartLineLabel />
            <Charts.ChartLineLabelCustom />
            <div className="col-span-3">
              <Charts.ChartLineInteractive />
            </div>
          </div>
          <Separator />
          <div
            id="pie-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartPieSimple />
            <Charts.ChartPieSimpleSeparatorNone />
            <Charts.ChartPieLabel />
            <Charts.ChartPieLabelCustom />
            <Charts.ChartPieLabelList />
            <Charts.ChartPieLegend />
            <Charts.ChartPieDonut />
            <Charts.ChartPieDonutActive />
            <Charts.ChartPieDonutText />
            <Charts.ChartPieStacked />
            <Charts.ChartPieInteractive />
          </div>
          <Separator />
          <div
            id="radar-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartRadarDefault />
            <Charts.ChartRadarDots />
            <Charts.ChartRadarMultiple />
            <Charts.ChartRadarLinesOnly />
            <Charts.ChartRadarLabelCustom />
            <Charts.ChartRadarRadius />
            <Charts.ChartRadarGridCustom />
            <Charts.ChartRadarGridFill />
            <Charts.ChartRadarGridNone />
            <Charts.ChartRadarGridCircle />
            <Charts.ChartRadarGridCircleNoLines />
            <Charts.ChartRadarGridCircleFill />
            <Charts.ChartRadarLegend />
            <Charts.ChartRadarIcons />
          </div>
          <Separator />
          <div
            id="radial-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          >
            <Charts.ChartRadialSimple />
            <Charts.ChartRadialLabel />
            <Charts.ChartRadialGrid />
            <Charts.ChartRadialText />
            <Charts.ChartRadialShape />
            <Charts.ChartRadialStacked />
          </div>
        </div>
        <ChartsToolbar className="sticky top-20" />
      </div>
    </div>
  )
}
