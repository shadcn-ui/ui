import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

export function ButtonGroupPaginationSplit() {
  return (
    <ButtonGroup>
      <ButtonGroup>
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
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-xs">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="icon-xs">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
