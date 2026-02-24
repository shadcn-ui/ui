@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~value=?,
  ~defaultValue=?,
  ~onValueChange=?,
  ~disabled=?,
  ~multiple=?,
  ~orientation=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~style=?,
) =>
  <BaseUi.Accordion.Root
    ?id
    ?value
    ?defaultValue
    ?onValueChange
    ?disabled
    ?multiple
    ?orientation
    ?onClick
    ?onKeyDown
    ?style
    ?children
    dataSlot="accordion"
    className={`flex w-full flex-col ${className}`}
  />

module Item = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~value=?,
    ~disabled=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~style=?,
  ) =>
    <BaseUi.Accordion.Item
      ?id
      ?value
      ?disabled
      ?onClick
      ?onKeyDown
      ?style
      ?children
      dataSlot="accordion-item"
      className={`not-last:border-b ${className}`}
    />
}

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~disabled=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~ariaLabel=?,
    ~render=?,
    ~style=?,
  ) =>
    <BaseUi.Accordion.Header className="flex">
      <BaseUi.Accordion.Trigger
        ?id
        ?disabled
        ?onClick
        ?onKeyDown
        ?ariaLabel
        ?render
        ?style
        dataSlot="accordion-trigger"
        className={`focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 ${className}`}
      >
        {children}
        <Icons.ChevronDown
          dataSlot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <Icons.ChevronUp
          dataSlot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </BaseUi.Accordion.Trigger>
    </BaseUi.Accordion.Header>
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~keepMounted=?,
  ) =>
    <BaseUi.Accordion.Panel
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?keepMounted
      dataSlot="accordion-content"
      className={`data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-sm ${className}`}
    >
      <div
        className="[&_a]:hover:text-foreground h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4"
       ?children />
    </BaseUi.Accordion.Panel>
}
