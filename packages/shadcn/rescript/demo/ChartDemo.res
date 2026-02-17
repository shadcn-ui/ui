@@directive("'use client'")

open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@send external replaceAll: (string, string, string) => string = "replaceAll"
@send external toLocaleString: int => string = "toLocaleString"

type chartDatum = {
  date: string,
  desktop: int,
  mobile: int,
}

module Recharts = {
  type margin = {left: int, right: int}

  type barChartProps = {
    accessibilityLayer?: bool,
    data: array<chartDatum>,
    margin: margin,
    children: React.element,
  }

  module BarChart = {
    @module("recharts")
    external make: React.component<barChartProps> = "BarChart"
  }

  type barProps = {
    dataKey: string,
    fill: string,
  }

  module Bar = {
    @module("recharts")
    external make: React.component<barProps> = "Bar"
  }

  type cartesianGridProps = {vertical: bool}

  module CartesianGrid = {
    @module("recharts")
    external make: React.component<cartesianGridProps> = "CartesianGrid"
  }

  type xAxisProps = {
    dataKey: string,
    tickLine: bool,
    axisLine: bool,
    tickMargin: int,
    minTickGap: int,
    tickFormatter?: string => string,
  }

  module XAxis = {
    @module("recharts")
    external make: React.component<xAxisProps> = "XAxis"
  }

  type tooltipProps = {content: React.element}

  module Tooltip = {
    @module("recharts")
    external make: React.component<tooltipProps> = "Tooltip"
  }

  type responsiveContainerProps = {children: React.element}

  module ResponsiveContainer = {
    @module("recharts")
    external make: React.component<responsiveContainerProps> = "ResponsiveContainer"
  }
}

let chartData: array<chartDatum> = [
  {date: "2024-04-01", desktop: 222, mobile: 150},
  {date: "2024-04-02", desktop: 97, mobile: 180},
  {date: "2024-04-03", desktop: 167, mobile: 120},
  {date: "2024-04-04", desktop: 242, mobile: 260},
  {date: "2024-04-05", desktop: 373, mobile: 290},
  {date: "2024-04-06", desktop: 301, mobile: 340},
  {date: "2024-04-07", desktop: 245, mobile: 180},
  {date: "2024-04-08", desktop: 409, mobile: 320},
  {date: "2024-04-09", desktop: 59, mobile: 110},
  {date: "2024-04-10", desktop: 261, mobile: 190},
  {date: "2024-04-11", desktop: 327, mobile: 350},
  {date: "2024-04-12", desktop: 292, mobile: 210},
  {date: "2024-04-13", desktop: 342, mobile: 380},
  {date: "2024-04-14", desktop: 137, mobile: 220},
  {date: "2024-04-15", desktop: 120, mobile: 170},
  {date: "2024-04-16", desktop: 138, mobile: 190},
  {date: "2024-04-17", desktop: 446, mobile: 360},
  {date: "2024-04-18", desktop: 364, mobile: 410},
  {date: "2024-04-19", desktop: 243, mobile: 180},
  {date: "2024-04-20", desktop: 89, mobile: 150},
  {date: "2024-04-21", desktop: 137, mobile: 200},
  {date: "2024-04-22", desktop: 224, mobile: 170},
  {date: "2024-04-23", desktop: 138, mobile: 230},
  {date: "2024-04-24", desktop: 387, mobile: 290},
  {date: "2024-04-25", desktop: 215, mobile: 250},
  {date: "2024-04-26", desktop: 75, mobile: 130},
  {date: "2024-04-27", desktop: 383, mobile: 420},
  {date: "2024-04-28", desktop: 122, mobile: 180},
  {date: "2024-04-29", desktop: 315, mobile: 240},
  {date: "2024-04-30", desktop: 454, mobile: 380},
]

let chartStyleText = chartId =>
  `[data-chart=${chartId}] {\n  --color-desktop: var(--chart-2);\n  --color-mobile: var(--chart-1);\n}\n\n.dark [data-chart=${chartId}] {\n  --color-desktop: var(--chart-2);\n  --color-mobile: var(--chart-1);\n}`

module TooltipContent = {
  @react.componentWithProps
  let make = (_props: propsWithOptionalChildren<string, bool>) => React.null
}

@react.component
let make = () => {
  let uniqueId = React.useId()
  let chartId = `chart-${uniqueId->replaceAll(":", "")}`
  let activeChart = "desktop"
  let desktopButtonProps = {dataActive: true}
  let mobileButtonProps = {dataActive: false}
  let chartProps = {dataSlot: "chart", dataChart: chartId}
  let desktopTotal = 7324
  let mobileTotal = 7250

  <div
    className="bg-card border flex flex-col gap-6 py-0 pb-4 rounded-xl shadow-sm text-card-foreground"
  >
    <div
      className="!p-0 @container/card-header [.border-b]:pb-6 auto-rows-min border-b flex flex-col gap-2 grid-rows-[auto_auto] has-data-[slot=card-action]:grid-cols-[1fr_auto] items-stretch px-6 sm:flex-row"
    >
      <div className="flex flex-1 flex-col gap-1 justify-center pb-3 pt-4 px-6 sm:!py-0">
        <div className="font-semibold leading-none">
          {"Bar Chart - Interactive"->React.string}
        </div>
        <div className="text-muted-foreground text-sm">
          {"Showing total visitors for the last 3 months"->React.string}
        </div>
      </div>
      <div className="flex">
        <button
          {...toDomProps(desktopButtonProps)}
          className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
        >
          <span className="text-muted-foreground text-xs"> {"Desktop"->React.string} </span>
          <span className="text-lg leading-none font-bold sm:text-3xl">
            {desktopTotal->toLocaleString->React.string}
          </span>
        </button>
        <button
          {...toDomProps(mobileButtonProps)}
          className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
        >
          <span className="text-muted-foreground text-xs"> {"Mobile"->React.string} </span>
          <span className="text-lg leading-none font-bold sm:text-3xl">
            {mobileTotal->toLocaleString->React.string}
          </span>
        </button>
      </div>
    </div>
    <div className="px-2 sm:p-6">
      <div
        {...toDomProps(chartProps)}
        className="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden aspect-auto h-[250px] w-full"
      >
        <style> {chartStyleText(chartId)->React.string} </style>
        <Recharts.ResponsiveContainer>
          <Recharts.BarChart
            accessibilityLayer={true} data={chartData} margin={{left: 12, right: 12}}
          >
            <Recharts.CartesianGrid vertical={false} />
            <Recharts.XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                let date = Date.fromString(value)
                date->Date.toLocaleDateStringWithLocaleAndOptions(
                  "en-US",
                  {
                    month: #short,
                    day: #numeric,
                  },
                )
              }}
            />
            <Recharts.Tooltip content={<TooltipContent />} />
            <Recharts.Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </Recharts.BarChart>
        </Recharts.ResponsiveContainer>
      </div>
    </div>
  </div>
}
