import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup defaultValue="medium">
      <ButtonGroupItem value="low">Low</ButtonGroupItem>
      <ButtonGroupItem value="medium">Medium</ButtonGroupItem>
      <ButtonGroupItem value="high">High</ButtonGroupItem>
    </ButtonGroup>
  )
}
