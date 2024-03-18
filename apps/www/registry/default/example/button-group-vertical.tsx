import { Button } from "@/registry/default/ui/button"
import { ButtonGroup } from "@/registry/default/ui/button-group"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup orientation={"vertical"}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  )
}
