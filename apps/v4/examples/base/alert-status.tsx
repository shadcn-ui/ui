import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/styles/base-force-ui/ui/alert"

export default function AlertStatus() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert variant="success">
        <CheckCircle2Icon />
        <AlertTitle>Payment received</AlertTitle>
        <AlertDescription>Your invoice has been paid in full.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The service will be unavailable on Sunday from 02:00–04:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Your subscription expires soon</AlertTitle>
        <AlertDescription>
          Renew within 3 days to avoid any interruption to your service.
        </AlertDescription>
      </Alert>
    </div>
  )
}
