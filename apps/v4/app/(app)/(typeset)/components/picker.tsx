"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon } from "lucide-react"

import { cn } from "@/registry/bases/base/lib/utils"

// Copy of create's picker with lucide icons instead of IconPlaceholder (its
// useDesignSystemSearchParams read must not mount on /typeset).
function Picker({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function PickerTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        "relative w-36 shrink-0 touch-manipulation rounded-xl p-3 ring-1 ring-foreground/10 select-none hover:bg-muted focus-visible:ring-foreground/50 focus-visible:outline-none disabled:opacity-50 data-popup-open:bg-muted md:w-full md:rounded-lg md:px-2.5 md:py-2",
        className
      )}
      {...props}
    />
  )
}

function PickerContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 20,
  anchor,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "anchor"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "cn-menu-target z-50 no-scrollbar max-h-(--available-height) w-[calc(var(--available-width)-(--spacing(6)))] min-w-32 origin-(--transform-origin) translate-y-2 overflow-x-hidden overflow-y-auto rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl outline-none md:w-52 dark:bg-neutral-800/90 dark:ring-neutral-700/50 data-closed:overflow-hidden",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
      {/* Clicks inside the preview iframe never reach this document, so this
          shield catches outside-clicks over it. left-54 clears the card. */}
      <div className="absolute inset-y-0 right-0 left-54 z-40 bg-transparent" />
    </MenuPrimitive.Portal>
  )
}

function PickerGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function PickerLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-neutral-400 data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function PickerItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 focus:**:text-neutral-100 data-inset:pl-8 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

// Lets pickers preview an item's value on hover/highlight by declaring a
// single onItemPreview on the group instead of wiring every radio item.
const PickerPreviewContext = React.createContext<
  ((value: string) => void) | null
>(null)

function PickerRadioGroup({
  onItemPreview,
  ...props
}: MenuPrimitive.RadioGroup.Props & {
  onItemPreview?: (value: string) => void
}) {
  return (
    <PickerPreviewContext.Provider value={onItemPreview ?? null}>
      <MenuPrimitive.RadioGroup
        data-slot="dropdown-menu-radio-group"
        {...props}
      />
    </PickerPreviewContext.Provider>
  )
}

function PickerRadioItem({
  className,
  children,
  value,
  onMouseMove,
  onFocus,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  const onItemPreview = React.useContext(PickerPreviewContext)

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      value={value}
      // Previews apply when the pointer settles: every mousemove re-arms the
      // provider's trailing timer, so nothing applies while the cursor is in
      // motion. Base UI moves DOM focus to the highlighted item, so onFocus
      // covers keyboard (arrow key) browsing.
      onMouseMove={(event) => {
        onMouseMove?.(event)
        onItemPreview?.(value as string)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        onItemPreview?.(value as string)
      }}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-8 pl-2 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 focus:**:text-neutral-100 data-inset:pl-8 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-4 pointer-coarse:size-5" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function PickerSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700",
        className
      )}
      {...props}
    />
  )
}

function PickerShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-neutral-400! group-focus/dropdown-menu-item:text-neutral-100",
        className
      )}
      {...props}
    />
  )
}

export {
  Picker,
  PickerTrigger,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerShortcut,
}
