import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"

export default function ButtonGroupOrientation() {
  return (
    <div className="flex flex-col items-start gap-8">
      <div>
        <h4 className="mb-4 text-sm font-medium">Horizontal (default)</h4>
        <ButtonGroup orientation="horizontal">
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-medium">Vertical</h4>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
