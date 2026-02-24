@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

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

type state = {
  slot: string,
  variant: Variant.t,
  size: Size.t,
}

@react.component
let make = (
  ~className="",
  ~variant=Variant.Default,
  ~size=Size.Default,
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~render=?,
) => {
  BaseUi.Render.use({
    defaultTagName: "div",
    props: {
      className: `${itemVariants(~variant, ~size)} ${className}`,
      ?id,
      ?style,
      ?children,
      ?onClick,
    },
    ?render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

module Media = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataVariant=Variant.Default,
  ) => {
    let variant = dataVariant
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-media"
      dataVariant={variant}
      className={`${itemMediaVariants(~variant)} ${className}`}
    />
  }
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-content"
      className={`flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none ${className}`}
    />
}

module Actions = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-actions"
      className={`flex items-center gap-2 ${className}`}
    />
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      role="list"
      dataSlot="item-group"
      className={`group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2 ${className}`}
    />
}

module Separator = {
  @react.component
  let make = (~className="", ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <BaseUi.Separator
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="item-separator"
      orientation={Orientation.Horizontal}
      className={`my-2 ${className}`}
    />
}

module Title = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-title"
      className={`line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4 ${className}`}
    />
}

module Description = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <p
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-description"
      className={`text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left text-sm leading-normal font-normal group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 ${className}`}
    />
}

module Header = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-header"
      className={`flex basis-full items-center justify-between gap-2 ${className}`}
    />
}

module Footer = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      dataSlot="item-footer"
      className={`flex basis-full items-center justify-between gap-2 ${className}`}
    />
}
