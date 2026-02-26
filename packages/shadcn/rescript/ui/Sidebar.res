@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

@unboxed
type state =
  | @as("expanded") Expanded
  | @as("collapsed") Collapsed

type sidebar = {
  state: state,
  @as("open") open_: bool,
  setOpen: bool => unit,
  openMobile: bool,
  setOpenMobile: bool => unit,
  isMobile: bool,
  toggleSidebar: unit => unit,
}

type browserWindow
type mediaQueryList
type windowKeyboardEvent

@val external browserWindow: browserWindow = "window"
@val external browserDocument: Dom.document = "document"
@get external windowInnerWidth: browserWindow => int = "innerWidth"
@send external windowMatchMedia: (browserWindow, string) => mediaQueryList = "matchMedia"
@send
external addMediaQueryListener: (mediaQueryList, string, unit => unit) => unit = "addEventListener"
@send
external removeMediaQueryListener: (mediaQueryList, string, unit => unit) => unit =
  "removeEventListener"
@send
external addWindowListener: (browserWindow, string, windowKeyboardEvent => unit) => unit =
  "addEventListener"
@send
external removeWindowListener: (browserWindow, string, windowKeyboardEvent => unit) => unit =
  "removeEventListener"
@get external keyboardEventKey: windowKeyboardEvent => string = "key"
@get external keyboardEventMetaKey: windowKeyboardEvent => bool = "metaKey"
@get external keyboardEventCtrlKey: windowKeyboardEvent => bool = "ctrlKey"
@send external preventDefaultKeyboardEvent: windowKeyboardEvent => unit = "preventDefault"
@set external setDocumentCookie: (Dom.document, string) => unit = "cookie"
@val external mathRandom: unit => float = "Math.random"
@val external objectAssign: ('target, 'source) => 'target = "Object.assign"
@module("@base-ui/react/merge-props")
external mergeProps: (
  BaseUi.Types.props<string, bool>,
  BaseUi.Types.props<string, bool>,
) => BaseUi.Types.props<string, bool> = "mergeProps"

let sidebarCookieName = "sidebar_state"
let sidebarCookieMaxAge = 60 * 60 * 24 * 7
let sidebarWidth = "16rem"
let sidebarWidthMobile = "18rem"
let sidebarWidthIcon = "3rem"
let sidebarKeyboardShortcut = "b"
let mobileBreakpoint = 768

let context: React.Context.t<option<sidebar>> = React.createContext(None)

let useSidebar = () =>
  switch React.useContext(context) {
  | Some(sidebar) => sidebar
  | None => JsError.throwWithMessage("useSidebar must be used within a SidebarProvider.")
  }

let useIsMobile = () => {
  let (isMobile, setIsMobile) = React.useState(() => false)
  React.useEffect0(() => {
    let mediaQuery =
      browserWindow->windowMatchMedia(`(max-width: ${Int.toString(mobileBreakpoint - 1)}px)`)
    let onChange = () => {
      let nextIsMobile = browserWindow->windowInnerWidth < mobileBreakpoint
      setIsMobile(_ => nextIsMobile)
    }

    mediaQuery->addMediaQueryListener("change", onChange)
    onChange()

    Some(() => mediaQuery->removeMediaQueryListener("change", onChange))
  })
  isMobile
}

@unboxed
type variant =
  | @as("sidebar") Sidebar
  | @as("floating") Floating
  | @as("inset") Inset

@unboxed
type side =
  | @as("left") Left
  | @as("right") Right

@unboxed
type collapsible =
  | @as("offcanvas") Offcanvas
  | @as("icon") Icon
  | @as("none") NotCollapsible

