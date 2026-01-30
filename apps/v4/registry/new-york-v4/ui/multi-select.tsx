"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

type MultiSelectOption = {
  label: React.ReactNode
  value: string
}

type MultiSelectContextValue = {
  value: string[]
  onValueChange: (value: string[]) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(
  null
)

function useMultiSelectContext(component: string) {
  const context = React.useContext(MultiSelectContext)

  if (!context) {
    throw new Error(
      `<${component} /> must be used within a <MultiSelect /> component.`
    )
  }

  return context
}

type MultiSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  children: React.ReactNode
}

function MultiSelect({ value, onValueChange, children }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <MultiSelectContext.Provider
      value={{ value, onValueChange, open, setOpen }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  )
}

MultiSelect.displayName = "MultiSelect"

type MultiSelectTriggerProps = React.ComponentProps<typeof Button>

function MultiSelectTrigger({
  className,
  children,
  ...props
}: MultiSelectTriggerProps) {
  const { open } = useMultiSelectContext("MultiSelectTrigger")

  return (
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        data-slot="multi-select-trigger"
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-fit min-w-[240px] items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span className="flex-1 truncate text-left">{children}</span>
        <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
      </Button>
    </PopoverTrigger>
  )
}

MultiSelectTrigger.displayName = "MultiSelectTrigger"

type MultiSelectValueProps = {
  options: MultiSelectOption[]
  placeholder?: React.ReactNode
  maxBadges?: number
  className?: string
  children?: React.ReactNode
}

function MultiSelectValue({
  options,
  placeholder = "Select options",
  maxBadges = 2,
  className,
  children,
}: MultiSelectValueProps) {
  const { value } = useMultiSelectContext("MultiSelectValue")

  if (children) return <>{children}</>

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  )

  if (selectedOptions.length === 0) {
    return (
      <span
        data-slot="multi-select-value"
        className={cn("text-muted-foreground text-sm", className)}
      >
        {placeholder}
      </span>
    )
  }

  const visibleOptions = selectedOptions.slice(0, maxBadges)
  const hiddenCount = selectedOptions.length - visibleOptions.length

  return (
    <div
      data-slot="multi-select-value"
      className={cn("flex flex-wrap items-center gap-1 text-xs", className)}
    >
      {visibleOptions.map((option) => (
        <Badge key={option.value} variant="secondary">
          {option.label}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <span className="text-muted-foreground">+{hiddenCount} more</span>
      )}
    </div>
  )
}

MultiSelectValue.displayName = "MultiSelectValue"

type MultiSelectContentProps = React.ComponentProps<typeof PopoverContent> & {
  searchPlaceholder?: string
}

function MultiSelectContent({
  className,
  children,
  searchPlaceholder = "Search...",
  align = "start",
  ...props
}: MultiSelectContentProps) {
  useMultiSelectContext("MultiSelectContent")

  return (
    <PopoverContent
      align={align}
      data-slot="multi-select-content"
      className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)}
      {...props}
    >
      <Command>
        <CommandInput placeholder={searchPlaceholder} className="h-9" />
        <CommandList className="max-h-64">
          <CommandEmpty>No results found.</CommandEmpty>
          {children}
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

MultiSelectContent.displayName = "MultiSelectContent"

type MultiSelectGroupProps = React.ComponentProps<typeof CommandGroup>

function MultiSelectGroup({ className, ...props }: MultiSelectGroupProps) {
  return (
    <CommandGroup
      data-slot="multi-select-group"
      className={cn("p-1", className)}
      {...props}
    />
  )
}

MultiSelectGroup.displayName = "MultiSelectGroup"

type MultiSelectLabelProps = React.ComponentProps<"div">

function MultiSelectLabel({ className, ...props }: MultiSelectLabelProps) {
  return (
    <div
      data-slot="multi-select-label"
      className={cn(
        "text-muted-foreground px-2 py-1 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}

MultiSelectLabel.displayName = "MultiSelectLabel"

type MultiSelectItemProps = {
  value: string
  label?: React.ReactNode
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  showCheckbox?: boolean
}

function MultiSelectItem({
  value,
  label,
  children,
  className,
  disabled,
  showCheckbox = true,
}: MultiSelectItemProps) {
  const {
    value: selectedValues,
    onValueChange,
    setOpen,
  } = useMultiSelectContext("MultiSelectItem")

  const isSelected = selectedValues.includes(value)

  function toggle() {
    const nextValues =
      value === "__none__"
        ? []
        : isSelected
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value]

    onValueChange(nextValues)
  }

  const displayLabel = children ?? label ?? value

  return (
    <CommandItem
      data-slot="multi-select-item"
      value={value}
      disabled={disabled}
      onSelect={() => {
        toggle()
        setOpen(true)
      }}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={toggle}
            className="pointer-events-none"
          />
        )}
        <span className="text-sm">{displayLabel}</span>
      </div>
      {isSelected && showCheckbox && (
        <CheckIcon className="text-muted-foreground size-4" />
      )}
    </CommandItem>
  )
}

MultiSelectItem.displayName = "MultiSelectItem"

export {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectLabel,
  MultiSelectTrigger,
  MultiSelectValue,
}
