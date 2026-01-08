"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/examples/base/ui/avatar"
import { Button } from "@/examples/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/base/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/examples/base/ui/item"
import { ChevronDownIcon } from "lucide-react"

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
]

export function ItemDropdown() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="w-fit" />}
        >
          Select <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 [--radius:0.65rem]" align="end">
          <DropdownMenuGroup>
            {people.map((person) => (
              <DropdownMenuItem key={person.username} className="p-0">
                <Item size="sm" className="w-full p-2">
                  <ItemMedia>
                    <Avatar className="size-8">
                      <AvatarImage src={person.avatar} className="grayscale" />
                      <AvatarFallback>
                        {person.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="gap-0.5">
                    <ItemTitle>{person.username}</ItemTitle>
                    <ItemDescription>{person.email}</ItemDescription>
                  </ItemContent>
                </Item>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
