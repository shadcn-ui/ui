open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let props = {...props, dataSlot: "skeleton"}
  <div
    {...toDomProps(props)}
    className={`bg-muted animate-pulse rounded-md ${props.className->Option.getOr("")}`}
  />
}
