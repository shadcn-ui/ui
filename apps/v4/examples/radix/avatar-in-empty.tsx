import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/examples/radix/ui/avatar"
import { Button } from "@/examples/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/radix/ui/empty"
import { PlusIcon } from "lucide-react"

export function AvatarInEmpty() {
  return (
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
              <PlusIcon />
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
          <PlusIcon />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  )
}
