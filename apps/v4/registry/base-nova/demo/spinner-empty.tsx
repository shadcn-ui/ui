import { Button } from "@/registry/base-nova/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/base-nova/ui/empty"
import { Spinner } from "@/registry/base-nova/ui/spinner"

export function SpinnerEmpty() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing your request</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  )
}
