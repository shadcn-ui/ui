open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

type ratioStyle = {@as("--ratio") ratio: float}
external toStyle: ratioStyle => ReactDOM.Style.t = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let ratio = props.ratio->Option.getOr(1.)
  let props = {
    ...props,
    dataSlot: "aspect-ratio",
    style: toStyle({ratio: ratio}),
  }
  <div
    {...toDomProps(props)}
    className={`relative aspect-(--ratio) ${props.className->Option.getOr("")}`}
  />
}
