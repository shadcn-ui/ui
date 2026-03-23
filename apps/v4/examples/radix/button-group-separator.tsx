import { Button } from "@/examples/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/examples/radix/ui/button-group"

export default function ButtonGroupSeparatorDemo() {
  return (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  )
}
