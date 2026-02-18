@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=React.null,
  ~id=?,
  ~value=?,
  ~max=?,
  ~min=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
) =>
  <BaseUi.Progress.Root
    ?id
    ?value
    ?max
    ?min
    ?style
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    dataSlot="progress"
    className={`flex flex-wrap gap-3 ${className}`}
  >
    {children}
    <BaseUi.Progress.Track
      dataSlot="progress-track"
      className="bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full"
    >
      <BaseUi.Progress.Indicator
        dataSlot="progress-indicator" className="bg-primary h-full transition-all"
      />
    </BaseUi.Progress.Track>
  </BaseUi.Progress.Root>

module Track = {
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
    <BaseUi.Progress.Track
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="progress-track"
      className={`bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full ${className}`}
     ?children />
}

module Indicator = {
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
    <BaseUi.Progress.Indicator
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="progress-indicator"
      className={`bg-primary h-full transition-all ${className}`}
    />
}

module Label = {
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
    <BaseUi.Progress.Label
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="progress-label"
      className={`text-sm font-medium ${className}`}
    />
}

module Value = {
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
    <BaseUi.Progress.Value
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="progress-value"
      className={`text-muted-foreground ml-auto text-sm tabular-nums ${className}`}
    />
}
