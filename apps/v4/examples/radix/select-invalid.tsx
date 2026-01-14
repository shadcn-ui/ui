import { Field, FieldError, FieldLabel } from "@/examples/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function SelectInvalid() {
  return (
    <div className="flex flex-col gap-4">
      <Select>
        <SelectTrigger aria-invalid="true">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Field data-invalid>
        <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
        <Select>
          <SelectTrigger id="select-fruit-invalid" aria-invalid>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError errors={[{ message: "Please select a valid fruit." }]} />
      </Field>
    </div>
  )
}
