@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

@send external replaceAll: (string, string, string) => string = "replaceAll"
@send external joinWithSeparator: (array<string>, string) => string = "join"
@send external toLocaleStringNumber: float => string = "toLocaleString"
@val external dictEntries: dict<'a> => array<(string, 'a)> = "Object.entries"
@val external jsTruthy: JSON.t => bool = "Boolean"
external unknownToReactElement: unknown => React.element = "%identity"
external toUnknown: 'a => unknown = "%identity"

type colorTheme = {
  light?: string,
  dark?: string,
}

type chartConfigItem = {
  label?: unknown,
  icon?: unit => React.element,
  color?: string,
  theme?: colorTheme,
}

type chartConfig = dict<chartConfigItem>

type chartContext = {config: chartConfig}

type payloadItem = {
  @as("type") type_?: string,
  dataKey?: string,
  name?: string,
  color?: string,
  value?: JSON.t,
  payload: dict<JSON.t>,
}

let chartContext: React.Context.t<option<chartContext>> = React.createContext(None)

let useChart = () =>
  switch React.useContext(chartContext) {
  | Some(context) => context
  | None => JsError.throwWithMessage("useChart must be used within a <ChartContainer />")
  }

let getString = (dict: dict<JSON.t>, key: string) =>
  switch dict->Dict.get(key) {
  | Some(String(value)) => Some(value)
  | _ => None
  }

let jsonToDisplayString = (value: JSON.t) =>
  switch value {
  | Number(number) => Some(number->toLocaleStringNumber)
  | String(string) => Some(string)
  | _ => None
  }

let chartLabelToElement = (label: unknown): React.element => label->unknownToReactElement

let themeColor = (~itemConfig: chartConfigItem, ~themeName: string) =>
  switch itemConfig.theme {
  | Some(theme) =>
    switch themeName {
    | "light" => theme.light->Option.orElse(itemConfig.color)
    | "dark" => theme.dark->Option.orElse(itemConfig.color)
    | _ => itemConfig.color
    }
  | None => itemConfig.color
  }

let getPayloadConfigFromPayload = (
  ~config: chartConfig,
  ~payload: payloadItem,
  ~key: string,
) => {
  let configLabelKey = switch key {
  | "name" => payload.name->Option.orElse(payload.payload->getString("name"))
  | "dataKey" => payload.dataKey->Option.orElse(payload.payload->getString("dataKey"))
  | _ => payload.payload->getString(key)
  }->Option.getOr(key)
  switch config->Dict.get(configLabelKey) {
  | Some(foundConfig) => Some(foundConfig)
  | None => config->Dict.get(key)
  }
}

let renderStyleElement = (~id: string, ~config: chartConfig) => {
  let colorConfig = config
  ->dictEntries
  ->Array.filter(((_, itemConfig)) =>
    switch (itemConfig.theme, itemConfig.color) {
    | (Some(_), _)
    | (_, Some(_)) => true
    | _ => false
    }
  )
  if colorConfig->Array.length == 0 {
    React.null
  } else {
    let css = [
      ("light", ""),
      ("dark", ".dark"),
    ]
    ->Array.map(((themeName, prefix)) => {
      let declarations = colorConfig
      ->Array.filterMap(((key, itemConfig)) =>
        switch themeColor(~itemConfig, ~themeName) {
        | Some(color) => Some(`  --color-${key}: ${color};`)
        | None => None
        }
      )
      ->joinWithSeparator("\n")

      `${prefix} [data-chart=${id}] {\n${declarations}\n}`
    })
    ->joinWithSeparator("\n\n")
    <style> {css->React.string} </style>
  }
}

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
  ~config: chartConfig,
  ~className="",
  ~children=?,
  ~rootProps: BaseUi.Types.DomProps.t={},
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
) => {
  let uniqueId = React.useId()->replaceAll(":", "")
  let chartId = switch id {
  | Some(id) => `chart-${id}`
  | None => `chart-${uniqueId}`
  }
  module Provider = {
    let make = React.Context.provider(chartContext)
  }
  <Provider value={Some({config: config})}>
    <div
      {...rootProps}
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="chart"
      dataChart={chartId}
      className={`[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden ${className}`}
    >
      {renderStyleElement(~id=chartId, ~config)}
      <RechartsPrimitive.ResponsiveContainer ?children />
    </div>
  </Provider>
}

