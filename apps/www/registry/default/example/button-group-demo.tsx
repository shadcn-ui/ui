import { BellRing } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/registry/default/ui/button-group"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupItem>
        <BellRing className="h-4 w-4" />
      </ButtonGroupItem>
      <Button variant={"outline"}>First</Button>
      <Button variant={"outline"}>Second</Button>
      <Button variant={"outline"}>Third</Button>
    </ButtonGroup>
  )
}
