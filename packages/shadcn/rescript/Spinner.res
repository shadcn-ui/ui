type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <Icons.loader2
    role="status"
    ariaLabel="Loading"
    className={`size-4 animate-spin ${props.className->Option.getOr("")}`}
  />
