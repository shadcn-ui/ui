import { MailIcon, TrashIcon } from "lucide-react"

import { Alert, AlertAction, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function AlertActionExample() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <MailIcon />
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <AlertAction>
          <Button size="sm" variant="outline">
            Undo
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="destructive">
        <TrashIcon />
        <AlertTitle>3 items have been deleted.</AlertTitle>
        <AlertAction>
          <Badge variant="destructive">Action Required</Badge>
        </AlertAction>
      </Alert>
    </div>
  )
}
