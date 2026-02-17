@@directive("'use client'")

open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Tooltip.Root {...props} dataSlot="tooltip" />

module Provider = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Tooltip.Provider
      {...props}
      dataSlot="tooltip-provider"
      delay={props.delay->Option.getOr(0.)}
    />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Tooltip.Trigger {...props} dataSlot="tooltip-trigger" />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Tooltip.Portal>
      <BaseUi.Tooltip.Positioner
        align={props.align->Option.getOr(Align.Center)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        side={props.side->Option.getOr(Side.Top)}
        sideOffset={props.sideOffset->Option.getOr(4.)}
        className="isolate z-50"
      >
        <BaseUi.Tooltip.Popup
          {...props}
          dataSlot="tooltip-content"
          className={`data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs ${props.className->Option.getOr("")}`}
        >
          {props.children}
          <BaseUi.Tooltip.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </BaseUi.Tooltip.Popup>
      </BaseUi.Tooltip.Positioner>
    </BaseUi.Tooltip.Portal>
}
