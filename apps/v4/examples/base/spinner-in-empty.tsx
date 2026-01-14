import { Button } from "@/examples/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/examples/base/ui/empty"
import { Spinner } from "@/examples/base/ui/spinner"
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
          <Button render={<a href="#" />} nativeButton={false}>
            Create project
          </Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button
          variant="link"
          render={<a href="#" />}
          nativeButton={false}
          className="text-muted-foreground"
        >
          Learn more <ArrowRightIcon />
        </Button>
      </EmptyContent>
    </Empty>
  )
}
