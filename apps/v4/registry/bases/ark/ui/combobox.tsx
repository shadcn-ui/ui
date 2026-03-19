"use client"

import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  createListCollection,
} from "@ark-ui/react/combobox"
import type { CollectionItem, ListCollection } from "@ark-ui/react/combobox"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/ark/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const ComboboxCollectionContext = React.createContext<
  ListCollection<CollectionItem> | null
>(null)


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
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} data-slot="combobox-value" className={className} {...props} />
))
ComboboxValue.displayName = "ComboboxValue"


const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    data-slot="combobox-trigger"
    className={cn("cn-combobox-trigger", className)}
    {...props}
  >
    {children}
    <IconPlaceholder
      lucide="ChevronDownIcon"
      tabler="IconChevronDown"
      hugeicons="ArrowDown01Icon"
      phosphor="CaretDownIcon"
      remixicon="RiArrowDownSLine"
      className="cn-combobox-trigger-icon pointer-events-none"
    />
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
    <InputGroupButton
      variant="ghost"
      size="icon-xs"
      className={cn("cn-combobox-clear", className)}
    >
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        className="cn-combobox-clear-icon pointer-events-none"
      />
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
      <InputGroup className={cn("cn-combobox-input w-auto", className)}>
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
          "cn-combobox-content cn-combobox-content-logical cn-menu-target cn-menu-translucent group/combobox-content",
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
        "cn-combobox-list overflow-y-auto overscroll-contain",
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
      "cn-combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    item={value}
    {...props}
  >
    <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
    <ComboboxPrimitive.ItemIndicator className="cn-combobox-item-indicator">
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
        className="cn-combobox-item-indicator-icon pointer-events-none"
      />
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
      className={cn("cn-combobox-group", className)}
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
    className={cn("cn-combobox-label", className)}
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
    className={cn("cn-combobox-empty", className)}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="combobox-separator"
    className={cn("cn-combobox-separator", className)}
    {...props}
  />
))
ComboboxSeparator.displayName = "ComboboxSeparator"


const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="combobox-chips"
    className={cn("cn-combobox-chips", className)}
    {...props}
  >
    {children}
  </div>
))
ComboboxChips.displayName = "ComboboxChips"

const ComboboxChip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showRemove?: boolean
    value?: string
  }
>(({ className, children, showRemove = true, value, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="combobox-chip"
    className={cn(
      "cn-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
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
          className="cn-combobox-chip-remove"
          data-slot="combobox-chip-remove"
        >
          <IconPlaceholder
            lucide="XIcon"
            tabler="IconX"
            hugeicons="Cancel01Icon"
            phosphor="XIcon"
            remixicon="RiCloseLine"
            className="cn-combobox-chip-indicator-icon pointer-events-none"
          />
        </Button>
      </ComboboxPrimitive.ClearTrigger>
    )}
  </div>
))
ComboboxChip.displayName = "ComboboxChip"


const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    ref={ref}
    data-slot="combobox-chip-input"
    className={cn(
      "cn-combobox-chip-input min-w-16 flex-1 outline-none",
      className
    )}
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
