import { Button } from "@/examples/radix/ui/button"
import { Input } from "@/examples/radix/ui/input"

export function InputWithButton() {
  return (
    <div className="flex w-full gap-2">
      <Input type="search" placeholder="Search..." className="flex-1" />
      <Button>Search</Button>
    </div>
  )
}
