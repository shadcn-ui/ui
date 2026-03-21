"use client"

import * as React from "react"
import type { Selection } from "react-aria-components"
import { Button } from "@/examples/react-aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/examples/react-aria/ui/dropdown-menu"

export function DropdownMenuCheckboxes() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["status-bar"])
  )

  return (
    <DropdownMenuTrigger>
      <Button variant="outline">
        Open
      </Button>
      <DropdownMenu className="w-40">
        <DropdownMenuGroup
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuItem id="status-bar">
            Status Bar
          </DropdownMenuItem>
          <DropdownMenuItem id="activity-bar" isDisabled>
            Activity Bar
          </DropdownMenuItem>
          <DropdownMenuItem id="panel">
            Panel
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
