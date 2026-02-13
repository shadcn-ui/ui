type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.Progress.Root
    {...props}
    dataSlot="progress"
    className={`flex flex-wrap gap-3 ${props.className->Option.getOr("")}`}
  >
    {props.children->Option.getOr(React.null)}
    <BaseUi.Progress.Track
      dataSlot="progress-track"
      className="bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full"
    >
      <BaseUi.Progress.Indicator
        dataSlot="progress-indicator"
        className="bg-primary h-full transition-all"
      />
    </BaseUi.Progress.Track>
  </BaseUi.Progress.Root>

module Track = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Progress.Track
      {...props}
      dataSlot="progress-track"
      className={`bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </BaseUi.Progress.Track>
}

module Indicator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Progress.Indicator
      {...props}
      dataSlot="progress-indicator"
      className={`bg-primary h-full transition-all ${props.className->Option.getOr("")}`}
    />
}

module Label = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Progress.Label
      {...props}
      dataSlot="progress-label"
      className={`text-sm font-medium ${props.className->Option.getOr("")}`}
    />
}

module Value = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Progress.Value
      {...props}
      dataSlot="progress-value"
      className={`text-muted-foreground ml-auto text-sm tabular-nums ${props.className->Option.getOr("")}`}
    />
}
