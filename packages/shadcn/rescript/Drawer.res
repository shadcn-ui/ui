@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

module DrawerPrimitive = {
  module Root = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Root"
  }

  module Trigger = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Trigger"
  }

  module Portal = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Portal"
  }

  module Close = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Close"
  }

  module Overlay = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Overlay"
  }

  module Content = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Content"
  }

  module Title = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Title"
  }

  module Description = {
    @module("vaul") @scope("Drawer")
    external make: React.component<props<'value, 'checked>> = "Description"
  }
}

@react.component
let make = (
  ~children=?,
  ~open_=?,
  ~defaultOpen=?,
  ~onOpenChange=?,
  ~onOpenChangeComplete=?,
  ~modal=?,
) =>
  <DrawerPrimitive.Root
    ?children ?open_ ?defaultOpen ?onOpenChange ?onOpenChangeComplete ?modal dataSlot="drawer"
  />

module Trigger = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~disabled=?,
    ~asChild=?,
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
  ) =>
    <DrawerPrimitive.Trigger
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?asChild
      ?render
      ?nativeButton
      ?type_
      ?ariaLabel
      ?children
      dataSlot="drawer-trigger"
      className
    />
}

module Portal = {
  @react.component
  let make = (~children=?, ~container=?) =>
    <DrawerPrimitive.Portal ?children ?container dataSlot="drawer-portal" />
}

module Close = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~disabled=?,
    ~asChild=?,
    ~render=?,
    ~nativeButton=?,
    ~type_=?,
    ~ariaLabel=?,
  ) =>
    <DrawerPrimitive.Close
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?disabled
      ?asChild
      ?render
      ?nativeButton
      ?type_
      ?ariaLabel
      ?children
      dataSlot="drawer-close"
      className
    />
}

module Overlay = {
  @react.component
  let make = (
    ~className="",
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~keepMounted=?,
  ) =>
    <DrawerPrimitive.Overlay
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?keepMounted
      dataSlot="drawer-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs ${className}`}
    />
}

module Content = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~keepMounted=?,
  ) =>
    <Portal>
      <Overlay />
      <DrawerPrimitive.Content
        ?id
        ?style
        ?onClick
        ?onKeyDown
        ?onKeyDownCapture
        ?keepMounted
        dataSlot="drawer-content"
        className={`bg-background group/drawer-content fixed z-50 flex h-auto flex-col text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm ${className}`}
      >
        <div
          className="bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
        />
        {children}
      </DrawerPrimitive.Content>
    </Portal>
}

module Header = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "drawer-header",
    }
    <div
      {...props}
      className={`flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left ${className}`}
     ?children />
  }
}

module Footer = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "drawer-footer",
    }
    <div {...props} className={`mt-auto flex flex-col gap-2 p-4 ${className}`} ?children />
  }
}

module Title = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <DrawerPrimitive.Title
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="drawer-title"
      className={`text-foreground text-base font-medium ${className}`}
     ?children />
}

module Description = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <DrawerPrimitive.Description
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="drawer-description"
      className={`text-muted-foreground text-sm ${className}`}
     ?children />
}
