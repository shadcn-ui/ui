import { Button } from "@/examples/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/examples/base/ui/empty"
import { ArrowUpRightIcon } from "lucide-react"

export function EmptyBasic() {
  return (
    <Empty>
      <EmptyHeader>
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
          className="text-muted-foreground"
          nativeButton={false}
        >
          Learn more <ArrowUpRightIcon />
        </Button>
      </EmptyContent>
    </Empty>
  )
}
