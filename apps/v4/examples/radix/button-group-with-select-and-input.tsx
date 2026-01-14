import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { Input } from "@/examples/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function ButtonGroupWithSelectAndInput() {
  return (
    <ButtonGroup>
      <Select defaultValue="hours">
        <SelectTrigger id="duration">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="hours">Hours</SelectItem>
          <SelectItem value="days">Days</SelectItem>
          <SelectItem value="weeks">Weeks</SelectItem>
        </SelectContent>
      </Select>
      <Input />
    </ButtonGroup>
  )
}
