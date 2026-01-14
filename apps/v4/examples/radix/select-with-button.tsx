import { Button } from "@/examples/radix/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function SelectWithButton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          Submit
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline">Submit</Button>
      </div>
    </div>
  )
}
