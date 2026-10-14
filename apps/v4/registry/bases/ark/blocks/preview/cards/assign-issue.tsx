"use client"

import * as React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/ark/ui/avatar"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTag,
  ComboboxTagsControl,
  ComboboxTagsInput,
  createListCollection,
  useFilter,
  type ComboboxInputValueChangeDetails,
  type ComboboxValueChangeDetails,
} from "@/registry/bases/ark/ui/combobox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/ark/ui/tooltip"
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

const initialCollection = createListCollection({ items: users })

export function AssignIssue() {
  const filter = useFilter({ sensitivity: "base" })
  const [collection, setCollection] =
    React.useState(initialCollection)
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([
    users[0],
  ])

  const handleInputValueChange = React.useCallback(
    (details: ComboboxInputValueChangeDetails) => {
      const filtered = users.filter((user) =>
        filter.contains(user, details.inputValue)
      )
      setCollection(
        createListCollection({
          items: filtered.length > 0 ? filtered : users,
        })
      )
    },
    [filter]
  )

  const handleValueChange = React.useCallback(
    (details: ComboboxValueChangeDetails) => {
      setSelectedUsers(details.value)
    },
    []
  )

  const handleRemoveTag = React.useCallback(
    (value: string) => {
      setSelectedUsers((prev) => prev.filter((v) => v !== value))
    },
    []
  )

  return (
    <Card className="w-full max-w-sm" size="sm">
      <CardHeader className="border-b">
        <CardTitle className="text-sm">Assign Issue</CardTitle>
        <CardDescription className="text-sm">
          Select users to assign to this issue.
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon-xs">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add user</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Combobox
          multiple
          collection={collection}
          value={selectedUsers}
          onInputValueChange={handleInputValueChange}
          onValueChange={handleValueChange}
        >
          <ComboboxTagsControl>
            {selectedUsers.map((username) => (
              <ComboboxTag
                key={username}
                value={username}
                onRemove={handleRemoveTag}
              >
                <Avatar className="size-4">
                  <AvatarImage
                    src={`https://github.com/${username}.png`}
                    alt={username}
                  />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
                {username}
              </ComboboxTag>
            ))}
            <ComboboxTagsInput
              placeholder={
                selectedUsers.length > 0 ? undefined : "Select a user..."
              }
            />
          </ComboboxTagsControl>
          <ComboboxContent>
            <ComboboxEmpty>No users found.</ComboboxEmpty>
            <ComboboxList>
              {collection.items.map((username) => (
                <ComboboxItem key={username} item={username}>
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
