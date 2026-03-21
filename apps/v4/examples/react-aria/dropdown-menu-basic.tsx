"use client"

import { Button } from "@/examples/react-aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/react-aria/ui/dropdown-menu";

export function DropdownMenuBasic() {
  return (
    <DropdownMenuTrigger>
      <Button variant="outline">
        Open
      </Button>
      <DropdownMenu>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem isDisabled>API</DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
