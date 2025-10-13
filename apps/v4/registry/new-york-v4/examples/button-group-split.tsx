import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/new-york-v4/ui/button-group"

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
