type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.Menu.Root {...props} dataSlot="dropdown-menu" />

module Portal = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.Portal {...props} dataSlot="dropdown-menu-portal" />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.Trigger {...props} dataSlot="dropdown-menu-trigger" />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.Portal>
      <BaseUi.Menu.Positioner
        className="isolate z-50 outline-none"
        align={props.align->Option.getOr(BaseUi.Types.Align.Start)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        side={props.side->Option.getOr(BaseUi.Types.Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(4.)}
      >
        <BaseUi.Menu.Popup
          {...props}
          dataSlot="dropdown-menu-content"
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 outline-none data-closed:overflow-hidden ${props.className->Option.getOr("")}`}
        />
      </BaseUi.Menu.Positioner>
    </BaseUi.Menu.Portal>
}

module Group = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.Group {...props} dataSlot="dropdown-menu-group" />
}

module Label = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.GroupLabel
      {...props}
      dataSlot="dropdown-menu-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7 ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr(BaseUi.Types.Variant.Default)
    <BaseUi.Menu.Item
      {...props}
      dataSlot="dropdown-menu-item"
      dataVariant={variant}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module CheckboxItem = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.CheckboxItem
      {...props}
      dataSlot="dropdown-menu-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"

      >
        <BaseUi.Menu.CheckboxItemIndicator>{"✓"->React.string}</BaseUi.Menu.CheckboxItemIndicator>
      </span>
      {props.children->Option.getOr(React.null)}
    </BaseUi.Menu.CheckboxItem>
}

module RadioGroup = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.RadioGroup {...props} dataSlot="dropdown-menu-radio-group" />
}

module RadioItem = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.RadioItem
      {...props}
      dataSlot="dropdown-menu-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"

      >
        <BaseUi.Menu.RadioItemIndicator>{"✓"->React.string}</BaseUi.Menu.RadioItemIndicator>
      </span>
      {props.children->Option.getOr(React.null)}
    </BaseUi.Menu.RadioItem>
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.Separator
      {...props}
      dataSlot="dropdown-menu-separator"
      className={`bg-border -mx-1 my-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Shortcut = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <span

      className={`text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </span>
}

module Sub = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.SubmenuRoot {...props} dataSlot="dropdown-menu-sub" />
}

module SubTrigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Menu.SubmenuTrigger
      {...props}
      dataSlot="dropdown-menu-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
      <span className="cn-rtl-flip ml-auto">{">"->React.string}</span>
    </BaseUi.Menu.SubmenuTrigger>
}

module SubContent = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <Content
      {...props}
      dataSlot="dropdown-menu-sub-content"
      align={props.align->Option.getOr(BaseUi.Types.Align.Start)}
      alignOffset={props.alignOffset->Option.getOr(-3.)}
      side={props.side->Option.getOr(BaseUi.Types.Side.Right)}
      sideOffset={props.sideOffset->Option.getOr(0.)}
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground w-auto min-w-[96px] rounded-md p-1 shadow-lg ring-1 duration-100 ${props.className->Option.getOr("")}`}
    />
}