module Tooltip = RechartsPrimitive.Tooltip

module Indicator = {
  @unboxed
  type t =
    | @as("line") Line
    | @as("dot") Dot
    | @as("dashed") Dashed
}

module TooltipContent = {
  @react.component
  let make = (
    ~active=false,
    ~payload: array<payloadItem>=[],
    ~className="",
    ~rootProps: BaseUi.Types.DomProps.t={},
    ~indicator=Indicator.Dot,
    ~hideLabel=false,
    ~hideIndicator=false,
    ~label="",
    ~labelFormatter: option<(option<unknown>, array<payloadItem>) => React.element>=?,
    ~labelClassName="",
    ~formatter: option<(JSON.t, string, payloadItem, int, dict<JSON.t>) => React.element>=?,
    ~color="",
    ~nameKey="",
    ~labelKey="",
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
  ) => {
    let {config} = useChart()

    let tooltipLabel = if hideLabel || payload->Array.length == 0 {
      None
    } else {
      switch payload->Array.get(0) {
      | None => None
      | Some(item) =>
        let key = if labelKey != "" {
          labelKey
        } else {
          switch item.dataKey->Option.orElse(item.name) {
          | Some(key) => key
          | None => "value"
          }
        }
        let itemConfig = getPayloadConfigFromPayload(~config, ~payload=item, ~key)
        let value = if labelKey == "" && label != "" {
          switch config->Dict.get(label) {
          | Some(configItem) => Some(configItem.label->Option.getOr(label->toUnknown))
          | None => Some(label->toUnknown)
          }
        } else {
          itemConfig->Option.flatMap(itemConfig => itemConfig.label)
        }
        switch labelFormatter {
        | Some(formatLabel) =>
          Some(
            <div className={`font-medium ${labelClassName}`}>
              {formatLabel(value, payload)}
            </div>,
          )
        | None =>
          switch value {
          | Some(value) =>
            Some(<div className={`font-medium ${labelClassName}`}> {value->chartLabelToElement} </div>)
          | None => None
          }
        }
      }
    }

    if !active || payload->Array.length == 0 {
      React.null
    } else {
      let nestLabel = payload->Array.length == 1 && indicator != Indicator.Dot
      let visiblePayloadItems = payload->Array.filter(item =>
        switch item.type_ {
        | Some("none") => false
        | _ => true
        }
      )

      <div
        {...rootProps}
        ?id
        ?style
        ?onClick
        ?onKeyDown
        className={`border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl ${className}`}
      >
        {switch (nestLabel, tooltipLabel) {
        | (false, Some(labelElement)) => labelElement
        | _ => React.null
        }}
        <div className="grid gap-1.5">
          {visiblePayloadItems
          ->Array.mapWithIndex((item, index) => {
            let key = if nameKey != "" {
              nameKey
            } else {
              switch item.name->Option.orElse(item.dataKey) {
              | Some(key) => key
              | None => "value"
              }
            }
            let itemConfig = getPayloadConfigFromPayload(~config, ~payload=item, ~key)
            let indicatorColor = if color != "" {
              Some(color)
            } else {
              item.payload->getString("fill")->Option.orElse(item.color)
            }
            let customContent = switch (formatter, item.value, item.name) {
            | (Some(customFormatter), Some(value), Some(name)) =>
              Some(customFormatter(value, name, item, index, item.payload))
            | _ => None
            }
            let rawItemValue = item.value
            let itemValue = rawItemValue->Option.flatMap(jsonToDisplayString)
            let shouldShowValue = rawItemValue->Option.mapOr(false, jsTruthy)
            let itemLabel = itemConfig
            ->Option.flatMap(configItem => configItem.label)
            ->Option.map(chartLabelToElement)
            ->Option.orElse(item.name->Option.map(React.string))
            let itemKey = item.dataKey
            ->Option.orElse(item.name)
            ->Option.getOr(Int.toString(index))

            <div
              key={itemKey}
              className={`[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 ${indicator ==
                  Indicator.Dot
                  ? "items-center"
                  : ""}`}
            >
              {switch customContent {
              | Some(content) => content
              | None =>
                <>
                  {switch itemConfig->Option.flatMap(itemConfig => itemConfig.icon) {
                  | Some(icon) => icon()
                  | None =>
                    hideIndicator
                      ? React.null
                      : {
                          let indicatorClass = switch indicator {
                          | Indicator.Dot => "h-2.5 w-2.5"
                          | Indicator.Line => "w-1"
                          | Indicator.Dashed =>
                            `w-0 border-[1.5px] border-dashed bg-transparent ${nestLabel
                                ? "my-0.5"
                                : ""}`
                          }
                          let indicatorStyle = indicatorColor->Option.map(color =>
                            ReactDOM.Style._dictToStyle(Dict.make())
                            ->ReactDOM.Style.unsafeAddProp("--color-bg", color)
                            ->ReactDOM.Style.unsafeAddProp("--color-border", color)
                          )
                          <div
                            style=?indicatorStyle
                            className={`shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) ${indicatorClass}`}
                          />
                        }
                  }}
                  <div
                    className={`flex flex-1 justify-between leading-none ${nestLabel
                        ? "items-end"
                        : "items-center"}`}
                  >
                    <div className="grid gap-1.5">
                      {switch (nestLabel, tooltipLabel) {
                      | (true, Some(labelElement)) => labelElement
                      | _ => React.null
                      }}
                    {switch itemLabel {
                      | Some(itemLabel) =>
                        <span className="text-muted-foreground"> {itemLabel} </span>
                      | None => React.null
                      }}
                    </div>
                    {switch (shouldShowValue, itemValue) {
                    | (true, Some(itemValue)) =>
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {itemValue->React.string}
                      </span>
                    | _ => React.null
                    }}
                  </div>
                </>
              }}
            </div>
          })
          ->React.array}
        </div>
      </div>
    }
  }
}

