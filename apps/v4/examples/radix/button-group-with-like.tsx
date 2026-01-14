import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { HeartIcon } from "lucide-react"

export function ButtonGroupWithLike() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HeartIcon /> Like
      </Button>
      <Button variant="outline" asChild size="icon" className="w-12">
        <span>1.2K</span>
      </Button>
    </ButtonGroup>
  )
}
