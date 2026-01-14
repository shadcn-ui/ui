import { Button } from "@/examples/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/radix/ui/empty"
import { FolderIcon, PlusIcon } from "lucide-react"

export function EmptyWithIcon() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing to see here</EmptyTitle>
        <EmptyDescription>
          No posts have been created yet. Get started by{" "}
          <a href="#">creating your first post</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <PlusIcon />
          New Post
        </Button>
      </EmptyContent>
    </Empty>
  )
}
