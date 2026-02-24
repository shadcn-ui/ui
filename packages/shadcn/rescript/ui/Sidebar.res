@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

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

let sidebarMenuButtonVariants = (~variant=Variant.Default, ~size=Size.Default) => {
  let base = "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0"
  let variantClass = switch variant {
  | Outline => "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
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
  let sizeClass = switch size {
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

@react.component
let make = (
  ~className="",
  ~children=?,
  ~collapsible="offcanvas",
  ~dataCollapsible=collapsible,
  ~dataSide="left",
  ~dataVariant=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
) => {
  dataCollapsible == "none"
    ? {
        <div
          ?id
          ?style
          ?onClick
          ?onKeyDown
          ?children
          dataSlot="sidebar"
          ?dataVariant
          className={`bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col ${className}`}
        />
      }
    : {
        let sidebar = useSidebar()
        let side = dataSide
        let collapsibleState = sidebar.state == "collapsed" ? dataCollapsible : ""
        <div
          ?id
          ?style
          ?onClick
          ?onKeyDown
          dataState={sidebar.state}
          dataCollapsible={collapsibleState}
          dataSide={side}
          ?dataVariant
          dataSlot="sidebar"
          className="group peer text-sidebar-foreground hidden md:block"
        >
          <div
            dataSlot="sidebar-gap"
            className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
          />
          <div
            dataSlot="sidebar-container"
            dataSide={side}
            className={`fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l ${className}`}
          >
            <div
              dataSidebar="sidebar"
              dataSlot="sidebar-inner"
              ?dataVariant
              className="bg-sidebar group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1"
              ?children
            />
          </div>
        </div>
      }
}

module Provider = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~onClick=?, ~onKeyDown=?, ~style=?) => {
    let style = switch style {
    | Some(value) => value
    | None => ReactDOM.Style._dictToStyle(Dict.make())
    }
    let style =
      style
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width", sidebarWidth)
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width-icon", "3rem")
    <div
      ?id
      ?onClick
      ?onKeyDown
      ?children
      style
      dataSlot="sidebar-wrapper"
      className={`group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full ${className}`}
    />
  }
}

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Ghost,
    ~size=Size.IconSm,
    ~nativeButton=?,
    ~disabled=?,
    ~style=?,
    ~onClick=_ => (),
    ~type_=?,
    ~ariaLabel=?,
    ~render=?,
  ) => {
    let {toggleSidebar} = useSidebar()
    <Button
      className
      variant
      size
      ?nativeButton
      ?disabled
      ?style
      ?type_
      ?render
      ?ariaLabel
      dataSidebar="trigger"
      dataSlot="sidebar-trigger"
      onClick={event => {
        onClick(event)
        toggleSidebar()
      }}
    >
      <Icons.PanelLeft className="cn-rtl-flip" />
      <span className="sr-only"> {"Toggle Sidebar"->React.string} </span>
    </Button>
  }
}

module Rail = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <button
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      ariaLabel="Toggle Sidebar"
      tabIndex={-1}
      dataSidebar="rail"
      dataSlot="sidebar-rail"
      className={`hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2 ${className}`}
      title="Toggle Sidebar"
    />
}

module Inset = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <main
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-inset"
      className={`bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 ${className}`}
    />
}

module Input = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~name=?,
    ~placeholder=?,
    ~value=?,
    ~defaultValue=?,
    ~onValueChange=?,
    ~disabled=?,
    ~readOnly=?,
    ~required=?,
    ~type_=?,
    ~maxLength=?,
    ~spellCheck=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~ariaLabel=?,
    ~ariaRoledescription=?,
  ) =>
    <BaseUi.Input
      ?id
      ?style
      ?name
      ?placeholder
      ?value
      ?defaultValue
      ?onValueChange
      ?disabled
      ?readOnly
      ?required
      ?type_
      ?maxLength
      ?spellCheck
      ?onClick
      ?onKeyDown
      ?ariaLabel
      ?ariaRoledescription
      ?children
      dataSlot="sidebar-input"
      dataSidebar="input"
      className={`bg-background h-8 w-full shadow-none ${className}`}
    />
}

