import { Button } from "@/examples/react-aria/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/examples/react-aria/ui/button-group"

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