@react.component
let make = (
  ~className="",
  ~children=?,
  ~side=Left,
  ~variant=Sidebar,
  ~collapsible=Offcanvas,
  ~props: option<BaseUi.Types.DomProps.t>=?,
  ~dir: option<string>=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~rootProps: option<BaseUi.Types.DomProps.t>=?,
) => {
  let {isMobile, state, openMobile, setOpenMobile} = useSidebar()
  let props: BaseUi.Types.DomProps.t = switch props {
  | Some(props) => props
  | None => {}
  }
  let rootProps: BaseUi.Types.DomProps.t = switch rootProps {
  | Some(rootProps) => objectAssign(props, rootProps)
  | None => props
  }

  if collapsible == NotCollapsible {
    <div
      {...rootProps}
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="sidebar"
      className={`bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col ${className}`}
    />
  } else if isMobile {
    let mobileStyle =
      ReactDOM.Style._dictToStyle(Dict.make())->ReactDOM.Style.unsafeAddProp(
        "--sidebar-width",
        sidebarWidthMobile,
      )
    <Sheet
      ?id
      ?style
      ?onClick
      ?onKeyDown
      open_={openMobile}
      onOpenChange={(nextOpen, _) => setOpenMobile(nextOpen)}
    >
      <Sheet.Content
        ?dir
        dataSidebar="sidebar"
        dataSlot="sidebar"
        dataMobile="true"
        className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
        side={side == Right ? Side.Right : Side.Left}
        style={mobileStyle}
        showCloseButton={false}
      >
        <Sheet.Header className="sr-only">
          <Sheet.Title> {"Sidebar"->React.string} </Sheet.Title>
          <Sheet.Description> {"Displays the mobile sidebar."->React.string} </Sheet.Description>
        </Sheet.Header>
        <div className="flex h-full w-full flex-col" ?children />
      </Sheet.Content>
    </Sheet>
  } else {
    let desktopGapClass = switch variant {
    | Floating
    | Inset => "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
    | Sidebar => "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
    }
    let desktopContainerClass = switch variant {
    | Floating
    | Inset => "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
    | Sidebar => "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l"
    }

    <div
      dataState={(state :> string)}
      dataCollapsible={switch state {
      | Collapsed => (collapsible :> string)
      | Expanded => ""
      }}
      dataSide={(side :> string)}
      dataVariant={(variant :> string)}
      dataSlot="sidebar"
      className="group peer text-sidebar-foreground hidden md:block"
    >
      <div
        dataSlot="sidebar-gap"
        className={`relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 ${desktopGapClass}`}
      />
      <div
        {...rootProps}
        ?id
        ?style
        ?onClick
        ?onKeyDown
        dataSlot="sidebar-container"
        dataSide={(side :> string)}
        className={`fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex ${desktopContainerClass} ${className}`}
      >
        <div
          dataSidebar="sidebar"
          dataSlot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1"
          ?children
        />
      </div>
    </div>
  }
}

module Provider = {
  @react.component
  let make = (
    ~defaultOpen=true,
    ~open_: option<bool>=?,
    ~onOpenChange: option<bool => unit>=?,
    ~className="",
    ~children=?,
    ~props: option<BaseUi.Types.DomProps.t>=?,
    ~id=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~style: option<ReactDOM.Style.t>=?,
    ~rootProps: option<BaseUi.Types.DomProps.t>=?,
  ) => {
    let isMobile = useIsMobile()
    let (openMobile, setOpenMobileState) = React.useState(() => false)
    let (internalOpen, setInternalOpenState) = React.useState(() => defaultOpen)
    let isOpen = open_->Option.getOr(internalOpen)
    let setSidebarCookie = (nextOpen: bool) =>
      browserDocument->setDocumentCookie(
        `${sidebarCookieName}=${nextOpen ? "true" : "false"}; path=/; max-age=${Int.toString(
            sidebarCookieMaxAge,
          )}`,
      )
    let setOpenMobile = (nextOpen: bool) => setOpenMobileState(_ => nextOpen)
    let setOpen = (nextOpen: bool) => {
      switch onOpenChange {
      | Some(setOpenProp) => setOpenProp(nextOpen)
      | None => setInternalOpenState(_ => nextOpen)
      }
      setSidebarCookie(nextOpen)
    }
    let toggleSidebar = () =>
      if isMobile {
        setOpenMobileState(previousOpen => !previousOpen)
      } else {
        switch open_ {
        | Some(currentOpen) =>
          let nextOpen = !currentOpen
          switch onOpenChange {
          | Some(setOpenProp) => setOpenProp(nextOpen)
          | None => ()
          }
          setSidebarCookie(nextOpen)
        | None =>
          setInternalOpenState(previousOpen => {
            let nextOpen = !previousOpen
            switch onOpenChange {
            | Some(setOpenProp) => setOpenProp(nextOpen)
            | None => ()
            }
            setSidebarCookie(nextOpen)
            nextOpen
          })
        }
      }

    React.useEffect(() => {
      let handleKeyDown = (event: windowKeyboardEvent) => {
        if (
          event->keyboardEventKey == sidebarKeyboardShortcut &&
            (event->keyboardEventMetaKey || event->keyboardEventCtrlKey)
        ) {
          event->preventDefaultKeyboardEvent
          toggleSidebar()
        }
      }

      browserWindow->addWindowListener("keydown", handleKeyDown)
      Some(() => browserWindow->removeWindowListener("keydown", handleKeyDown))
    }, [isMobile, isOpen, openMobile])

    let contextValue = Some({
      state: isOpen ? Expanded : Collapsed,
      open_: isOpen,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    })

    let baseStyle =
      ReactDOM.Style._dictToStyle(Dict.make())
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width", sidebarWidth)
      ->ReactDOM.Style.unsafeAddProp("--sidebar-width-icon", sidebarWidthIcon)
    let resolvedStyle = switch style {
    | Some(style) => ReactDOM.Style.combine(baseStyle, style)
    | None => baseStyle
    }
    let props: BaseUi.Types.DomProps.t = switch props {
    | Some(props) => props
    | None => {}
    }
    let rootProps: BaseUi.Types.DomProps.t = switch rootProps {
    | Some(rootProps) => objectAssign(props, rootProps)
    | None => props
    }

    module ContextProvider = {
      let make = React.Context.provider(context)
    }

    <ContextProvider value={contextValue}>
      <div
        {...rootProps}
        ?id
        ?onClick
        ?onKeyDown
        ?children
        style={resolvedStyle}
        dataSlot="sidebar-wrapper"
        className={`group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full ${className}`}
      />
    </ContextProvider>
  }
}

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~variant=Button.Variant.Ghost,
    ~size=Button.Size.IconSm,
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
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let {toggleSidebar} = useSidebar()
    let resolvedOnClick = switch onClick {
    | Some(onClick) => onClick
    | None => _ => toggleSidebar()
    }
    <button
      ?id
      ?style
      onClick={resolvedOnClick}
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
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~render=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      render: React.null,
      children,
      dataSlot: "sidebar-group-label",
      dataSidebar: "group-label",
      className: `text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0 ${className}`,
    }
    BaseUi.Render.use({defaultTagName: "div", props, ?render})
  }
}

