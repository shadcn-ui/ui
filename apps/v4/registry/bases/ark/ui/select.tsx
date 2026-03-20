"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import {
  Select as SelectPrimitive,
  createListCollection,
} from "@ark-ui/react/select"
import type { ListCollection } from "@ark-ui/react/select"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface SelectItemData {
  value: string
  label: string
  disabled?: boolean
}

function collectItems(children: React.ReactNode): SelectItemData[] {
  const items: SelectItemData[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    const props = child.props as Record<string, unknown>

    // SelectItem - collect its value + text
    if (props?.["data-select-item-scan"] === true || props?.value != null) {
      // Only treat as item if it has a string value (like radix SelectItem)
      const typeName = (child.type as { displayName?: string })?.displayName
      if (typeName === "SelectItem" || props?.["data-select-item-scan"]) {
        items.push({
          value: String(props.value),
          label: extractText(props.children as React.ReactNode),
          disabled: !!props.disabled,
        })
        return
      }
    }

    // Recurse into groups, content, etc.
    if (props?.children) {
      items.push(...collectItems(props.children as React.ReactNode))
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

const SelectCollectionContext = React.createContext<
  ListCollection<SelectItemData> | null
>(null)

type SelectRootProps = Omit<
  React.ComponentProps<typeof SelectPrimitive.Root>,
  "collection" | "defaultValue" | "value" | "onValueChange"
> & {
  collection?: ListCollection<SelectItemData>
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

function Select({
  children,
  collection: collectionProp,
  defaultValue,
  value,
  onValueChange,
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

  const handleValueChange = React.useCallback(
    (details: { value: string[]; items: SelectItemData[] }) => {
      onValueChange?.(details.value[0] ?? "")
    },
    [onValueChange]
  )

  return (
    <SelectCollectionContext.Provider value={collection}>
      <SelectPrimitive.Root<SelectItemData>
        data-slot="select"
        collection={collection}
        defaultValue={defaultValue ? [defaultValue] : undefined}
        {...(value !== undefined ? { value: value ? [value] : [] } : {})}
        onValueChange={onValueChange ? handleValueChange : undefined}
        {...props}
      >
        {children}
        <SelectPrimitive.HiddenSelect />
      </SelectPrimitive.Root>
    </SelectCollectionContext.Provider>
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Control className="cn-select-trigger-control">
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn("cn-select-trigger", className)}
        {...props}
      >
        {children}
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          className="cn-select-trigger-icon"
        />
      </SelectPrimitive.Trigger>
    </SelectPrimitive.Control>
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ValueText>) {
  return (
    <SelectPrimitive.ValueText
      data-slot="select-value"
      className={cn("cn-select-value", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <Portal>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Content
          data-slot="select-content"
          className={cn("cn-select-content", className)}
          {...props}
        >
          {children}
        </SelectPrimitive.Content>
      </SelectPrimitive.Positioner>
    </Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroupLabel>) {
  return (
    <SelectPrimitive.ItemGroupLabel
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "item"> & {
  value: string
  disabled?: boolean
}) {
  const collection = React.useContext(SelectCollectionContext)
  const item = React.useMemo(() => {
    if (!collection) return { value, label: extractText(children) }
    return (
      collection.find(value) ?? {
        value,
        label: extractText(children),
      }
    )
  }, [collection, value, children])

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-select-item-scan
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
}
SelectItem.displayName = "SelectItem"

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroup>) {
  return (
    <SelectPrimitive.ItemGroup
      data-slot="select-group"
      className={cn("cn-select-group", className)}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="select-separator"
      className={cn("cn-select-separator", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
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
    </ark.div>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
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
    </ark.div>
  )
}

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
