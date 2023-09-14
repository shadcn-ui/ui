"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/tui/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/tui/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/tui/ui/popover"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/tui/ui/avatar"

type IconAlignment = 'left' | 'right';

interface ComboBoxProps {
  listArray: { label: string, value: string, imagePath?: string, status?: boolean, secondaryText?: string }[],
  alignIcon?: IconAlignment,
  avatarActive?: boolean,
  statusIndicator?: boolean,
  secondaryActive?: boolean
}

const Combobox = ({ listArray, alignIcon = "left", avatarActive = false, statusIndicator = false, secondaryActive = false }: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-[200px] justify-between"
        >
          <div className="flex w-full items-center justify-between">
            <div>
              {value
                ? listArray.find((list) => {
                  return !secondaryActive ? list.value === value : list.value + list.secondaryText === value;
                })?.label
                : "Select from list..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search from list..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {listArray.map((list) => (
              <CommandItem
                key={listArray.indexOf(list)}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
                title={statusIndicator ? (list.status ? "online" : "offline") : list.value}
              >
                {statusIndicator &&
                  <span
                    className={cn(
                      'mr-2 inline-block h-2 w-2 shrink-0 rounded-full',
                      list.status ? 'bg-green-400' : 'bg-gray-200'
                    )}
                  >
                  </span>
                }
                {avatarActive &&
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={list.imagePath} alt={list.value} />
                    <AvatarFallback>CW</AvatarFallback>
                  </Avatar>
                }
                {(alignIcon === 'left' && !avatarActive && !statusIndicator && !secondaryActive) && <Check
                  className={cn(
                    "inset-y-2 left-0 mr-2 flex h-4 w-4 items-center",
                    value === list.value ? "text-indigo-600" : "text-white opacity-0"
                  )}
                />
                }
                {list.label}
                {secondaryActive && <span
                  className={cn(
                    'ml-4 truncate text-gray-500',
                    value === list.value + list.secondaryText ? 'text-indigo-200' : 'text-gray-500'
                  )}
                >
                  {list.secondaryText}
                </span>}
                {alignIcon === 'right' && <Check
                  className={cn(
                    "absolute inset-y-2 right-0 flex h-4 w-4 items-center",
                    value === list.value ? "text-indigo-600" : "text-white opacity-0"
                  )}
                />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
