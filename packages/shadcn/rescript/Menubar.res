open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Menubar
    {...props}
    dataSlot="menubar"
    className={`bg-background flex h-8 items-center gap-0.5 rounded-lg border p-[3px] ${props.className->Option.getOr("")}`}
  />

module Menu = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Root {...props} dataSlot="menubar-menu" />
}

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Group {...props} dataSlot="menubar-group" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Portal {...props} dataSlot="menubar-portal" />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Trigger
      {...props}
      dataSlot="menubar-trigger"
      className={`hover:bg-muted aria-expanded:bg-muted flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Portal>
      <BaseUi.Menu.Positioner
        className="isolate z-50 outline-none"
        align={props.align->Option.getOr(Align.Start)}
        alignOffset={props.alignOffset->Option.getOr(-4.)}
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(8.)}
      >
        <BaseUi.Menu.Popup
          {...props}
          dataSlot="menubar-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target min-w-36 rounded-lg p-1 shadow-md ring-1 duration-100 ${props.className->Option.getOr("")}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(Variant.Default)
    <BaseUi.Menu.Item
      {...props}
      dataSlot="menubar-item"
      dataVariant={variant}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! not-data-[variant=destructive]:focus:**:text-accent-foreground group/menubar-item gap-1.5 rounded-md px-1.5 py-1 text-sm data-disabled:opacity-50 data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module CheckboxItem = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.CheckboxItem
      {...props}
      dataSlot="menubar-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${props.className->Option.getOr("")}`}
    >
      <span className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <BaseUi.Menu.CheckboxItemIndicator>{"✓"->React.string}</BaseUi.Menu.CheckboxItemIndicator>
      </span>
      {props.children}
    </BaseUi.Menu.CheckboxItem>
}

module RadioGroup = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.RadioGroup {...props} dataSlot="menubar-radio-group" />
}

module RadioItem = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.RadioItem
      {...props}
      dataSlot="menubar-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <span className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <BaseUi.Menu.RadioItemIndicator>{"✓"->React.string}</BaseUi.Menu.RadioItemIndicator>
      </span>
      {props.children}
    </BaseUi.Menu.RadioItem>
}

module Label = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.GroupLabel
      {...props}
      dataSlot="menubar-label"
      className={`px-1.5 py-1 text-sm font-medium data-inset:pl-7 ${props.className->Option.getOr("")}`}
    />
}

module Separator = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Separator
      {...props}
      dataSlot="menubar-separator"
      className={`bg-border -mx-1 my-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Shortcut = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <span

      className={`text-muted-foreground group-focus/menubar-item:text-accent-foreground ml-auto text-xs tracking-widest ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </span>
}

module Sub = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.SubmenuRoot {...props} dataSlot="menubar-sub" />
}

module SubTrigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.SubmenuTrigger
      {...props}
      dataSlot="menubar-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
      <span className="cn-rtl-flip ml-auto">{">"->React.string}</span>
    </BaseUi.Menu.SubmenuTrigger>
}

module SubContent = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Menu.Portal>
      <BaseUi.Menu.Positioner
        className="isolate z-50 outline-none"
        align={props.align->Option.getOr(Align.Start)}
        alignOffset={props.alignOffset->Option.getOr(-3.)}
        side={props.side->Option.getOr(Side.Right)}
        sideOffset={props.sideOffset->Option.getOr(0.)}
      >
        <BaseUi.Menu.Popup
          {...props}
          dataSlot="menubar-sub-content"
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-32 rounded-lg p-1 shadow-lg ring-1 duration-100 ${props.className->Option.getOr("")}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
}
