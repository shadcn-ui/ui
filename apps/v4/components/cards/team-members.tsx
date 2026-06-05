"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

const teamMembers = [
  {
    name: "Sofia Davis",
    email: "m@example.com",
    avatar: "/avatars/01.png",
    role: "Owner",
  },
  {
    name: "Jackson Lee",
    email: "p@example.com",
    avatar: "/avatars/02.png",
    role: "Developer",
  },
  {
    name: "Isabella Nguyen",
    email: "i@example.com",
    avatar: "/avatars/03.png",
    role: "Billing",
  },
]

const roles = [
  {
    name: "Viewer",
    description: "Can view and comment.",
  },
  {
    name: "Developer",
    description: "Can view, comment and edit.",
  },
  {
    name: "Billing",
    description: "Can view, comment and manage billing.",
  },
  {
    name: "Owner",
    description: "Admin-level access to all resources.",
  },
]

export function CardsTeamMembers() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {teamMembers.map((member) => (
            <Item key={member.name} className="px-0 py-2">
              <Avatar className="border">
                <AvatarImage src={member.avatar} alt="Image" />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <ItemContent>
                <ItemTitle>{member.name}</ItemTitle>
                <ItemDescription>{member.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto shadow-none"
                    >
                      {member.role} <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Select role..." />
                      <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem key={role.name}>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {role.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {role.description}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
