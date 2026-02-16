open BaseUi.Types

let navigationMenuTriggerStyle = () =>
  "bg-background hover:bg-muted focus:bg-muted data-open:hover:bg-muted data-open:focus:bg-muted data-open:bg-muted/50 focus-visible:ring-ring/50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center disabled:pointer-events-none outline-none"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let align = props.align->Option.getOr(Align.Start)
  <BaseUi.NavigationMenu.Root
    {...props}
    dataSlot="navigation-menu"
    className={`group/navigation-menu relative flex max-w-max flex-1 items-center justify-center ${props.className->Option.getOr("")}`}
  >
    {props.children}
    <BaseUi.NavigationMenu.Portal>
      <BaseUi.NavigationMenu.Positioner
        side={Side.Bottom}
        sideOffset={8.}
        align
        alignOffset={0.}
        className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0"
      >
        <BaseUi.NavigationMenu.Popup className="bg-popover text-popover-foreground ring-foreground/10 data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg shadow ring-1 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
          <BaseUi.NavigationMenu.Viewport className="relative size-full overflow-hidden" />
        </BaseUi.NavigationMenu.Popup>
      </BaseUi.NavigationMenu.Positioner>
    </BaseUi.NavigationMenu.Portal>
  </BaseUi.NavigationMenu.Root>
}

module List = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.List
      {...props}
      dataSlot="navigation-menu-list"
      className={`group flex flex-1 list-none items-center justify-center gap-0 ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Item
      {...props}
      dataSlot="navigation-menu-item"
      className={`relative ${props.className->Option.getOr("")}`}
    />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Trigger
      {...props}
      dataSlot="navigation-menu-trigger"
      className={`${navigationMenuTriggerStyle()} group ${props.className->Option.getOr("")}`}
    >
      {props.children}
      <Icons.chevronDown
        ariaHidden=true
        className="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
      />
    </BaseUi.NavigationMenu.Trigger>
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Content
      {...props}
      dataSlot="navigation-menu-content"
      className={`data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:ring-foreground/10 data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] h-full w-auto p-1 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none ${props.className->Option.getOr("")}`}
    />
}

module Positioner = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Portal>
      <BaseUi.NavigationMenu.Positioner
        {...props}
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(8.)}
        align={props.align->Option.getOr(Align.Start)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        className={`isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 ${props.className->Option.getOr("")}`}
      >
        <BaseUi.NavigationMenu.Popup className="bg-popover text-popover-foreground ring-foreground/10 data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg shadow ring-1 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
          <BaseUi.NavigationMenu.Viewport className="relative size-full overflow-hidden" />
        </BaseUi.NavigationMenu.Popup>
      </BaseUi.NavigationMenu.Positioner>
    </BaseUi.NavigationMenu.Portal>
}

module Link = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Link
      {...props}
      dataSlot="navigation-menu-link"
      className={`data-active:focus:bg-muted data-active:hover:bg-muted data-active:bg-muted/50 focus-visible:ring-ring/50 hover:bg-muted focus:bg-muted flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none focus-visible:ring-3 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    />
}

module Indicator = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.NavigationMenu.Icon
      {...props}
      dataSlot="navigation-menu-indicator"
      className={`data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden ${props.className->Option.getOr("")}`}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </BaseUi.NavigationMenu.Icon>
}
