@@directive("'use client'")

open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => <BaseUi.Combobox.Root {...props} />

module Value = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Value {...props} dataSlot="combobox-value" />
}

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Trigger
      {...props}
      dataSlot="combobox-trigger"
      className={`[&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      {props.children}
      <Icons.ChevronDown className="text-muted-foreground pointer-events-none size-4" />
    </BaseUi.Combobox.Trigger>
}

module Clear = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Clear
      {...props} dataSlot="combobox-clear" render={<Button dataVariant=Ghost dataSize=IconXs />}
    >
      <Icons.X className="pointer-events-none" />
    </BaseUi.Combobox.Clear>
}

module Input = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let disabled = props.disabled->Option.getOr(false)
    let rootProps: props<'value, 'checked> = {dataSlot: "input-group"}
    let controlProps: props<'value, 'checked> = {dataSlot: "input-group-control"}
    let addonProps: props<'value, 'checked> = {
      dataSlot: "input-group-addon",
      dataAlign: DataAlign.InlineEnd,
    }
    <div
      {...toDomProps(rootProps)}
      role="group"
      className={`border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-disabled:bg-input/50 dark:has-disabled:bg-input/80 group/input-group relative flex h-8 min-w-0 items-center rounded-lg border transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 w-auto ${props.className->Option.getOr(
          "",
        )}`}
    >
      <BaseUi.Combobox.Input
        {...props}
        render={<input
          {...toDomProps(controlProps)}
          className="aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:ring-destructive/20 bg-transparent border-0 border-input dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:bg-transparent dark:disabled:bg-transparent disabled:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none file:bg-transparent file:border-0 file:font-medium file:h-6 file:inline-flex file:text-foreground file:text-sm flex-1 focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-ring/50 h-8 md:text-sm min-w-0 outline-none placeholder:text-muted-foreground px-2.5 py-1 ring-0 rounded-none shadow-none text-base transition-colors w-full"
          disabled={disabled}
        />}
      />
      <div
        {...toDomProps(addonProps)}
        role="group"
        className="[&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 cursor-text flex font-medium gap-2 group-data-[disabled=true]/input-group:opacity-50 h-auto has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] items-center justify-center order-last pr-2 py-1.5 select-none text-muted-foreground text-sm"
      >
        <BaseUi.Combobox.Trigger
          dataSize=IconXs
          dataSlot="input-group-button"
          tabIndex={0}
          disabled={disabled}
          className="[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-muted aria-expanded:text-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 bg-clip-padding border border-transparent dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-muted/50 data-pressed:bg-transparent disabled:opacity-50 disabled:pointer-events-none flex focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 font-medium gap-2 group-has-data-[slot=combobox-clear]/input-group:hidden group/button has-[>svg]:p-0 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 hover:bg-muted hover:text-foreground items-center justify-center outline-none p-0 rounded-[calc(var(--radius)-3px)] select-none shadow-none shrink-0 size-6 text-sm transition-all whitespace-nowrap"
        >
          <Icons.ChevronDown className="text-muted-foreground pointer-events-none size-4" />
        </BaseUi.Combobox.Trigger>
      </div>
      {props.children}
    </div>
  }
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let hasAnchor = props.anchor->Option.isSome
    <BaseUi.Combobox.Portal>
      <BaseUi.Combobox.Positioner
        side={props.side->Option.getOr(Side.Bottom)}
        sideOffset={props.sideOffset->Option.getOr(6.)}
        align={props.align->Option.getOr(Align.Start)}
        alignOffset={props.alignOffset->Option.getOr(0.)}
        className="isolate z-50"
      >
        <BaseUi.Combobox.Popup
          {...props}
          dataSlot="combobox-content"
          dataChips=hasAnchor
          className={`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 cn-menu-target group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg shadow-md ring-1 duration-100 data-[chips=true]:min-w-(--anchor-width) *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none ${props.className->Option.getOr(
              "",
            )}`}
        >
          {props.children}
        </BaseUi.Combobox.Popup>
      </BaseUi.Combobox.Positioner>
    </BaseUi.Combobox.Portal>
  }
}

module List = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.List
      {...props}
      dataSlot="combobox-list"
      className={`no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0 ${props.className->Option.getOr(
          "",
        )}`}
    />
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Item
      {...props}
      dataSlot="combobox-item"
      className={`data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
      <BaseUi.Combobox.ItemIndicator
        render={<span
          className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
        >
          <Icons.Check className="pointer-events-none" />
        </span>}
      />
    </BaseUi.Combobox.Item>
}

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Group {...props} dataSlot="combobox-group" />
}

module Label = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.GroupLabel
      {...props}
      dataSlot="combobox-label"
      className={`text-muted-foreground px-2 py-1.5 text-xs ${props.className->Option.getOr("")}`}
    />
}

module Collection = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Collection {...props} dataSlot="combobox-collection" />
}

module Empty = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Empty
      {...props}
      dataSlot="combobox-empty"
      className={`text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex ${props.className->Option.getOr(
          "",
        )}`}
    />
}

module Separator = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Separator
      {...props}
      dataSlot="combobox-separator"
      className={`bg-border -mx-1 my-1 h-px ${props.className->Option.getOr("")}`}
    />
}

module Chips = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Chips
      {...props}
      dataSlot="combobox-chips"
      className={`dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-8 flex-wrap items-center gap-1 rounded-lg border bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1 ${props.className->Option.getOr(
          "",
        )}`}
    />
}

module Chip = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Chip
      {...props}
      dataSlot="combobox-chip"
      className={`bg-muted text-foreground flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0 ${props.className->Option.getOr(
          "",
        )}`}
    >
      {props.children}
      <BaseUi.Combobox.ChipRemove
        render={<Button dataVariant=Ghost dataSize=IconXs>
          <Icons.X className="pointer-events-none" />
        </Button>}
        className="-ml-1 opacity-50 hover:opacity-100"
        dataSlot="combobox-chip-remove"
      />
    </BaseUi.Combobox.Chip>
}

module ChipsInput = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Combobox.Input
      {...props}
      dataSlot="combobox-chip-input"
      className={`min-w-16 flex-1 outline-none ${props.className->Option.getOr("")}`}
    />
}

let useComboboxAnchor = () => React.useRef(Nullable.null)
