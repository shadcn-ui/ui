open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.PreviewCard.Root {...props} dataSlot="hover-card" />

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.PreviewCard.Trigger {...props} dataSlot="hover-card-trigger" />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.PreviewCard.Portal dataSlot="hover-card-portal">
      <BaseUi.PreviewCard.Positioner
        align={props.align->Option.getOr(Align.Center)}
        alignOffset={props.alignOffset->Option.getOr(4.)}
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(4.)}
        className="isolate z-50"
      >
        <BaseUi.PreviewCard.Popup
          {...props}
          dataSlot="hover-card-content"
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 w-64 origin-(--transform-origin) rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden duration-100 ${props.className->Option.getOr("")}`}
        />
      </BaseUi.PreviewCard.Positioner>
    </BaseUi.PreviewCard.Portal>
}
