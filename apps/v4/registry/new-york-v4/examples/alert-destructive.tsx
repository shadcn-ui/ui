import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"

export default function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertIcon>
        <AlertCircleIcon className="size-4 text-red-600" />
      </AlertIcon>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}
