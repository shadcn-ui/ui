import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"

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
