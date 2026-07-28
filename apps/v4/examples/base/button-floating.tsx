import { PlusIcon } from "lucide-react"

import { Button } from "@/styles/base-nova/ui/button"

export default function ButtonFloating() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
      <Button
        size="icon-lg"
        aria-label="Add item"
        className="absolute right-4 bottom-4 rounded-full shadow-lg"
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
