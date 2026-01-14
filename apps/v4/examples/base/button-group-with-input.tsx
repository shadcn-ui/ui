import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { Input } from "@/examples/base/ui/input"

export function ButtonGroupWithInput() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Button</Button>
        <Input placeholder="Type something here..." />
      </ButtonGroup>
      <ButtonGroup>
        <Input placeholder="Type something here..." />
        <Button variant="outline">Button</Button>
      </ButtonGroup>
    </div>
  )
}
