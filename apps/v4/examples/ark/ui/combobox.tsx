"use client"

import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  createListCollection,
} from "@ark-ui/react/combobox"
import type { CollectionItem, ListCollection } from "@ark-ui/react/combobox"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/examples/ark/lib/utils"
import { Button } from "@/examples/ark/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/ark/ui/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"

const ComboboxCollectionContext =
  React.createContext<ListCollection<CollectionItem> | null>(null)

type ComboboxRootProps<T extends CollectionItem> = Omit<
  ComboboxPrimitive.RootProps<T>,
  "collection"
> & {
  items?: T[]
  itemToStringValue?: (item: T) => string
  collection?: ListCollection<T>
}

function Combobox<T extends CollectionItem>({
  children,
  items,
  itemToStringValue,
  collection: collectionProp,
  ...props
}: ComboboxRootProps<T>) {
  const collection = React.useMemo(() => {
    if (collectionProp) return collectionProp
    return createListCollection<T>({
      items: items ?? [],
      itemToString: itemToStringValue,
    })
  }, [collectionProp, items, itemToStringValue])

  return (
    <ComboboxCollectionContext.Provider
      value={collection as ListCollection<CollectionItem>}
    >
      <ComboboxPrimitive.Root<T>
        data-slot="combobox"
        collection={collection}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Root>
    </ComboboxCollectionContext.Provider>
  )
}

const ComboboxValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof ark.span>
>(({ className, ...props }, ref) => (
  <ark.span
    ref={ref}
    data-slot="combobox-value"
    className={className}
    {...props}
  />
))
ComboboxValue.displayName = "ComboboxValue"

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    data-slot="combobox-trigger"
    className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
    {...props}
  >
    {children}
    <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxClear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ComboboxPrimitive.ClearTrigger>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.ClearTrigger
    ref={ref}
    data-slot="combobox-clear"
    asChild
    {...props}
  >
    <InputGroupButton variant="ghost" size="icon-xs" className={cn(className)}>
      <XIcon className="pointer-events-none" />
    </InputGroupButton>
  </ComboboxPrimitive.ClearTrigger>
))
ComboboxClear.displayName = "ComboboxClear"

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof ComboboxPrimitive.Input> & {
    children?: React.ReactNode
    showTrigger?: boolean
    showClear?: boolean
  }
>(
  (
    {
      className,
      children,
      disabled = false,
      showTrigger = true,
      showClear = false,
      ...props
    },
    ref
  ) => (
    <ComboboxPrimitive.Control>
      <InputGroup className={cn("w-auto", className)}>
        <ComboboxPrimitive.Input ref={ref} asChild {...props}>
          <InputGroupInput disabled={disabled} />
        </ComboboxPrimitive.Input>
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              asChild
              data-slot="input-group-button"
              className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
              disabled={disabled}
            >
              <ComboboxTrigger />
            </InputGroupButton>
          )}
          {showClear && <ComboboxClear disabled={disabled} />}
        </InputGroupAddon>
        {children}
      </InputGroup>
    </ComboboxPrimitive.Control>
  )
)
ComboboxInput.displayName = "ComboboxInput"

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Content> & {
    anchor?: React.RefObject<HTMLElement | null>
    alignOffset?: number
  }
>(({ className, anchor, alignOffset, ...props }, ref) => (
  <Portal>
    <ComboboxPrimitive.Positioner>
      <ComboboxPrimitive.Content
        ref={ref}
        data-slot="combobox-content"
        className={cn(
          "cn-menu-target cn-menu-translucent group/combobox-content max-h-72 min-w-36 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </ComboboxPrimitive.Positioner>
  </Portal>
))
ComboboxContent.displayName = "ComboboxContent"

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ComboboxPrimitive.List>, "children"> & {
    children:
      | React.ReactNode
      | ((item: CollectionItem, index: number) => React.ReactNode)
  }
>(({ className, children, ...props }, ref) => {
  const collection = React.useContext(ComboboxCollectionContext)

  const resolved =
    typeof children === "function" && collection
      ? collection.items.map((item, index) => children(item, index))
      : (children as React.ReactNode)

  return (
    <ComboboxPrimitive.List
      ref={ref}
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    >
      {resolved}
    </ComboboxPrimitive.List>
  )
})

ComboboxList.displayName = "ComboboxList"

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ComboboxPrimitive.Item>, "item"> & {
    value: CollectionItem
  }
>(({ className, children, value, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    data-slot="combobox-item"
    className={cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    item={value}
    {...props}
  >
    <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
    <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
      <CheckIcon className="pointer-events-none" />
    </ComboboxPrimitive.ItemIndicator>
  </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = "ComboboxItem"

const ComboboxGroupContext = React.createContext<CollectionItem[] | null>(null)

const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.ItemGroup> & {
    items?: CollectionItem[]
  }
>(({ className, items, ...props }, ref) => (
  <ComboboxGroupContext.Provider value={items ?? null}>
    <ComboboxPrimitive.ItemGroup
      ref={ref}
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  </ComboboxGroupContext.Provider>
))
ComboboxGroup.displayName = "ComboboxGroup"

const ComboboxLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.ItemGroupLabel
    ref={ref}
    data-slot="combobox-label"
    className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
    {...props}
  />
))
ComboboxLabel.displayName = "ComboboxLabel"

function ComboboxCollection({
  children,
}: {
  children: React.ReactNode | ((item: CollectionItem) => React.ReactNode)
}) {
  const groupItems = React.useContext(ComboboxGroupContext)

  if (typeof children === "function" && groupItems) {
    return <>{groupItems.map((item) => children(item))}</>
  }

  return <>{children}</>
}

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    data-slot="combobox-empty"
    className={cn(
      "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
      className
    )}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="combobox-separator"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ComboboxSeparator.displayName = "ComboboxSeparator"

const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div>
>(({ className, children, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="combobox-chips"
    className={cn(
      "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
      className
    )}
    {...props}
  >
    {children}
  </ark.div>
))
ComboboxChips.displayName = "ComboboxChips"

const ComboboxChip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ark.div> & {
    showRemove?: boolean
    value?: string
  }
>(({ className, children, showRemove = true, value, ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="combobox-chip"
    className={cn(
      "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
      className
    )}
    {...props}
  >
    {children}
    {showRemove && (
      <ComboboxPrimitive.ClearTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </Button>
      </ComboboxPrimitive.ClearTrigger>
    )}
  </ark.div>
))
ComboboxChip.displayName = "ComboboxChip"

const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    ref={ref}
    data-slot="combobox-chip-input"
    className={cn("min-w-16 flex-1 outline-none", className)}
    {...props}
  />
))
ComboboxChipsInput.displayName = "ComboboxChipsInput"

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
  ComboboxClear,
}
