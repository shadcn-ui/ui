open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Accordion.Root
    {...props}
    dataSlot="accordion"
    className={`flex w-full flex-col ${props.className->Option.getOr("")}`}
  />

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Accordion.Item
      {...props}
      dataSlot="accordion-item"
      className={`not-last:border-b ${props.className->Option.getOr("")}`}
    />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Accordion.Header className="flex">
      <BaseUi.Accordion.Trigger
        {...props}
        dataSlot="accordion-trigger"
        className={`focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 ${props.className->Option.getOr("")}`}
      >
        {props.children}
        <Icons.chevronDown
          dataSlot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <Icons.chevronUp
          dataSlot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </BaseUi.Accordion.Trigger>
    </BaseUi.Accordion.Header>
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Accordion.Panel
      {...props}
      dataSlot="accordion-content"
      className={`data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-sm ${props.className->Option.getOr("")}`}
    >
      <div className="[&_a]:hover:text-foreground h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4">
        {props.children}
      </div>
    </BaseUi.Accordion.Panel>
}
