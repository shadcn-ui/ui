type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

type ratioStyle = {@as("--ratio") ratio: float}
external toStyle: ratioStyle => ReactDOM.Style.t = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
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
