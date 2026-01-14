import { Button } from "@/examples/base/ui/button"
import { toast } from "sonner"

export function SonnerBasic() {
  return (
    <Button
      onClick={() => toast("Event has been created")}
      variant="outline"
      className="w-fit"
    >
      Show Toast
    </Button>
  )
}
