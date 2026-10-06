import { Button } from "@/styles/aria-nova/ui/button"
import { Kbd } from "@/styles/aria-nova/ui/kbd"

export default function KbdButton() {
  return (
    <Button variant="outline">
      Accept{" "}
      <Kbd data-icon="inline-end" className="translate-x-0.5">
        ⏎
      </Kbd>
    </Button>
  )
}
