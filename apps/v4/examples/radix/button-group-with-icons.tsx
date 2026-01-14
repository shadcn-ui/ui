import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCwIcon,
} from "lucide-react"

export function ButtonGroupWithIcons() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">
          <FlipHorizontalIcon />
        </Button>
        <Button variant="outline">
          <FlipVerticalIcon />
        </Button>
        <Button variant="outline">
          <RotateCwIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
