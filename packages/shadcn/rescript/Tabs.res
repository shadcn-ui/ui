type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

let tabsListVariants = (~variant="default") => {
  let base =
    "rounded-lg p-[3px] group-data-horizontal/tabs:h-8 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col"
  let variantClass =
    switch variant {
    | "line" => "gap-1 bg-transparent"
    | _ => "bg-muted"
    }
  `${base} ${variantClass}`
}

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.Tabs.Root
    {...props}
    orientation={props.orientation->Option.getOr(BaseUi.Types.Horizontal)}
    dataSlot="tabs"
    className={`group/tabs flex gap-2 data-horizontal:flex-col ${props.className->Option.getOr("")}`}
  />

module List = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr("default")
    <BaseUi.Tabs.List
      {...props}
      dataSlot="tabs-list"
      dataVariant={variant}
      className={`${tabsListVariants(~variant)} ${props.className->Option.getOr("")}`}
    />
  }
}

module Trigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Tabs.Tab
      {...props}
      dataSlot="tabs-trigger"
      className={`focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background dark:data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-foreground after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Tabs.Panel
      {...props}
      dataSlot="tabs-content"
      className={`flex-1 text-sm outline-none ${props.className->Option.getOr("")}`}
    />
}
