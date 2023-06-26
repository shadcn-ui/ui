import { CheckCircledIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert"

export default function AlertSuccess() {
  return (
    <Alert variant="success">
      <CheckCircledIcon className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your account has been successfully created.
      </AlertDescription>
    </Alert>
  )
}
