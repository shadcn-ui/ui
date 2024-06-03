"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/default/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search filter..."
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
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === filter.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {filter.label}
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
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <span className="truncate">Add "{search}"</span>
                </CommandItem>
              )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
