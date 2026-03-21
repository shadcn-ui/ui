import { Field, FieldDescription, FieldLabel } from "@/examples/ark/ui/field"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const departmentItems = createListCollection({
  items: [
    { label: "Engineering", value: "engineering" },
    { label: "Design", value: "design" },
    { label: "Marketing", value: "marketing" },
    { label: "Sales", value: "sales" },
    { label: "Customer Support", value: "support" },
    { label: "Human Resources", value: "hr" },
    { label: "Finance", value: "finance" },
    { label: "Operations", value: "operations" },
  ],
})

export default function FieldSelect() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Department</FieldLabel>
      <Select collection={departmentItems}>
        <SelectTrigger>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItemGroup>
            {departmentItems.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        Select your department or area of work.
      </FieldDescription>
    </Field>
  )
}
