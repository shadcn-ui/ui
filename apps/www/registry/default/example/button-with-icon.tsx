import { Mail } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

export default function ButtonWithIcon() {
  return (
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
  )
}
