import { Avatar, AvatarFallback, AvatarImage } from "@/styles/ark-nova/ui/avatar"
import { Button } from "@/styles/ark-nova/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/ark-nova/ui/dropdown-menu"
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"

export function DropdownMenuAvatar() {
  return (
    <DropdownMenu positioning={{ placement: "bottom-end" }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem value="account">
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem value="billing">
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem value="notifications">
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem value="sign-out">
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
