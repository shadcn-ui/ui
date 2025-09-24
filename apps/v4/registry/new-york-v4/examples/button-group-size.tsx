import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"

export default function ButtonGroupSize() {
  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Small</p>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="outline" size="sm">
            Button
          </Button>
          <Button variant="outline" size="sm">
            Group
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconPlus />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Default</p>
        <ButtonGroup>
          <Button variant="outline">Default</Button>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Group</Button>
          <Button variant="outline" size="icon">
            <IconPlus />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Large</p>
        <ButtonGroup>
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button variant="outline" size="lg">
            Button
          </Button>
          <Button variant="outline" size="lg">
            Group
          </Button>
          <Button variant="outline" size="icon-lg">
            <IconPlus />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
