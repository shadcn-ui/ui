import { ButtonGroupItem } from "@/registry/default/ui/button-group"
import { Button } from "@/registry/new-york/ui/button"
import { ButtonGroup } from "@/registry/new-york/ui/button-group"
import { BellRing } from "lucide-react"

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
