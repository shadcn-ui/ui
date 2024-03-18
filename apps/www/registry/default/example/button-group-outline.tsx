import { Button } from "@/registry/default/ui/button"
import { ButtonGroup } from "@/registry/default/ui/button-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup variants={"line"}>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Animal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Cat</SelectItem>
          <SelectItem value="dark">Dog</SelectItem>
        </SelectContent>
      </Select>
      <Button variant={"outline"}>Submit</Button>
    </ButtonGroup>
  )
}
