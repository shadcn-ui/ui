import { Button } from "@/examples/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/examples/base/ui/button-group"
import { IconPlus } from "@tabler/icons-react"

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <IconPlus />
      </Button>
    </ButtonGroup>
  )
}
