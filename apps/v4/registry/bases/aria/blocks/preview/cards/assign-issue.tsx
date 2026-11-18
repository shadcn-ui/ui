"use client"

import * as React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/aria/ui/avatar"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/registry/bases/aria/ui/combobox"
import { Tooltip, TooltipTrigger } from "@/registry/bases/aria/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Users available for assignment.
const users = [
  "shadcn",
  "maxleiter",
  "evilrabbit",
  "pranathip",
  "jorgezreik",
  "shuding",
  "rauchg",
]

export function AssignIssue() {
  return (
    <Card className="w-full max-w-sm" size="sm">
      <CardHeader className="border-b">
        <CardTitle className="text-sm">Assign Issue</CardTitle>
        <CardDescription className="text-sm">
          Select users to assign to this issue.
        </CardDescription>
        <CardAction>
          <TooltipTrigger>
            <Button variant="outline" size="icon-xs">
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
            </Button>
            <Tooltip>Add user</Tooltip>
          </TooltipTrigger>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Combobox
          selectionMode="multiple"
          defaultValue={[users[0]]}
          allowsEmptyCollection
        >
          <ComboboxChips>
            <ComboboxChipList<{ username: string }>>
              {(value: { username: string }) => (
                <ComboboxChip id={value.username}>
                  <Avatar className="size-4">
                    <AvatarImage
                      src={`https://github.com/${value.username}.png`}
                      alt={value.username}
                    />
                    <AvatarFallback>{value.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {value.username}
                </ComboboxChip>
              )}
            </ComboboxChipList>
            <ComboboxChipsInput placeholder="Select a item..." />
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxList
              renderEmptyState={() => (
                <ComboboxEmpty>No users found.</ComboboxEmpty>
              )}
            >
              {users.map((username) => (
                <ComboboxItem
                  key={username}
                  id={username}
                  value={{ username }}
                  textValue={username}
                >
                  <Avatar className="size-5">
                    <AvatarImage
                      src={`https://github.com/${username}.png`}
                      alt={username}
                    />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {username}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </CardContent>
    </Card>
  )
}
