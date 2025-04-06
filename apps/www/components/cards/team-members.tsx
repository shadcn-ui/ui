"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

const roles = [
  {
    label: "Viewer",
    description: "Can view and comment.",
  },
  {
    label: "Developer",
    description: "Can view, comment and edit.",
  },
  {
    label: "Billing",
    description: "Can view, comment and manage billing.",
  },
  {
    label: "Owner",
    description: "Admin-level access to all resources.",
  },
]

function RoleSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          {value} <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <Command>
          <CommandInput placeholder="Select new role..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup className="p-1.5">
              {roles.map((role) => (
                <CommandItem
                  key={role.label}
                  onSelect={() => {
                    onChange(role.label)
                    setOpen(false)
                  }}
                  className="flex flex-col items-start px-4 py-2"
                >
                  <p>{role.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CardsTeamMembers() {
  const [rolesByEmail, setRolesByEmail] = useState<Record<string, string>>({
    "m@example.com": "Owner",
    "p@example.com": "Member",
    "i@example.com": "Member",
  })

  const updateRole = (email: string, newRole: string) => {
    setRolesByEmail((prev) => ({ ...prev, [email]: newRole }))
  }

  const members = [
    {
      name: "Sofia Davis",
      email: "m@example.com",
      avatar: "/avatars/01.png",
      fallback: "SD",
    },
    {
      name: "Jackson Lee",
      email: "p@example.com",
      avatar: "/avatars/02.png",
      fallback: "JL",
    },
    {
      name: "Isabella Nguyen",
      email: "i@example.com",
      avatar: "/avatars/03.png",
      fallback: "IN",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {members.map((member) => (
          <div
            key={member.email}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} alt="Image" />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <RoleSelect
              value={rolesByEmail[member.email]}
              onChange={(role) => updateRole(member.email, role)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
