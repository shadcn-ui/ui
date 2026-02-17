@@directive("'use client'")

open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Popover.Root {...props} dataSlot="popover" />

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Popover.Trigger {...props} dataSlot="popover-trigger" />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Popover.Portal>
      <BaseUi.Popover.Positioner
        align={props.align->Option.getOr(Align.Center)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(4.)}
        className="isolate z-50"
      >
        <BaseUi.Popover.Popup
          {...props}
          dataSlot="popover-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden duration-100 ${props.className->Option.getOr("")}`}
        />
      </BaseUi.Popover.Positioner>
    </BaseUi.Popover.Portal>
}

module Header = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <div

      className={`flex flex-col gap-0.5 text-sm ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
}

module Title = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Popover.Title
      {...props}
      dataSlot="popover-title"
      className={`font-medium ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Popover.Description
      {...props}
      dataSlot="popover-description"
      className={`text-muted-foreground ${props.className->Option.getOr("")}`}
    />
}
