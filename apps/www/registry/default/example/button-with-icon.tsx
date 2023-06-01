import { Button } from "@/registry/default/ui/button"
import { Mail } from "lucide-react"

export default function ButtonWithIcon() {
  return (
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
  )
}
