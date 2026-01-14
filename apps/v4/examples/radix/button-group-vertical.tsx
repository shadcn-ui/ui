import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { MinusIcon, PlusIcon } from "lucide-react"

export function ButtonGroupVertical() {
  return (
    <div className="flex gap-6">
      <ButtonGroup
        orientation="vertical"
        aria-label="Media controls"
        className="h-fit"
      >
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="outline" size="icon">
          <MinusIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
