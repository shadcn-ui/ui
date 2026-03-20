"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Portal } from "@ark-ui/react/portal"
import {
  createListCollection,
  Select as SelectPrimitive,
} from "@ark-ui/react/select"
import type { ListCollection } from "@ark-ui/react/select"

import { cn } from "@/examples/ark/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

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

const SelectCollectionContext =
  React.createContext<ListCollection<SelectItemData> | null>(null)

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
    <SelectPrimitive.Control className="">
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(
          "gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 text-muted-foreground" />
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
      className={cn("flex flex-1 text-left", className)}
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
          className={cn(
            "min-w-36 rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
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
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
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
}
SelectItem.displayName = "SelectItem"

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemGroup>) {
  return (
    <SelectPrimitive.ItemGroup
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
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
      className={cn("-mx-1 my-1 h-px bg-border", className)}
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
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
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
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
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
