import { Alert, AlertDescription, AlertTitle } from "@/examples/radix/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}
