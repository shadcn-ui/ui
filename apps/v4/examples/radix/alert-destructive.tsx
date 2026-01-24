import { Alert, AlertDescription, AlertTitle } from "@/examples/radix/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  )
}
