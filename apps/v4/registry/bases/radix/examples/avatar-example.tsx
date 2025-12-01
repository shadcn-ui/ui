import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function AvatarExample() {
  return (
    <ExampleWrapper>
      <AvatarSizes />
      <AvatarWithBadge />
      <AvatarWithBadgeIcon />
      <AvatarGroupExample />
      <AvatarGroupWithCount />
      <AvatarGroupWithIconCount />
      <AvatarInEmpty />
    </ExampleWrapper>
  )
}

function AvatarSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-wrap items-center gap-2">
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
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
    </Example>
  )
}

function AvatarWithBadge() {
  return (
    <Example title="Badge">
      <div className="flex flex-wrap items-center gap-2">
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
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
    </Example>
  )
}

function AvatarWithBadgeIcon() {
  return (
    <Example title="Badge with Icon">
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
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
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
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
          <AvatarImage
            src="https://github.com/pranathip.png"
            alt="@pranathip"
          />
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
            />
          </AvatarBadge>
        </Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
            />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
            />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>PP</AvatarFallback>
          <AvatarBadge>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
            />
          </AvatarBadge>
        </Avatar>
      </div>
    </Example>
  )
}

function AvatarGroupExample() {
  return (
    <Example title="Group">
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
    </Example>
  )
}

function AvatarGroupWithCount() {
  return (
    <Example title="Group with Count">
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
    </Example>
  )
}

function AvatarGroupWithIconCount() {
  return (
    <Example title="Group with Icon Count">
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
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
            className="grayscale"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
            className="grayscale"
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
    </Example>
  )
}

function AvatarInEmpty() {
  return (
    <Example title="In Empty">
      <Empty className="w-full flex-none border">
        <EmptyHeader>
          <EmptyMedia>
            <AvatarGroup>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                  className="grayscale"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                  className="grayscale"
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
    </Example>
  )
}

function AvatarInSelect() {
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
    <Example title="In Select">
      <Field>
        <FieldLabel>Select User</FieldLabel>

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
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name}
                        className="grayscale"
                      />
                      <AvatarFallback>{user.fallback}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>Choose a user from the dropdown.</FieldDescription>
      </Field>
    </Example>
  )
}
