open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <Icons.Loader2
    role="status"
    ariaLabel="Loading"
    className={`size-4 animate-spin ${props.className->Option.getOr("")}`}
  />
