import { Button } from "@/examples/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/examples/base/ui/empty"
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
