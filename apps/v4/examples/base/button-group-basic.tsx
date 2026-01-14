import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"

export function ButtonGroupBasic() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Another Button</Button>
      </ButtonGroup>
    </div>
  )
}
