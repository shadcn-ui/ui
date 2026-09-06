"use client"

import * as React from "react"

import { Button } from "@/styles/aria-nova/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/styles/aria-nova/ui/dropdown-menu"

export function DropdownMenuRadioGroupDemo() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenuTrigger>
      <Button variant="outline">Open</Button>
      <DropdownMenu className="w-32">
        <DropdownMenuGroup
          selectionMode="single"
          selectedKeys={[position]}
          onSelectionChange={(keys) => setPosition([...keys][0] as string)}
        >
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuItem id="top">Top</DropdownMenuItem>
          <DropdownMenuItem id="bottom">Bottom</DropdownMenuItem>
          <DropdownMenuItem id="right">Right</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
