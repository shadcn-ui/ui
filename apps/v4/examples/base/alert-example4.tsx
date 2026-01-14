import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/examples/base/ui/alert"
import { Badge } from "@/examples/base/ui/badge"
import { Button } from "@/examples/base/ui/button"
import { CircleAlertIcon } from "lucide-react"

export function AlertExample4() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert>
        <CircleAlertIcon />
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <AlertAction>
          <Button size="xs">Undo</Button>
        </AlertAction>
      </Alert>
      <Alert>
        <CircleAlertIcon />
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <AlertDescription>
          This is a very long alert title that demonstrates how the component
          handles extended text content.
        </AlertDescription>
        <AlertAction>
          <Badge variant="secondary">Badge</Badge>
        </AlertAction>
      </Alert>
    </div>
  )
}
