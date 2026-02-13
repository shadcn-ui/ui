type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let props = {...props, dataSlot: "skeleton"}
  <div
    {...toDomProps(props)}
    className={`bg-muted animate-pulse rounded-md ${props.className->Option.getOr("")}`}
  />
}
