import { Button } from "@/registry/radix-nova/ui/button"
import { Input } from "@/registry/radix-nova/ui/input"

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
    </div>
  )
}
