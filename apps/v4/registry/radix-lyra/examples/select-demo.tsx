import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/radix-lyra/ui/select"

export default function SelectDemo() {
  return (
    <div className="bg-background h-80 w-80 border p-2">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
