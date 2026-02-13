type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.ContextMenu.Root {...props} dataSlot="context-menu" />

module Portal = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.Portal {...props} dataSlot="context-menu-portal" />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.Trigger
      {...props}
      dataSlot="context-menu-trigger"
      className={`select-none ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.Portal>
      <BaseUi.ContextMenu.Positioner
        className="isolate z-50 outline-none"
        align={props.align->Option.getOr(BaseUi.Types.Start)}
        alignOffset={props.alignOffset->Option.getOr(4.)}
        side={props.side->Option.getOr(BaseUi.Types.Right)}
        sideOffset={props.sideOffset->Option.getOr(0.)}
      >
        <BaseUi.ContextMenu.Popup
          {...props}
          dataSlot="context-menu-content"
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 outline-none ${props.className->Option.getOr("")}`}
        />
      </BaseUi.ContextMenu.Positioner>
    </BaseUi.ContextMenu.Portal>
}

module Group = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.Group {...props} dataSlot="context-menu-group" />
}

module Label = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.GroupLabel
      {...props}
      dataSlot="context-menu-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7 ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr("default")
    <BaseUi.ContextMenu.Item
      {...props}
      dataSlot="context-menu-item"
      dataVariant={variant}
      className={`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive focus:*:[svg]:text-accent-foreground group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module CheckboxItem = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.CheckboxItem
      {...props}
      dataSlot="context-menu-checkbox-item"
      className={`focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <span className="pointer-events-none absolute right-2">
        <BaseUi.ContextMenu.CheckboxItemIndicator>{"✓"->React.string}</BaseUi.ContextMenu.CheckboxItemIndicator>
      </span>
      {props.children->Option.getOr(React.null)}
    </BaseUi.ContextMenu.CheckboxItem>
}

module RadioGroup = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.RadioGroup {...props} dataSlot="context-menu-radio-group" />
}

module RadioItem = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.RadioItem
      {...props}
      dataSlot="context-menu-radio-item"
      className={`focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <span className="pointer-events-none absolute right-2">
        <BaseUi.ContextMenu.RadioItemIndicator>{"✓"->React.string}</BaseUi.ContextMenu.RadioItemIndicator>
      </span>
      {props.children->Option.getOr(React.null)}
    </BaseUi.ContextMenu.RadioItem>
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.Separator
      {...props}
      dataSlot="context-menu-separator"
      className={`bg-border -mx-1 my-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Shortcut = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <span

      className={`text-muted-foreground group-focus/context-menu-item:text-accent-foreground ml-auto text-xs tracking-widest ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </span>
}

module Sub = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.SubmenuRoot {...props} dataSlot="context-menu-sub" />
}

module SubContent = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <Content
      {...props}
      dataSlot="context-menu-sub-content"
      className={`shadow-lg ${props.className->Option.getOr("")}`}
      side={BaseUi.Types.Right}
    />
}

module SubTrigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.ContextMenu.SubmenuTrigger
      {...props}
      dataSlot="context-menu-sub-trigger"
      className={`focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
      <span className="cn-rtl-flip ml-auto">{">"->React.string}</span>
    </BaseUi.ContextMenu.SubmenuTrigger>
}
