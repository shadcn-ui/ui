import { Button } from "@/registry/new-york/ui/button"
import { ButtonGroup } from "@/registry/new-york/ui/button-group"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup variants={"line"}>
      <Button variant={"ghost"}>First</Button>
      <Button variant={"ghost"}>Second</Button>
      <Button variant={"ghost"}>Third</Button>
    </ButtonGroup>
  )
}
