type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.Slider.Root
    {...props}
    dataSlot="slider"
    thumbAlignment={BaseUi.Types.ThumbEdge}
    className={`data-horizontal:w-full data-vertical:h-full ${props.className->Option.getOr("")}`}
  >
    <BaseUi.Slider.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
      <BaseUi.Slider.Track
        dataSlot="slider-track"
        className="bg-muted relative grow overflow-hidden rounded-full select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <BaseUi.Slider.Indicator
          dataSlot="slider-range"
          className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </BaseUi.Slider.Track>
      <BaseUi.Slider.Thumb
        dataSlot="slider-thumb"
        className="border-ring ring-ring/50 relative block size-3 shrink-0 rounded-full border bg-white transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
      />
    </BaseUi.Slider.Control>
  </BaseUi.Slider.Root>
