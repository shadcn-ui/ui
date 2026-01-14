import { Alert, AlertDescription, AlertTitle } from "@/examples/radix/ui/alert"
import { CircleAlertIcon } from "lucide-react"

export function AlertExample3() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          <p>
            Please verify your <a href="#">billing information</a> and try
            again.
          </p>
          <ul className="list-inside list-disc">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