module GroupAction = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~render=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      render: React.null,
      children,
      dataSlot: "sidebar-group-action",
      dataSidebar: "group-action",
      className: `text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden ${className}`,
    }
    BaseUi.Render.use({defaultTagName: "button", props, ?render})
  }
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

type menuButtonTooltipConfig = {
  children?: React.element,
  className?: string,
  id?: string,
  style?: ReactDOM.Style.t,
  onClick?: JsxEvent.Mouse.t => unit,
  onKeyDown?: JsxEvent.Keyboard.t => unit,
  side?: Side.t,
  sideOffset?: float,
  align?: Align.t,
  alignOffset?: float,
}

type menuButtonTooltip =
  | TooltipText(string)
  | TooltipConfig(menuButtonTooltipConfig)

module MenuButton = {
  module Variant = {
    @unboxed
    type t =
      | @as("default") Default
      | @as("outline") Outline
  }
  module Size = {
    @unboxed
    type t =
      | @as("default") Default
      | @as("sm") Sm
      | @as("lg") Lg
  }

  let sidebarMenuButtonVariants = (~variant=Variant.Default, ~size=Size.Default) => {
    let base = "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0"
    let variantClass = switch variant {
    | Variant.Outline => "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    | Default => ""
    }
    let sizeClass = switch size {
    | Sm => "h-7 text-xs"
    | Lg => "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    | Default => "h-8"
    }
    `${base} ${variantClass} ${sizeClass}`
  }

  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Default,
    ~size=Size.Default,
    ~isActive=false,
    ~tooltip: option<menuButtonTooltip>=?,
    ~buttonProps: option<BaseUi.Types.props<string, bool>>=?,
    ~render=?,
    ~children=React.null,
    ~type_=?,
    ~ariaDisabled=?,
  ) => {
    let {isMobile, state} = useSidebar()
    let resolvedRender = switch tooltip {
    | Some(_) => Some(<Tooltip.Trigger />)
    | None => render
    }
    let baseProps: BaseUi.Types.props<string, bool> = {
      render: React.null,
      children,
      dataSlot: "sidebar-menu-button",
      dataSidebar: "menu-button",
      dataSize: (size :> string),
      dataActive: isActive,
      ?type_,
      ?ariaDisabled,
      className: `${sidebarMenuButtonVariants(~variant, ~size)} ${className}`,
    }
    let mergedProps = switch buttonProps {
    | Some(buttonProps) => mergeProps(baseProps, buttonProps)
    | None => baseProps
    }
    let props = switch (resolvedRender, mergedProps.type_) {
    | (Some(_), _) => mergedProps
    | (None, Some(_)) => mergedProps
    | (None, None) => {...mergedProps, type_: "button"}
    }
    let render = resolvedRender
    let comp = BaseUi.Render.use({defaultTagName: "button", props, ?render})
    switch tooltip {
    | None => comp
    | Some(tooltip) =>
      let (
        tooltipChildren,
        tooltipClassName,
        tooltipId,
        tooltipStyle,
        tooltipOnClick,
        tooltipOnKeyDown,
        tooltipSide,
        tooltipSideOffset,
        tooltipAlign,
        tooltipAlignOffset,
      ) = switch tooltip {
      | TooltipText(text) => (
          Some(React.string(text)),
          None,
          None,
          None,
          None,
          None,
          None,
          None,
          None,
          None,
        )
      | TooltipConfig(config) => (
          config.children,
          config.className,
          config.id,
          config.style,
          config.onClick,
          config.onKeyDown,
          config.side,
          config.sideOffset,
          config.align,
          config.alignOffset,
        )
      }
      let hidden = state != Collapsed || isMobile
      let contentClassName = tooltipClassName->Option.getOr("")
      let popupRender = <div hidden />
      <Tooltip>
        {comp}
        <BaseUi.Tooltip.Portal>
          <BaseUi.Tooltip.Positioner
            align={tooltipAlign->Option.getOr(Align.Center)}
            alignOffset={tooltipAlignOffset->Option.getOr(0.)}
            side={tooltipSide->Option.getOr(Side.Right)}
            sideOffset={tooltipSideOffset->Option.getOr(4.)}
            className="isolate z-50"
          >
            <BaseUi.Tooltip.Popup
              id=?tooltipId
              style=?tooltipStyle
              onClick=?tooltipOnClick
              onKeyDown=?tooltipOnKeyDown
              dataSlot="tooltip-content"
              className={`data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs ${contentClassName}`}
              render={hidden ? popupRender : <div />}
            >
              {tooltipChildren->Option.getOr(React.null)}
              <BaseUi.Tooltip.Arrow
                className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5"
              />
            </BaseUi.Tooltip.Popup>
          </BaseUi.Tooltip.Positioner>
        </BaseUi.Tooltip.Portal>
      </Tooltip>
    }
  }
}

