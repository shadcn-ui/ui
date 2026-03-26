import { Button } from "@/examples/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/examples/base/ui/button-group"

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
