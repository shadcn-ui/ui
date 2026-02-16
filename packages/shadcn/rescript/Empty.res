open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

let emptyMediaVariantClass = (~variant: Variant.t) =>
  switch variant {
  | Icon =>
    "bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4"
  | Default
  | Secondary
  | Destructive
  | Outline
  | Ghost
  | Muted
  | Line
  | Link
  | Image
  | Legend
  | Label => "bg-transparent"
  }

let emptyMediaVariants = (~variant=Variant.Default) => {
  let base =
    "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0"
  `${base} ${emptyMediaVariantClass(~variant)}`
}

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let props = {...props, dataSlot: "empty"}
  <div
    {...toDomProps(props)}
    className={`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance ${props.className->Option.getOr("")}`}
  />
}

module Header = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "empty-header"}
    <div
      {...toDomProps(props)}
      className={`flex max-w-sm flex-col items-center gap-2 ${props.className->Option.getOr("")}`}
    />
  }
}

module Media = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(Variant.Default)
    let props = {...props, dataSlot: "empty-icon", dataVariant: variant}
    <div
      {...toDomProps(props)}
      className={`${emptyMediaVariants(~variant)} ${props.className->Option.getOr("")}`}
    />
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "empty-title"}
    <div
      {...toDomProps(props)}
      className={`text-sm font-medium tracking-tight ${props.className->Option.getOr("")}`}
    />
  }
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "empty-description"}
    <div
      {...toDomProps(props)}
      className={`text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "empty-content"}
    <div
      {...toDomProps(props)}
      className={`flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance ${props.className->Option.getOr("")}`}
    />
  }
}
