
open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let spacing = props.dataSpacing->Option.getOr(0.)
  let orientation = props.dataOrientation->Option.getOr(DataOrientation.Horizontal)
  let style =
    ReactDOM.Style._dictToStyle(Dict.make())
    ->ReactDOM.Style.unsafeAddProp("--gap", Float.toString(spacing))
  <BaseUi.ToggleGroup
    {...props}
    dataSlot="toggle-group"
    dataOrientation={orientation}
    dataSpacing={spacing}
    style
    className={`group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)] ${props.className->Option.getOr("")}`}
  />
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(Variant.Default)
    let size = props.dataSize->Option.getOr(Size.Default)
    let spacing = props.dataSpacing->Option.getOr(0.)
    <BaseUi.Toggle
      {...props}
      dataSlot="toggle-group-item"
      dataVariant={variant}
      dataSize={size}
      dataSpacing={spacing}
      className={`shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t ${Toggle.toggleVariants(~variant, ~size)} ${props.className->Option.getOr("")}`}
    />
  }
}
