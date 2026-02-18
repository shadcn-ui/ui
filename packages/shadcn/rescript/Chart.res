@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

module RechartsPrimitive = {
  module ResponsiveContainer = {
    @module("recharts")
    external make: React.component<props<'value, 'checked>> = "ResponsiveContainer"
  }

  module Tooltip = {
    @module("recharts")
    external make: React.component<props<'value, 'checked>> = "Tooltip"
  }

  module Legend = {
    @module("recharts")
    external make: React.component<props<'value, 'checked>> = "Legend"
  }
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
) => {
  let uniqueId = React.useId()
  let resolvedId = id->Option.getOr(uniqueId)
  let chartId = `chart-${resolvedId}`
  <div
    id={resolvedId}
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="chart"
    dataChart={chartId}
    className={`[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden ${className}`}
  >
    <RechartsPrimitive.ResponsiveContainer ?children />
  </div>
}

module Tooltip = {
  @react.component
  let make = (~content=?, ~className="", ~id=?, ~style=?) =>
    <RechartsPrimitive.Tooltip ?content className ?id ?style />
}

module TooltipContent = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      className={`border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl ${className}`}
    />
}

module Legend = {
  @react.component
  let make = (~content=?, ~className="", ~id=?, ~style=?) =>
    <RechartsPrimitive.Legend ?content className ?id ?style />
}

module LegendContent = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      className={`flex items-center justify-center gap-4 ${className}`}
    />
}

module Style = {
  @react.component
  let make = (~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <style ?id ?style ?onClick ?onKeyDown ?children />
}
