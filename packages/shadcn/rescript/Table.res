type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let containerProps = {
    ...props,
    className: "",
    children: React.null,
    dataSlot: "table-container",
  }
  let tableProps = {
    ...props,
    dataSlot: "table",
  }
  <div
    {...toDomProps(containerProps)}
    className="relative w-full overflow-x-auto"
  >
    <table
      {...toDomProps(tableProps)}
      className={`w-full caption-bottom text-sm ${props.className->Option.getOr("")}`}
    />
  </div>
}

module Header = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-header"}
    <thead
      {...toDomProps(props)}
      className={`[&_tr]:border-b ${props.className->Option.getOr("")}`}
    />
  }
}

module Body = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-body"}
    <tbody
      {...toDomProps(props)}
      className={`[&_tr:last-child]:border-0 ${props.className->Option.getOr("")}`}
    />
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-footer"}
    <tfoot
      {...toDomProps(props)}
      className={`bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 ${props.className->Option.getOr("")}`}
    />
  }
}

module Row = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-row"}
    <tr
      {...toDomProps(props)}
      className={`hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors ${props.className->Option.getOr("")}`}
    />
  }
}

module Head = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-head"}
    <th
      {...toDomProps(props)}
      className={`text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${props.className->Option.getOr("")}`}
    />
  }
}

module Cell = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-cell"}
    <td
      {...toDomProps(props)}
      className={`p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${props.className->Option.getOr("")}`}
    />
  }
}

module Caption = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "table-caption"}
    <caption
      {...toDomProps(props)}
      className={`text-muted-foreground mt-4 text-sm ${props.className->Option.getOr("")}`}
    />
  }
}
