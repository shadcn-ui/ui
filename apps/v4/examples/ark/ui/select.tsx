"use client"

import * as React from "react"
import { Portal } from "@ark-ui/react/portal"
import {
  createListCollection,
  Select as SelectPrimitive,
} from "@ark-ui/react/select"
import type { CollectionItem, ListCollection } from "@ark-ui/react/select"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

// ---------------------------------------------------------------------------
// Helpers – build a ListCollection from declarative <SelectItem> children
// ---------------------------------------------------------------------------

interface SelectItemData {
  value: string
  label: string
  disabled?: boolean
}

function collectItems(children: React.ReactNode): SelectItemData[] {
  const items: SelectItemData[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    // SelectItem – collect its value + text
    if (
      (child.type as { displayName?: string })?.displayName === "SelectItem" ||
      (child.props as Record<string, unknown>)?.["data-slot"] === "select-item"
    ) {
      const props = child.props as {
        value?: string
        disabled?: boolean
        children?: React.ReactNode
      }
      if (props.value != null) {
        items.push({
          value: String(props.value),
          label: extractText(props.children),
          disabled: props.disabled,
        })
      }
      return
    }

    // Recurse into groups, content, etc.
    const props = child.props as { children?: React.ReactNode }
    if (props?.children) {
      items.push(...collectItems(props.children))
    }
  })
  return items
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children)
  }
  return ""
}

// ---------------------------------------------------------------------------
// Context – share the collection so items can look themselves up
// ---------------------------------------------------------------------------

const SelectCollectionContext =
  React.createContext<ListCollection<SelectItemData> | null>(null)

// ---------------------------------------------------------------------------
// Select (Root)
// ---------------------------------------------------------------------------

type SelectRootProps = Omit<
  SelectPrimitive.RootProps<SelectItemData>,
  "collection" | "defaultValue" | "value"
> & {
  collection?: ListCollection<SelectItemData>
  defaultValue?: string | string[]
  value?: string | string[]
}

function Select({
  children,
  collection: collectionProp,
  defaultValue,
  value,
  ...props
}: SelectRootProps) {
  const items = React.useMemo(
    () => (collectionProp ? [] : collectItems(children)),
    [children, collectionProp]
  )

  const collection = React.useMemo(
    () =>
      collectionProp ??
      createListCollection<SelectItemData>({
        items,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
        isItemDisabled: (item) => !!item.disabled,
      }),
    [collectionProp, items]
  )

  // Normalize string values to arrays for ark-ui compatibility
  const normalizedDefaultValue = defaultValue
    ? Array.isArray(defaultValue)
      ? defaultValue
      : [defaultValue]
    : undefined
  const normalizedValue = value
    ? Array.isArray(value)
      ? value
      : [value]
    : undefined

  return (
    <SelectCollectionContext.Provider value={collection}>
      <SelectPrimitive.Root<SelectItemData>
        data-slot="select"
        collection={collection}
        defaultValue={normalizedDefaultValue}
        value={normalizedValue}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectCollectionContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// SelectTrigger – wraps Control + Trigger
// ---------------------------------------------------------------------------

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Control>
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      className={cn(
        "gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Indicator>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </SelectPrimitive.Indicator>
    </SelectPrimitive.Trigger>
  </SelectPrimitive.Control>
))
SelectTrigger.displayName = "SelectTrigger"

// ---------------------------------------------------------------------------
// SelectValue
// ---------------------------------------------------------------------------

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SelectPrimitive.ValueText>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ValueText
    ref={ref}
    data-slot="select-value"
    className={cn("flex flex-1 text-left", className)}
    {...props}
  />
))
SelectValue.displayName = "SelectValue"

// ---------------------------------------------------------------------------
// SelectContent – Portal + Positioner + Content
// ---------------------------------------------------------------------------

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.Content>
>(({ className, ...props }, ref) => (
  <Portal>
    <SelectPrimitive.Positioner>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        className={cn(
          "min-w-36 rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </SelectPrimitive.Positioner>
  </Portal>
))
SelectContent.displayName = "SelectContent"

// ---------------------------------------------------------------------------
// SelectLabel – maps to ark ItemGroupLabel
// ---------------------------------------------------------------------------

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroupLabel
    ref={ref}
    data-slot="select-label"
    className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

// ---------------------------------------------------------------------------
// SelectItem – bridges radix's value-based API to ark's item-based API
// ---------------------------------------------------------------------------

const SelectItem = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "item"> & {
    value: string
    disabled?: boolean
  }
>(({ className, children, value, disabled, ...props }, ref) => {
  const collection = React.useContext(SelectCollectionContext)
  const item = React.useMemo(() => {
    if (!collection) return { value, label: extractText(children) }
    return collection.find(value) ?? { value, label: extractText(children) }
  }, [collection, value, children])

  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      item={item}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = "SelectItem"

// ---------------------------------------------------------------------------
// SelectGroup – maps to ark ItemGroup
// ---------------------------------------------------------------------------

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive.ItemGroup>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemGroup
    ref={ref}
    data-slot="select-group"
    className={cn("scroll-my-1 p-1", className)}
    {...props}
  />
))
SelectGroup.displayName = "SelectGroup"

// ---------------------------------------------------------------------------
// SelectSeparator – ark has no separator primitive, use a plain div
// ---------------------------------------------------------------------------

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

// ---------------------------------------------------------------------------
// SelectScrollUpButton / SelectScrollDownButton – no-op placeholders
// (ark handles scroll internally; these exist for radix export parity)
// ---------------------------------------------------------------------------

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <ChevronUpIcon
    />
  </div>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <ChevronDownIcon
    />
  </div>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

// ---------------------------------------------------------------------------
// Exports – match radix export names exactly
// ---------------------------------------------------------------------------

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
