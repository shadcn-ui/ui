import { CheckCircle2 } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/alert"

export default function AlertSuccess() {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your account has been successfully created.
      </AlertDescription>
    </Alert>
  )
}
