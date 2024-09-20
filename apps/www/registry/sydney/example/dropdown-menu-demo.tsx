"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/registry/sydney/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/sydney/ui/dropdown-menu"

export function DropdownMenuCheckboxes() {
  const [selectedOptions, setSelectedOptions] = React.useState([])

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    )
  }

  const getButtonLabel = () => {
    if (selectedOptions.length === 0) return "Select Options"
    return `Selected: ${selectedOptions.join(", ")}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{getButtonLabel()}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedOptions.includes("Account Settings")}
          onCheckedChange={() => toggleOption("Account Settings")}
        >
          Account Settings
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedOptions.includes("Support")}
          onCheckedChange={() => toggleOption("Support")}
        >
          Support
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedOptions.includes("License")}
          onCheckedChange={() => toggleOption("License")}
        >
          License
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedOptions.includes("Signout")}
          onCheckedChange={() => toggleOption("Signout")}
        >
          Signout
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuCheckboxes
