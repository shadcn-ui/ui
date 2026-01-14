import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { Field } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import { Label } from "@/examples/base/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import { ArrowRightIcon } from "lucide-react"

const currencyItems = [
  { label: "$", value: "$" },
  { label: "€", value: "€" },
  { label: "£", value: "£" },
]

export function ButtonGroupWithSelect() {
  return (
    <Field>
      <Label htmlFor="amount">Amount</Label>
      <ButtonGroup>
        <Select items={currencyItems} defaultValue={currencyItems[0]}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencyItems.map((item) => (
                <SelectItem key={item.value} value={item}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input placeholder="Enter amount to send" />
        <Button variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </Field>
  )
}
