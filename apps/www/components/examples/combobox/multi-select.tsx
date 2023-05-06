"use client"

import * as React from "react"
import { CheckedState } from "@radix-ui/react-checkbox"
import { ChevronsUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
    checked: false,
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    checked: false,
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    checked: false,
  },
  {
    value: "remix",
    label: "Remix",
    checked: false,
  },
  {
    value: "astro",
    label: "Astro",
    checked: false,
  },
]

export function MultiSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [checkedFrameworks, setCheckedFrameworks] =
    React.useState<{ checked: CheckedState; value: string; label: string }[]>(
      frameworks
    )
  const atLeastOneChecked = checkedFrameworks.find(
    (item) => item.checked === true
  )
  console.log(atLeastOneChecked)

  const handleChecked = (id: string, checked: CheckedState) => {
    const newItems = checkedFrameworks.map((item) =>
      item.value === id
        ? {
            ...item,
            checked: checked,
          }
        : item
    )
    setCheckedFrameworks(newItems)
  }
  return (
    <div className="p-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Select frameworks
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command onClick={(e) => e.preventDefault()}>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No framework found.</CommandEmpty>
            {atLeastOneChecked && (
              <CommandGroup>
                {checkedFrameworks.map((framework) => {
                  if (framework.checked) {
                    return <Badge className="mr-2">{framework.label}</Badge>
                  }
                })}
              </CommandGroup>
            )}

            <CommandGroup heading="framework">
              {checkedFrameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      value={framework.value}
                      onCheckedChange={(checked) =>
                        handleChecked(framework.value, checked)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {framework.label}
                    </label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
