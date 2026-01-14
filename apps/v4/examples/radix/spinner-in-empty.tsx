import { Button } from "@/examples/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/radix/ui/empty"
import { Spinner } from "@/examples/radix/ui/spinner"
import { ArrowRightIcon } from "lucide-react"

export function SpinnerInEmpty() {
  return (
    <Empty className="min-h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <a href="#">Create project</a>
          </Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" asChild className="text-muted-foreground">
          <a href="#">
            Learn more <ArrowRightIcon />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
