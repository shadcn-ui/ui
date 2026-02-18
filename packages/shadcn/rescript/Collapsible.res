@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className=?,
  ~children=?,
  ~id=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~disabled=?,
  ~style=?,
) =>
  <BaseUi.Collapsible.Root
    ?className
    ?children
    ?id
    ?open_
    ?defaultOpen
    ?onOpenChange
    ?disabled
    ?style
    dataSlot="collapsible"
  />

module Trigger = {
  @react.component
  let make = (
    ~className=?,
    ~children=?,
    ~id=?,
    ~disabled=false,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~ariaLabel=?,
    ~render=?,
    ~style=?,
  ) => {
    <BaseUi.Collapsible.Trigger
      ?className
      ?children
      ?id
      disabled
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?ariaLabel
      ariaDisabled={disabled}
      ?render
      ?style
      dataSlot="collapsible-trigger"
    />
  }
}

module Content = {
  @react.component
  let make = (
    ~className=?,
    ~children=?,
    ~id=?,
    ~keepMounted=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <BaseUi.Collapsible.Panel
      ?className
      ?children
      ?id
      ?keepMounted
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="collapsible-content"
    />
}
