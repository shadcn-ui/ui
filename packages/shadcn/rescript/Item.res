open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

let itemVariants = (~variant=Variant.Default, ~size=Size.Default) => {
  let base = "[a]:hover:bg-muted rounded-lg border text-sm w-full group/item focus-visible:border-ring focus-visible:ring-ring/50 flex items-center flex-wrap outline-none transition-colors duration-100 focus-visible:ring-[3px] [a]:transition-colors"
  let variantClass = switch variant {
  | Outline => "border-border"
  | Muted => "bg-muted/50 border-transparent"
  | Default
  | Secondary
  | Destructive
  | Ghost
  | Line
  | Link
  | Icon
  | Image
  | Legend
  | Label => "border-transparent"
  }
  let sizeClass = switch size {
  | Sm => "gap-2.5 px-3 py-2.5"
  | Xs => "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0"
  | Default
  | Md
  | Lg
  | Icon
  | IconXs
  | IconSm
  | IconLg => "gap-2.5 px-3 py-2.5"
  }
  `${base} ${variantClass} ${sizeClass}`
}

let itemMediaVariants = (~variant=Variant.Default) => {
  let base = "gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start flex shrink-0 items-center justify-center [&_svg]:pointer-events-none"
  let variantClass = switch variant {
  | Icon => "[&_svg:not([class*='size-'])]:size-4"
  | Image => "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover"
  | Default
  | Secondary
  | Destructive
  | Outline
  | Ghost
  | Muted
  | Line
  | Link
  | Legend
  | Label => "bg-transparent"
  }
  `${base} ${variantClass}`
}

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let variant = props.dataVariant->Option.getOr(Variant.Default)
  let size = props.dataSize->Option.getOr(Size.Default)
  let props = {...props, dataSlot: "item", dataVariant: variant, dataSize: size}
  <div
    {...toDomProps(props)}
    className={`${itemVariants(~variant, ~size)} ${props.className->Option.getOr("")}`}
  >
    {props.children}
  </div>
}

module Media = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(Variant.Default)
    let props = {...props, dataSlot: "item-media", dataVariant: variant}
    <div
      {...toDomProps(props)}
      className={`${itemMediaVariants(~variant)} ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-content"}
    <div
      {...toDomProps(props)}
      className={`flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </div>
  }
}

module Actions = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-actions"}
    <div
      {...toDomProps(props)}
      className={`flex items-center gap-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-group"}
    <div
      {...toDomProps(props)}
      role="list"
      className={`group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </div>
  }
}

module Separator = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<'value, 'checked>) =>
    <BaseUi.Separator
      {...props}
      dataSlot="item-separator"
      orientation={Orientation.Horizontal}
      className={`my-2 ${props.className->Option.getOr("")}`}
    />
}

module Title = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-title"}
    <div
      {...toDomProps(props)}
      className={`line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </div>
  }
}

module Description = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-description"}
    <p
      {...toDomProps(props)}
      className={`text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left text-sm leading-normal font-normal group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </p>
  }
}

module Header = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-header"}
    <div
      {...toDomProps(props)}
      className={`flex basis-full items-center justify-between gap-2 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "item-footer"}
    <div
      {...toDomProps(props)}
      className={`flex basis-full items-center justify-between gap-2 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
    </div>
  }
}
