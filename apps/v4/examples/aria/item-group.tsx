import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/styles/aria-nova/ui/avatar"
import { Button } from "@/styles/aria-nova/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/styles/aria-nova/ui/item"

const people = [
  {
    username: "alex",
    avatar: "/avatars/01.png",
    email: "alex@example.com",
  },
  {
    username: "jamie",
    avatar: "/avatars/02.png",
    email: "jamie@example.com",
  },
  {
    username: "taylor",
    avatar: "/avatars/03.png",
    email: "taylor@example.com",
  },
]

export function ItemGroupExample() {
  return (
    <ItemGroup className="max-w-sm">
      {people.map((person, index) => (
        <Item key={person.username} variant="outline">
          <ItemMedia>
            <Avatar>
              <AvatarImage src={person.avatar} className="grayscale" />
              <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{person.username}</ItemTitle>
            <ItemDescription>{person.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
