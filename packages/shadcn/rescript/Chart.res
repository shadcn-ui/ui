type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
type primitiveProps = props<string, bool>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

module RechartsPrimitive = {
  @module("recharts")
  external responsiveContainer: React.component<primitiveProps> = "ResponsiveContainer"

  @module("recharts")
  external tooltip: React.component<primitiveProps> = "Tooltip"

  @module("recharts")
  external legend: React.component<primitiveProps> = "Legend"
}

@react.componentWithProps
let make = (props: primitiveProps) => {
  let uniqueId = React.useId()
  let chartId = `chart-${props.id->Option.getOr(uniqueId)}`
  let wrapperProps = {...props, dataSlot: "chart", dataChart: chartId}
  <div
    {...toDomProps(wrapperProps)}
    className={`[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden ${props.className->Option.getOr("")}`}
    id={props.id->Option.getOr("")}
  >
    <RechartsPrimitive.responsiveContainer>
      {props.children->Option.getOr(React.null)}
    </RechartsPrimitive.responsiveContainer>
  </div>
}

module Tooltip = {
  @react.componentWithProps
  let make = (props: primitiveProps) => <RechartsPrimitive.tooltip {...props} />
}

module TooltipContent = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <div
      {...toDomProps(props)}
      className={`border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
}

module Legend = {
  @react.componentWithProps
  let make = (props: primitiveProps) => <RechartsPrimitive.legend {...props} />
}

module LegendContent = {
  @react.componentWithProps
  let make = (props: primitiveProps) =>
    <div
      {...toDomProps(props)}
      className={`flex items-center justify-center gap-4 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
}

module Style = {
  @react.componentWithProps
  let make = (props: primitiveProps) => <style {...toDomProps(props)} />
}