module Legend = RechartsPrimitive.Legend

module LegendContent = {
  @react.component
  let make = (
    ~className="",
    ~rootProps: BaseUi.Types.DomProps.t={},
    ~hideIcon=false,
    ~payload: array<payloadItem>=[],
    ~verticalAlign="bottom",
    ~nameKey="",
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
  ) => {
    let {config} = useChart()

    if payload->Array.length == 0 {
      React.null
    } else {
      <div
        {...rootProps}
        ?id
        ?style
        ?onClick
        ?onKeyDown
        className={`flex items-center justify-center gap-4 ${verticalAlign == "top"
            ? "pb-3"
            : "pt-3"} ${className}`}
      >
        {payload
        ->Array.filter(item =>
          switch item.type_ {
          | Some("none") => false
          | _ => true
          }
        )
        ->Array.mapWithIndex((item, index) => {
          let key = if nameKey != "" {
            nameKey
          } else {
            item.dataKey->Option.getOr("value")
          }
          let itemConfig = getPayloadConfigFromPayload(~config, ~payload=item, ~key)
          let itemKey = item.dataKey->Option.orElse(item.name)->Option.getOr(Int.toString(index))
          let colorStyle = item.color->Option.map(color =>
            ReactDOM.Style._dictToStyle(Dict.make())
            ->ReactDOM.Style.unsafeAddProp("backgroundColor", color)
          )

          <div
            key={itemKey}
            className="[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {switch itemConfig->Option.flatMap(itemConfig => itemConfig.icon) {
            | Some(icon) =>
              hideIcon
                ? <div className="h-2 w-2 shrink-0 rounded-[2px]" style=?colorStyle />
                : icon()
            | None => <div className="h-2 w-2 shrink-0 rounded-[2px]" style=?colorStyle />
            }}
            {switch itemConfig->Option.flatMap(itemConfig => itemConfig.label) {
            | Some(label) => label->chartLabelToElement
            | None => React.null
            }}
          </div>
        })
        ->React.array}
      </div>
    }
  }
}

module Style = {
  @react.component
  let make = (~id: string, ~config: chartConfig) => renderStyleElement(~id, ~config)
}
