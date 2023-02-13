"use client"

import * as React from "react"
import Image from "next/image"
import { Workspace as Team, User } from "@/types"
import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps extends DropdownMenuProps {
  user: User
  teams: Team[]
}

export function UserNav({ user, teams, ...props }: UserNavProps) {
  const { setTheme, theme } = useTheme()
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0])

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-[120px] pl-2 data-[state=open]:bg-slate-50"
        >
          <selectedTeam.icon className="mr-2 h-4 w-4 dark:fill-slate-200" />
          {selectedTeam.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuItem className="flex items-center space-x-2">
          <Image
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className="mr-2 rounded-full"
          />
          <div className="grid text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onSelect={() => setSelectedTeam(team)}
          >
            <team.icon className="mr-2 h-4 w-4 dark:fill-slate-200" />
            {team.name}
            {selectedTeam.id === team.id ? (
              <Check className="ml-auto h-4 w-4" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Manage account</DropdownMenuItem>
        <DropdownMenuItem>View API keys</DropdownMenuItem>
        <DropdownMenuItem>Invite team</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Pricing</DropdownMenuItem>
        <DropdownMenuItem>Terms & policies</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⌥⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
