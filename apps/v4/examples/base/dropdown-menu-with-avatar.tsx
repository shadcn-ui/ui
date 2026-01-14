import { Avatar, AvatarFallback, AvatarImage } from "@/examples/base/ui/avatar"
import { Button } from "@/examples/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/base/ui/dropdown-menu"
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react"

export function DropdownMenuWithAvatar() {
  const menuContent = (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheckIcon />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BellIcon />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOutIcon />
        Sign Out
      </DropdownMenuItem>
    </>
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-12 justify-start px-2 md:max-w-[200px]"
              />
            }
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">shadcn</span>
              <span className="text-muted-foreground truncate text-xs">
                shadcn@example.com
              </span>
            </div>
            <ChevronsUpDownIcon className="text-muted-foreground ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--anchor-width) min-w-56">
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full" />
            }
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