module MenuAction = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~render=?,
    ~actionProps: option<BaseUi.Types.props<string, bool>>=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~type_=?,
    ~ariaLabel=?,
    ~ariaDisabled=?,
    ~showOnHover=false,
  ) => {
    let showOnHoverClass = showOnHover
      ? "peer-data-active/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 md:opacity-0"
      : ""
    let baseProps: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?type_,
      ?ariaLabel,
      ?ariaDisabled,
      render: React.null,
      children,
      dataSlot: "sidebar-menu-action",
      dataSidebar: "menu-action",
      className: `text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0 ${showOnHoverClass} ${className}`,
    }
    let mergedProps = switch actionProps {
    | Some(actionProps) => mergeProps(baseProps, actionProps)
    | None => baseProps
    }
    let props = switch (render, mergedProps.type_) {
    | (Some(_), _) => mergedProps
    | (None, Some(_)) => mergedProps
    | (None, None) => {...mergedProps, type_: "button"}
    }
    BaseUi.Render.use({
      defaultTagName: "button",
      props,
      ?render,
    })
  }
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
  let make = (
    ~className="",
    ~children=React.null,
    ~showIcon=false,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
  ) => {
    let (width, _setWidth) = React.useState(() => `${Float.toString(mathRandom() *. 40. +. 50.)}%`)
    let textStyle =
      ReactDOM.Style._dictToStyle(Dict.make())->ReactDOM.Style.unsafeAddProp(
        "--skeleton-width",
        width,
      )
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="sidebar-menu-skeleton"
      dataSidebar="menu-skeleton"
      className={`flex h-8 items-center gap-2 rounded-md px-2 ${className}`}
    >
      {showIcon
        ? <Skeleton className="size-4 rounded-md" dataSidebar="menu-skeleton-icon" />
        : React.null}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        dataSidebar="menu-skeleton-text"
        style={textStyle}
      />
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
  module Size = {
    @unboxed
    type t =
      | @as("sm") Sm
      | @as("md") Md
  }

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
    ~size=Size.Md,
    ~isActive=false,
    ~dataSize: option<Size.t>=?,
    ~dataActive: option<bool>=?,
    ~linkProps: option<BaseUi.Types.props<string, bool>>=?,
  ) => {
    let size = dataSize->Option.getOr(size)
    let dataActive = dataActive->Option.getOr(isActive)
    let baseProps: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?href,
      ?target,
      render: React.null,
      ?disabled,
      ?children,
      dataActive,
      dataSlot: "sidebar-menu-sub-button",
      dataSidebar: "menu-sub-button",
      dataSize: (size :> string),
      className: `text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0 ${className}`,
    }
    let props = switch linkProps {
    | Some(linkProps) => mergeProps(baseProps, linkProps)
    | None => baseProps
    }
    BaseUi.Render.use({defaultTagName: "a", props, ?render})
  }
}
