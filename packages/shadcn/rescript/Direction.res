type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

module DirectionProvider = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.DirectionProvider {...props} />
}

let useDirection = BaseUi.DirectionProvider.useDirection
