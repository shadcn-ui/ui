"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/new-york/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

const filterData = [
  {
    value: "limit",
    label: "Limit",
  },
  {
    value: "offset",
    label: "Offset",
  },
  {
    value: "order",
    label: "Order",
  },
  {
    value: "sort",
    label: "Sort",
  },
]

export default function ComboboxNewOption() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState(filterData)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? filters.find((filter) => filter.value === value)?.label
            : "Select filter..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search filter..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {filters.map((filter) => (
              <CommandItem
                key={filter.value}
                value={filter.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                {filter.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === filter.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
            {search &&
              !filters.some(
                (filter) => filter.value.toLowerCase() === search.toLowerCase()
              ) && (
                <CommandItem
                  value={search}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    setFilters([
                      ...filters,
                      { value: currentValue, label: search },
                    ])
                    setOpen(false)
                  }}
                >
                  <span className="truncate">Add "{search}"</span>
                  <CheckIcon className="ml-auto h-4 w-4 opacity-0" />
                </CommandItem>
              )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
