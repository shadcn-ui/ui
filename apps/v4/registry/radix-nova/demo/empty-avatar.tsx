import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/radix-nova/ui/avatar"
import { Button } from "@/registry/radix-nova/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/radix-nova/ui/empty"

export default function EmptyAvatar() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="grayscale"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>User Offline</EmptyTitle>
        <EmptyDescription>
          This user is currently offline. You can leave a message to notify them
          or try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Leave Message</Button>
      </EmptyContent>
    </Empty>
  )
}
