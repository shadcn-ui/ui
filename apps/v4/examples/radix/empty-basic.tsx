import { Button } from "@/examples/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/examples/radix/ui/empty"
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
          <Button asChild>
            <a href="#">Create project</a>
          </Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" asChild className="text-muted-foreground">
          <a href="#">
            Learn more <ArrowUpRightIcon />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
