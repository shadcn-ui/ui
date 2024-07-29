import { THEMES } from "@/lib/themes"
import { ChartDisplay } from "@/components/chart-display"
import { ChartsNav } from "@/components/charts-nav"
import { ThemesSwitcher } from "@/components/themes-selector"
import { ThemesStyle } from "@/components/themes-styles"
import { Tabs, TabsContent } from "@/registry/new-york/ui/tabs"
import * as Charts from "@/app/(app)/charts/charts"

export default function ChartsPage() {
  return (
    <Tabs defaultValue="examples">
      <ChartsNav />
      <div className="mt-2 w-full gap-6 md:flex md:flex-row-reverse md:items-start">
        <ThemesStyle />
        <ThemesSwitcher
          themes={THEMES}
          className="fixed inset-x-0 bottom-0 z-40 flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:bottom-auto lg:top-20"
        />
        <TabsContent value="examples" className="w-full">
          <div
            id="examples"
            className="grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-area-stacked">
              <Charts.ChartAreaStacked />
            </ChartDisplay>
            <ChartDisplay name="chart-bar-multiple">
              <Charts.ChartBarMultiple />
            </ChartDisplay>
            <ChartDisplay
              name="chart-pie-donut-text"
              className="[&_[data-chart]]:xl:max-h-[243px]"
            >
              <Charts.ChartPieDonutText />
            </ChartDisplay>
          </div>
        </TabsContent>
        <TabsContent value="area-chart" className="w-full">
          <div
            id="area-chart"
            className="grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
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
        </TabsContent>
        <TabsContent value="bar-chart" className="w-full">
          <div
            id="bar-chart"
            className="grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
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
        </TabsContent>
        <TabsContent value="line-chart" className="w-full">
          <div
            id="line-chart"
            className="grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
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
        </TabsContent>
        <TabsContent value="pie-chart" className="w-full">
          <div
            id="pie-chart"
            className="grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
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
            <ChartDisplay name="chart-pie-interactive">
              <Charts.ChartPieInteractive />
            </ChartDisplay>
          </div>
        </TabsContent>
        <TabsContent value="radar-chart" className="w-full">
          <div
            id="radar-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
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
        </TabsContent>
        <TabsContent value="radial-chart" className="w-full">
          <div
            id="radial-chart"
            className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
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
        </TabsContent>
        <TabsContent value="tooltip" className="w-full">
          <div
            id="tooltip"
            className="chart-wrapper grid flex-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10"
          >
            <ChartDisplay name="chart-tooltip-default">
              <Charts.ChartTooltipDefault />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-indicator-line">
              <Charts.ChartTooltipIndicatorLine />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-indicator-none">
              <Charts.ChartTooltipIndicatorNone />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-label-custom">
              <Charts.ChartTooltipLabelCustom />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-label-formatter">
              <Charts.ChartTooltipLabelFormatter />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-label-none">
              <Charts.ChartTooltipLabelNone />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-formatter">
              <Charts.ChartTooltipFormatter />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-icons">
              <Charts.ChartTooltipIcons />
            </ChartDisplay>
            <ChartDisplay name="chart-tooltip-advanced">
              <Charts.ChartTooltipAdvanced />
            </ChartDisplay>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
