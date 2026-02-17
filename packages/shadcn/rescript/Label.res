@@directive("'use client'")

open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let props = {...props, dataSlot: "label"}
  <label
    {...toDomProps(props)}
    className={`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${props.className->Option.getOr("")}`}
  />
}
