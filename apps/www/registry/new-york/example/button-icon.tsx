import { ChevronRight } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
}
