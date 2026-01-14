import { Button } from "@/examples/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/examples/radix/ui/empty"
import { ArrowUpRightIcon } from "lucide-react"

export function EmptyWithMutedBackground() {
  return (
    <Empty className="bg-muted">
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          No results found for your search. Try adjusting your search terms.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Try again</Button>
        <Button variant="link" asChild className="text-muted-foreground">
          <a href="#">
            Learn more <ArrowUpRightIcon />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
