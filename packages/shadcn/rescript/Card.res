type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let size = props.dataSize->Option.getOr(BaseUi.Types.Size.Default)
  let props = {...props, dataSlot: "card", dataSize: size}
  <div
    {...toDomProps(props)}
    className={`ring-foreground/10 bg-card text-card-foreground group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl ${props.className->Option.getOr("")}`}
  />
}

module Header = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-header"}
    <div
      {...toDomProps(props)}
      className={`group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ${props.className->Option.getOr("")}`}
    />
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-title"}
    <div
      {...toDomProps(props)}
      className={`text-base leading-snug font-medium group-data-[size=sm]/card:text-sm ${props.className->Option.getOr("")}`}
    />
  }
}

module Description = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-description"}
    <div
      {...toDomProps(props)}
      className={`text-muted-foreground text-sm ${props.className->Option.getOr("")}`}
    />
  }
}

module Action = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-action"}
    <div
      {...toDomProps(props)}
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${props.className->Option.getOr("")}`}
    />
  }
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-content"}
    <div
      {...toDomProps(props)}
      className={`px-4 group-data-[size=sm]/card:px-3 ${props.className->Option.getOr("")}`}
    />
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "card-footer"}
    <div
      {...toDomProps(props)}
      className={`bg-muted/50 flex items-center rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3 ${props.className->Option.getOr("")}`}
    />
  }
}
