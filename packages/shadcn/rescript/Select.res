open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Select.Root {...props} />

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.Group
      {...props}
      dataSlot="select-group"
      className={`scroll-my-1 p-1 ${props.className->Option.getOr("")}`}
    />
}

module Value = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.Value
      {...props}
      dataSlot="select-value"
      className={`flex flex-1 text-left ${props.className->Option.getOr("")}`}
    />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let size = props.dataSize->Option.getOr(Size.Default)
    let hasWidthOverride =
      switch props.className {
      | Some(className) => String.includes(className, "w-")
      | None => false
      }
    let widthClass = hasWidthOverride ? "" : "w-fit"
    <BaseUi.Select.Trigger
      {...props}
      dataSlot="select-trigger"
      dataSize={size}
      className={`border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex ${widthClass} items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
      <BaseUi.Select.Icon render={<Icons.ChevronDown className="text-muted-foreground pointer-events-none size-4" />} />
    </BaseUi.Select.Trigger>
  }
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let alignItemWithTrigger = props.dataAlignTrigger->Option.getOr(true)
    <BaseUi.Select.Portal>
      <BaseUi.Select.Positioner
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(4.)}
        align={props.align->Option.getOr(Align.Center)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        alignItemWithTrigger
        className="isolate z-50"
      >
        <BaseUi.Select.Popup
          {...props}
          dataSlot="select-content"
          dataAlignTrigger={alignItemWithTrigger}
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1 duration-100 data-[align-trigger=true]:animate-none ${props.className->Option.getOr("")}`}
        >
          <BaseUi.Select.ScrollUpArrow
            dataSlot="select-scroll-up-button"
            className="bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4"
          >
            <Icons.ChevronUp />
          </BaseUi.Select.ScrollUpArrow>
          <BaseUi.Select.List>{props.children}</BaseUi.Select.List>
          <BaseUi.Select.ScrollDownArrow
            dataSlot="select-scroll-down-button"
            className="bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4"
          >
            <Icons.ChevronDown />
          </BaseUi.Select.ScrollDownArrow>
        </BaseUi.Select.Popup>
      </BaseUi.Select.Positioner>
    </BaseUi.Select.Portal>
  }
}

module Label = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.GroupLabel
      {...props}
      dataSlot="select-label"
      className={`text-muted-foreground px-1.5 py-1 text-xs ${props.className->Option.getOr("")}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.Item
      {...props}
      dataSlot="select-item"
      className={`focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 ${props.className->Option.getOr("")}`}
    >
      <BaseUi.Select.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {props.children}
      </BaseUi.Select.ItemText>
      <BaseUi.Select.ItemIndicator
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <Icons.Check className="pointer-events-none" />
      </BaseUi.Select.ItemIndicator>
    </BaseUi.Select.Item>
}

module Separator = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.Separator
      {...props}
      dataSlot="select-separator"
      className={`bg-border pointer-events-none -mx-1 my-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module ScrollUpButton = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.ScrollUpArrow
      {...props}
      dataSlot="select-scroll-up-button"
      className={`bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <Icons.ChevronUp />
    </BaseUi.Select.ScrollUpArrow>
}

module ScrollDownButton = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Select.ScrollDownArrow
      {...props}
      dataSlot="select-scroll-down-button"
      className={`bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <Icons.ChevronDown />
    </BaseUi.Select.ScrollDownArrow>
}
