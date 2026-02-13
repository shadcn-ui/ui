type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.ScrollArea.Root
    {...props}
    dataSlot="scroll-area"
    className={`relative ${props.className->Option.getOr("")}`}
  >
    <BaseUi.ScrollArea.Viewport
      dataSlot="scroll-area-viewport"
      className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
    >
      {props.children->Option.getOr(React.null)}
    </BaseUi.ScrollArea.Viewport>
    <BaseUi.ScrollArea.Scrollbar
      dataSlot="scroll-area-scrollbar"
      orientation={BaseUi.Types.Vertical}
      className="flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
    >
      <BaseUi.ScrollArea.Thumb
        dataSlot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </BaseUi.ScrollArea.Scrollbar>
    <BaseUi.ScrollArea.Corner />
  </BaseUi.ScrollArea.Root>

module ScrollBar = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ScrollArea.Scrollbar
      {...props}
      dataSlot="scroll-area-scrollbar"
      orientation={props.orientation->Option.getOr(BaseUi.Types.Vertical)}
      className={`flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent ${props.className->Option.getOr("")}`}
    >
      <BaseUi.ScrollArea.Thumb
        dataSlot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </BaseUi.ScrollArea.Scrollbar>
}
