"use client"

import * as React from "react"
import { Select as SelectPrimitive, createListCollection } from "@ark-ui/react/select"
import type { ListCollection, CollectionItem } from "@ark-ui/react/select"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

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

const SelectCollectionContext = React.createContext<
  ListCollection<SelectItemData> | null
>(null)

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
      className={cn("cn-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Indicator>
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          className="cn-select-trigger-icon"
        />
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
    className={cn("cn-select-value", className)}
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
        className={cn("cn-select-content", className)}
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
    className={cn("cn-select-label", className)}
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
    return (
      collection.find(value) ?? { value, label: extractText(children) }
    )
  }, [collection, value, children])

  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn("cn-select-item", className)}
      item={item}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="cn-select-item-indicator">
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
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
    className={cn("cn-select-group", className)}
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
    className={cn("cn-select-separator", className)}
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
    className={cn("cn-select-scroll-up-button", className)}
    {...props}
  >
    <IconPlaceholder
      lucide="ChevronUpIcon"
      tabler="IconChevronUp"
      hugeicons="ArrowUp01Icon"
      phosphor="CaretUpIcon"
      remixicon="RiArrowUpSLine"
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
    className={cn("cn-select-scroll-down-button", className)}
    {...props}
  >
    <IconPlaceholder
      lucide="ChevronDownIcon"
      tabler="IconChevronDown"
      hugeicons="ArrowDown01Icon"
      phosphor="CaretDownIcon"
      remixicon="RiArrowDownSLine"
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
