@@directive("'use client'")

open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

module RechartsPrimitive = {
  module ResponsiveContainer = {
    @module("recharts")
    external make: React.component<propsWithChildren<string, bool>> = "ResponsiveContainer"
  }

  module Tooltip = {
    @module("recharts")
    external make: React.component<props<string, bool>> = "Tooltip"
  }

  module Legend = {
    @module("recharts")
    external make: React.component<props<string, bool>> = "Legend"
  }
}

@react.componentWithProps
let make = (props: propsWithChildren<string, bool>) => {
  let uniqueId = React.useId()
  let chartId = `chart-${props.id->Option.getOr(uniqueId)}`
  let wrapperProps = {...props, dataSlot: "chart", dataChart: chartId}
  <div
    {...toDomProps(wrapperProps)}
    className={`[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden ${props.className->Option.getOr("")}`}
    id={props.id->Option.getOr("")}
  >
    <RechartsPrimitive.ResponsiveContainer>
      {props.children}
    </RechartsPrimitive.ResponsiveContainer>
  </div>
}

module Tooltip = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => <RechartsPrimitive.Tooltip {...props} />
}

module TooltipContent = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) =>
    <div
      {...toDomProps(props)}
      className={`border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
}

module Legend = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => <RechartsPrimitive.Legend {...props} />
}

module LegendContent = {
  @react.componentWithProps
  let make = (props: propsWithChildren<string, bool>) =>
    <div
      {...toDomProps(props)}
      className={`flex items-center justify-center gap-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
}

module Style = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => <style {...toDomProps(props)} />
}
