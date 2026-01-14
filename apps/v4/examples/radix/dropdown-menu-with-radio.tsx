"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/examples/radix/ui/dropdown-menu"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

export function DropdownMenuWithRadio() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit">
          Radio Group
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">
              <ArrowUpIcon />
              Top
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              <ArrowDownIcon />
              Bottom
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right" disabled>
              <ArrowRightIcon />
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
