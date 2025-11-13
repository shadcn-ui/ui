import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function AvatarDemo() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-6">
          <AvatarExample1 />
          <AvatarExample2 />
          <AvatarExample3 />
          <AvatarExample4 />
          <AvatarExample5 />
          <AvatarExample6 />
        </div>
        <div className="flex flex-col gap-6">
          <AvatarExample7 />
          <AvatarExample9 />
          <AvatarExample8 />
        </div>
      </div>
    </div>
  )
}

function AvatarExample1() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

function AvatarExample2() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <Avatar size="sm">
        <AvatarImage
          src="https://github.com/jorgezreik.png"
          alt="@jorgezreik"
        />
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://github.com/jorgezreik.png"
          alt="@jorgezreik"
        />
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://github.com/jorgezreik.png"
          alt="@jorgezreik"
        />
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar>
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>JZ</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  )
}

function AvatarExample3() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick01Icon"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick01Icon"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>PP</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick01Icon"
          />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}

function AvatarExample4() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
}

function AvatarExample5() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

function AvatarExample6() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 rounded-lg border p-6">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

function AvatarExample7() {
  return (
    <Empty className="flex-none border">
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
              />
            </AvatarGroupCount>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function AvatarExample8() {
  const users = [
    {
      name: "Max Leiter",
      email: "max@example.com",
      avatar: "https://github.com/maxleiter.png",
      fallback: "ML",
      role: "member",
    },
    {
      name: "Jorge Zreik",
      email: "jorge@example.com",
      avatar: "https://github.com/jorgezreik.png",
      fallback: "JZ",
      role: "member",
    },
    {
      name: "Pranathi Peri",
      email: "pranathi@example.com",
      avatar: "https://github.com/pranathip.png",
      fallback: "PP",
      role: "viewer",
    },
  ]

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          View and manage your team members in this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <InputGroup>
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon align="inline-start">
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
            />
          </InputGroupAddon>
        </InputGroup>
        <ItemGroup>
          {users.map((user) => {
            return (
              <Item key={user.email} size="sm" className="px-0 sm:gap-4">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.fallback}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0.5">
                  <ItemTitle>{user.name}</ItemTitle>
                  <ItemDescription>{user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="icon" className="sm:hidden">
                    <IconPlaceholder
                      lucide="EllipsisIcon"
                      tabler="IconDots"
                      hugeicons="MoreHorizontalIcon"
                    />
                    <span className="sr-only">More options</span>
                  </Button>
                  <NativeSelect
                    defaultValue={user.role}
                    className="hidden sm:flex"
                  >
                    <NativeSelectOption value="admin">Admin</NativeSelectOption>
                    <NativeSelectOption value="member">
                      Member
                    </NativeSelectOption>
                    <NativeSelectOption value="viewer">
                      Viewer
                    </NativeSelectOption>
                  </NativeSelect>
                </ItemActions>
              </Item>
            )
          })}
        </ItemGroup>
        <Button className="mt-4 w-full">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
          />
          Add Member
        </Button>
      </CardContent>
    </Card>
  )
}

function AvatarExample9() {
  const users = [
    {
      name: "shadcn",
      avatar: "https://github.com/shadcn.png",
      fallback: "CN",
    },
    {
      name: "Max Leiter",
      avatar: "https://github.com/maxleiter.png",
      fallback: "ML",
    },
    {
      name: "Jorge Zreik",
      avatar: "https://github.com/jorgezreik.png",
      fallback: "JZ",
    },
    {
      name: "Evil Rabbit",
      avatar: "https://github.com/evilrabbit.png",
      fallback: "ER",
    },
    {
      name: "Pranathi Peri",
      avatar: "https://github.com/pranathip.png",
      fallback: "PP",
    },
  ]

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Select User</CardTitle>
        <CardDescription>Choose a user from the dropdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <Select>
          <SelectTrigger className="w-full pl-2">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Users</SelectLabel>
              {users.map((user) => {
                return (
                  <SelectItem key={user.name} value={user.name}>
                    <Avatar size="sm">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.fallback}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