module Header = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-header"
      dataSidebar="header"
      className={`flex flex-col gap-2 p-2 ${className}`}
    />
}

module Footer = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-footer"
      dataSidebar="footer"
      className={`flex flex-col gap-2 p-2 ${className}`}
    />
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <BaseUi.Separator
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-separator"
      dataSidebar="separator"
      className={`bg-sidebar-border mx-2 w-auto ${className}`}
    />
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-content"
      dataSidebar="content"
      className={`no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden ${className}`}
    />
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-group"
      dataSidebar="group"
      className={`relative flex w-full min-w-0 flex-col p-2 ${className}`}
    />
}

module GroupLabel = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-group-label"
      dataSidebar="group-label"
      className={`text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0 ${className}`}
    />
}

module GroupAction = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <button
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      type_="button"
      dataSlot="sidebar-group-action"
      dataSidebar="group-action"
      className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden ${className}`}
    />
}

module GroupContent = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-group-content"
      dataSidebar="group-content"
      className={`w-full text-sm ${className}`}
    />
}

module Menu = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <ul
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-menu"
      dataSidebar="menu"
      className={`flex w-full min-w-0 flex-col gap-0 ${className}`}
    />
}

module MenuItem = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <li
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-menu-item"
      dataSidebar="menu-item"
      className={`group/menu-item relative ${className}`}
    />
}

module MenuButton = {
  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Default,
    ~size=Size.Default,
    ~render=?,
    ~children=React.null,
    ~type_=?,
    ~ariaDisabled=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      render: React.null,
      children,
      dataSlot: "sidebar-menu-button",
      dataSidebar: "menu-button",
      dataSize: size,
      ?ariaDisabled,
      className: `${sidebarMenuButtonVariants(~variant, ~size)} ${className}`,
    }
    let props = switch (render, type_) {
    | (Some(_), _) => props
    | (None, Some(type_)) => {...props, type_}
    | (None, None) => {...props, type_: "button"}
    }
    BaseUi.Render.use({defaultTagName: "button", props, ?render})
  }
}

module MenuAction = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~showOnHover=false,
  ) =>
    <button
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      type_="button"
      dataSlot="sidebar-menu-action"
      dataSidebar="menu-action"
      className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden ${showOnHover
          ? "md:opacity-0"
          : ""} [&>svg]:shrink-0 ${className}`}
    />
}

module MenuBadge = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-menu-badge"
      dataSidebar="menu-badge"
      className={`text-sidebar-foreground peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 ${className}`}
    />
}

module MenuSkeleton = {
  @react.component
  let make = (~className="", ~children=React.null, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="sidebar-menu-skeleton"
      dataSidebar="menu-skeleton"
      className={`flex h-8 items-center gap-2 rounded-md px-2 ${className}`}
    >
      <div className="bg-muted size-4 rounded-md" />
      <div className="bg-muted h-4 max-w-(--skeleton-width) flex-1" />
      {children}
    </div>
  }
}

module MenuSub = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <ul
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-menu-sub"
      dataSidebar="menu-sub"
      className={`border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden ${className}`}
    />
}

module MenuSubItem = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <li
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar-menu-sub-item"
      dataSidebar="menu-sub-item"
      className={`group/menu-sub-item relative ${className}`}
    />
}

module MenuSubButton = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~href=?,
    ~target=?,
    ~render=?,
    ~disabled=?,
    ~dataSize=Size.Md,
    ~dataActive=?,
  ) => {
    let size = dataSize
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?href,
      ?target,
      render: React.null,
      ?disabled,
      ?children,
      ?dataActive,
      dataSlot: "sidebar-menu-sub-button",
      dataSidebar: "menu-sub-button",
      dataSize: size,
      className: `text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0 ${className}`,
    }
    BaseUi.Render.use({defaultTagName: "a", props, ?render})
  }
}
