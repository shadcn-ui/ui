import { Button } from "@/examples/radix/ui/button"
import { toast } from "sonner"

export function SonnerWithDescription() {
  return (
    <Button
      onClick={() =>
        toast("Event has been created", {
          description: "Monday, January 3rd at 6:00pm",
        })
      }
      variant="outline"
      className="w-fit"
    >
      Show Toast
    </Button>
  )
}
