import { ChartDisplay } from "@/components/chart-display"
import { ChartsMobileDrawer } from "@/components/charts-mobile-drawer"
import { ChartsNav } from "@/components/charts-nav"
import { ChartsThemeSwitcher } from "@/components/charts-theme-switcher"
import { Separator } from "@/registry/new-york/ui/separator"
import * as Charts from "@/app/(app)/charts/charts"

export default function ChartsPage() {
  return (
    <div>
      <div className="gap-6 md:flex md:flex-row-reverse md:items-start">
        <ChartsThemeSwitcher className="fixed inset-x-0 bottom-0 z-30 flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:sticky md:bottom-auto md:top-20" />
        <div className="grid flex-1 gap-12">
          <div className="chart-wrapper grid flex-1 scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
            <ChartDisplay name="chart-area-stacked">
              <Charts.ChartAreaStacked />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-multiple">
              <Charts.ChartBarMultiple />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-donut-text">
              <Charts.ChartPieDonutText />
            </ChartDisplay>
          </div>
          <div className="hidden gap-4 md:grid">
            <ChartsNav />
            <Separator />
          </div>
          <div
            id="area-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-area-default">
              <Charts.ChartAreaDefault />
            </ChartDisplay>
            <ChartDisplay name="chart-area-linear">
              <Charts.ChartAreaLinear />
            </ChartDisplay>
            <ChartDisplay name="chart-area-step">
              <Charts.ChartAreaStep />
            </ChartDisplay>
            <ChartDisplay name="chart-area-stacked">
              <Charts.ChartAreaStacked />
            </ChartDisplay>
            <ChartDisplay name="chart-area-stacked-expand">
              <Charts.ChartAreaStackedExpand />
            </ChartDisplay>
            <ChartDisplay name="chart-area-legend">
              <Charts.ChartAreaLegend />
            </ChartDisplay>
            <ChartDisplay name="chart-area-icons">
              <Charts.ChartAreaIcons />
            </ChartDisplay>
            <ChartDisplay name="chart-area-gradient">
              <Charts.ChartAreaGradient />
            </ChartDisplay>
            <ChartDisplay name="chart-area-axes">
              <Charts.ChartAreaAxes />
            </ChartDisplay>
            <div className="md:col-span-2 lg:col-span-3">
              <ChartDisplay name="chart-area-interactive">
                <Charts.ChartAreaInteractive />
              </ChartDisplay>
            </div>
          </div>
          <Separator />
          <div
            id="bar-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-bar-default">
              <Charts.ChartBarDefault />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-horizontal">
              <Charts.ChartBarHorizontal />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-multiple">
              <Charts.ChartBarMultiple />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-label">
              <Charts.ChartBarLabel />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-label-custom">
              <Charts.ChartBarLabelCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-mixed">
              <Charts.ChartBarMixed />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-stacked">
              <Charts.ChartBarStacked />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-active">
              <Charts.ChartBarActive />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-negative">
              <Charts.ChartBarNegative />
            </ChartDisplay>
            <div className="md:col-span-2 lg:col-span-3">
              <ChartDisplay name="chart-bar-interactive">
                <Charts.ChartBarInteractive />
              </ChartDisplay>
            </div>
          </div>
          <Separator />
          <div
            id="line-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-line-default">
              <Charts.ChartLineDefault />
            </ChartDisplay>
            <ChartDisplay name="chart-line-linear">
              <Charts.ChartLineLinear />
            </ChartDisplay>
            <ChartDisplay name="chart-line-step">
              <Charts.ChartLineStep />
            </ChartDisplay>
            <ChartDisplay name="chart-line-multiple">
              <Charts.ChartLineMultiple />
            </ChartDisplay>
            <ChartDisplay name="chart-line-dots">
              <Charts.ChartLineDots />
            </ChartDisplay>
            <ChartDisplay name="chart-line-dots-custom">
              <Charts.ChartLineDotsCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-line-dots-colors">
              <Charts.ChartLineDotsColors />
            </ChartDisplay>
            <ChartDisplay name="chart-line-label">
              <Charts.ChartLineLabel />
            </ChartDisplay>
            <ChartDisplay name="chart-line-label-custom">
              <Charts.ChartLineLabelCustom />
            </ChartDisplay>
            <div className="md:col-span-2 lg:col-span-3">
              <ChartDisplay name="chart-line-interactive">
                <Charts.ChartLineInteractive />
              </ChartDisplay>
            </div>
          </div>
          <Separator />
          <div
            id="pie-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-pie-simple">
              <Charts.ChartPieSimple />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-separator-none">
              <Charts.ChartPieSeparatorNone />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-label">
              <Charts.ChartPieLabel />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-label-custom">
              <Charts.ChartPieLabelCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-label-list">
              <Charts.ChartPieLabelList />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-legend">
              <Charts.ChartPieLegend />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-donut">
              <Charts.ChartPieDonut />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-donut-active">
              <Charts.ChartPieDonutActive />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-donut-text">
              <Charts.ChartPieDonutText />
            </ChartDisplay>
            <ChartDisplay name="chart-pie-stacked">
              <Charts.ChartPieStacked />
            </ChartDisplay>
            <Charts.ChartPieInteractive />
          </div>
          <Separator />
          <div
            id="radar-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-radar-default">
              <Charts.ChartRadarDefault />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-dots">
              <Charts.ChartRadarDots />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-multiple">
              <Charts.ChartRadarMultiple />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-lines-only">
              <Charts.ChartRadarLinesOnly />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-label-custom">
              <Charts.ChartRadarLabelCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-radius">
              <Charts.ChartRadarRadius />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-custom">
              <Charts.ChartRadarGridCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-fill">
              <Charts.ChartRadarGridFill />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-none">
              <Charts.ChartRadarGridNone />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-circle">
              <Charts.ChartRadarGridCircle />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-circle-no-lines">
              <Charts.ChartRadarGridCircleNoLines />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-grid-circle-fill">
              <Charts.ChartRadarGridCircleFill />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-legend">
              <Charts.ChartRadarLegend />
            </ChartDisplay>
            <ChartDisplay name="chart-radar-icons">
              <Charts.ChartRadarIcons />
            </ChartDisplay>
          </div>
          <Separator />
          <div
            id="radial-chart"
            className="chart-wrapper grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-radial-simple">
              <Charts.ChartRadialSimple />
            </ChartDisplay>
            <ChartDisplay name="chart-radial-label">
              <Charts.ChartRadialLabel />
            </ChartDisplay>
            <ChartDisplay name="chart-radial-grid">
              <Charts.ChartRadialGrid />
            </ChartDisplay>
            <ChartDisplay name="chart-radial-text">
              <Charts.ChartRadialText />
            </ChartDisplay>
            <ChartDisplay name="chart-radial-shape">
              <Charts.ChartRadialShape />
            </ChartDisplay>
            <ChartDisplay name="chart-radial-stacked">
              <Charts.ChartRadialStacked />
            </ChartDisplay>
          </div>
        </div>
      </div>
    </div>
  )
}
