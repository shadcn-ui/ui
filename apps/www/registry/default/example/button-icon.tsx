import { ChevronRight } from "lucide-react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

import { Button } from "@/registry/default/ui/button"

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <AccessibleIcon label="Next item">
        <ChevronRight className="h-4 w-4" />
      </AccessibleIcon>
    </Button>
  )
}
