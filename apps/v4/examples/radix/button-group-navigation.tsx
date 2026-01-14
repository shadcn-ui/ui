import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
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
