import { Input } from "@/examples/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function InputWithSelect() {
  return (
    <div className="flex w-full gap-2">
      <Input type="text" placeholder="Enter amount" className="flex-1" />
      <Select defaultValue="usd">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD</SelectItem>
          <SelectItem value="eur">EUR</SelectItem>
          <SelectItem value="gbp">GBP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
