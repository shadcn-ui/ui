import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

export function ButtonGroupNavigation() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Single navigation button">
        <Button variant="outline" size="icon">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
