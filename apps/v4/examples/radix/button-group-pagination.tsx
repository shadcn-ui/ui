import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

export function ButtonGroupPagination() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm">
        <ArrowLeftIcon />
        Previous
      </Button>
      <Button variant="outline" size="sm">
        1
      </Button>
      <Button variant="outline" size="sm">
        2
      </Button>
      <Button variant="outline" size="sm">
        3
      </Button>
      <Button variant="outline" size="sm">
        4
      </Button>
      <Button variant="outline" size="sm">
        5
      </Button>
      <Button variant="outline" size="sm">
        Next
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  )
}
