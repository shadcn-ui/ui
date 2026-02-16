
open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@get
external getCollapsible: propsWithChildren<'value, 'checked> => option<string> = "collapsible"

type sidebar = {
  state: string,
  @as("open") open_: bool,
  openMobile: bool,
  isMobile: bool,
  toggleSidebar: unit => unit,
}

let sidebarWidth = "16rem"
let _sidebarWidthMobile = "18rem"
let _sidebarWidthIcon = "3rem"

let useSidebar = () => {
  state: "expanded",
  open_: true,
  openMobile: false,
  isMobile: false,
  toggleSidebar: () => (),
}

let sidebarMenuButtonVariants = (
  ~variant=Variant.Default,
  ~size=Size.Default,
) => {
  let base =
    "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0"
  let variantClass =
    switch variant {
    | Outline =>
      "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    | Default
    | Secondary
    | Destructive
    | Ghost
    | Muted
    | Line
    | Link
    | Icon
    | Image
    | Legend
    | Label => ""
    }
  let sizeClass =
    switch size {
    | Sm => "h-7 text-xs"
    | Lg => "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    | Default
    | Xs
    | Md
    | Icon
    | IconXs
    | IconSm
    | IconLg => "h-8"
    }
  `${base} ${variantClass} ${sizeClass}`
}

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  if getCollapsible(props)->Option.getOr("offcanvas") == "none" {
    let sidebarProps: props<'value, 'checked> = {dataSlot: "sidebar"}
    <div
      {...toDomProps(sidebarProps)}
      className={`bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  } else {
    let _sidebar = useSidebar()
    <div
      className={`group peer text-sidebar-foreground hidden md:block ${props.className->Option.getOr("")}`}
    >
      <div className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0" />
      <div className="fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex">
        <div
          className="bg-sidebar group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1"
        >
          {props.children}
        </div>
      </div>
    </div>
  }
}

module Provider = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let wrapperProps: props<'value, 'checked> = {dataSlot: "sidebar-wrapper"}
    let style =
      ReactDOM.Style._dictToStyle(Dict.make())
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width", sidebarWidth)
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width-icon", "3rem")
    <div
      {...toDomProps(wrapperProps)}
      style
      className={`group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<'value, 'checked>) =>
    <Button
      {...props}
      dataSidebar="trigger"
      dataSlot="sidebar-trigger"
      dataVariant=Variant.Ghost
      dataSize=Size.IconSm
      className={`${props.className->Option.getOr("")}`}
    >
      <Icons.panelLeft className="cn-rtl-flip" />
      <span className="sr-only">{"Toggle Sidebar"->React.string}</span>
    </Button>
}

module Rail = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSidebar: "rail", dataSlot: "sidebar-rail"}
    <button
      {...toDomProps(props)}
      ariaLabel="Toggle Sidebar"
      tabIndex={-1}
      className={`hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2 ${props.className->Option.getOr("")}`}
      title="Toggle Sidebar"
    >
      {props.children}
    </button>
  }
}

module Inset = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-inset"}
    <main
      {...toDomProps(props)}
      className={`bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </main>
  }
}

module Input = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Input
      {...props}
      dataSlot="sidebar-input"
      dataSidebar="input"
      className={`bg-background h-8 w-full shadow-none ${props.className->Option.getOr("")}`}
    />
}

module Header = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-header", dataSidebar: "header"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-2 p-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-footer", dataSidebar: "footer"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-2 p-2 ${props.className->Option.getOr("")}`}
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
      dataSlot="sidebar-separator"
      dataSidebar="separator"
      className={`bg-sidebar-border mx-2 w-auto ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-content", dataSidebar: "content"}
    <div
      {...toDomProps(props)}
      className={`no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-group", dataSidebar: "group"}
    <div
      {...toDomProps(props)}
      className={`relative flex w-full min-w-0 flex-col p-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module GroupLabel = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-group-label", dataSidebar: "group-label"}
    <div
      {...toDomProps(props)}
      className={`text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module GroupAction = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-group-action", dataSidebar: "group-action"}
    <button
      {...toDomProps(props)}
      className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </button>
  }
}

module GroupContent = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-group-content", dataSidebar: "group-content"}
    <div
      {...toDomProps(props)}
      className={`w-full text-sm ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module Menu = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu", dataSidebar: "menu"}
    <ul
      {...toDomProps(props)}
      className={`flex w-full min-w-0 flex-col gap-0 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </ul>
  }
}

module MenuItem = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-item", dataSidebar: "menu-item"}
    <li
      {...toDomProps(props)}
      className={`group/menu-item relative ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </li>
  }
}

module MenuButton = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(Variant.Default)
    let size = props.dataSize->Option.getOr(Size.Default)
    let props = {
      ...props,
      dataSlot: "sidebar-menu-button",
      dataSidebar: "menu-button",
      dataSize: size,
    }
    <button
      {...toDomProps(props)}
      type_="button"
      className={`${sidebarMenuButtonVariants(~variant, ~size)} ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </button>
  }
}

module MenuAction = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-action", dataSidebar: "menu-action"}
    <button
      {...toDomProps(props)}
      className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </button>
  }
}

module MenuBadge = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-badge", dataSidebar: "menu-badge"}
    <div
      {...toDomProps(props)}
      className={`text-sidebar-foreground peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
  }
}

module MenuSkeleton = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-skeleton", dataSidebar: "menu-skeleton"}
    <div
      {...toDomProps(props)}
      className={`flex h-8 items-center gap-2 rounded-md px-2 ${props.className->Option.getOr("")}`}
    >
      <div className="bg-muted size-4 rounded-md" />
      <div className="bg-muted h-4 max-w-(--skeleton-width) flex-1" />
      {props.children}
    </div>
  }
}

module MenuSub = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-sub", dataSidebar: "menu-sub"}
    <ul
      {...toDomProps(props)}
      className={`border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </ul>
  }
}

module MenuSubItem = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "sidebar-menu-sub-item", dataSidebar: "menu-sub-item"}
    <li
      {...toDomProps(props)}
      className={`group/menu-sub-item relative ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </li>
  }
}

module MenuSubButton = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let size = props.dataSize->Option.getOr(Size.Md)
    let props = {
      ...props,
      dataSlot: "sidebar-menu-sub-button",
      dataSidebar: "menu-sub-button",
      dataSize: size,
    }
    <a
      {...toDomProps(props)}
      className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </a>
  }
}
