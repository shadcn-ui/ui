import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { HeartIcon } from "lucide-react"

export function ButtonGroupWithLike() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HeartIcon /> Like
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-12"
        render={<span />}
        nativeButton={false}
      >
        1.2K
      </Button>
    </ButtonGroup>
  )
}
