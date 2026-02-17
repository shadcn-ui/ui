open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

let alertVariantClass = (~variant: Variant.t) =>
  switch variant {
    | Destructive =>
      "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
    | Default
    | Secondary
    | Outline
    | Ghost
    | Muted
    | Line
    | Link
    | Icon
    | Image
    | Legend
    | Label => "bg-card text-card-foreground"
    }

let alertVariants = (~variant=Variant.Default) => {
  let base =
    "grid gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert"
  `${base} ${alertVariantClass(~variant)}`
}

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let variant = props.dataVariant->Option.getOr(Variant.Default)
  let props = {...props, dataSlot: "alert"}
  <div
    {...toDomProps(props)}
    role="alert"
    className={`${alertVariants(~variant)} ${props.className->Option.getOr("")}`}
  />
}

module Title = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-title"}
    <div
      {...toDomProps(props)}
      className={`[&_a]:hover:text-foreground font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 ${props.className->Option.getOr("")}`}
    />
  }
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-description"}
    <div
      {...toDomProps(props)}
      className={`text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module Action = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-action"}
    <div
      {...toDomProps(props)}
      className={`absolute top-2 right-2 ${props.className->Option.getOr("")}`}
    />
  }
}
