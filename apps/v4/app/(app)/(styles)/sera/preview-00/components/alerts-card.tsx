import { CircleAlertIcon, InfoIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/styles/base-sera/ui/alert"
import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"

export function AlertsCard() {
  return (
    <Card className="col-span-full md:col-span-6 lg:col-span-5">
      <CardHeader className="border-b">
        <CardTitle>Feedback / Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <InfoIcon />
          <AlertTitle>System Update Complete</AlertTitle>
          <AlertDescription>
            Component library has been successfully synchronized to v1.0.
          </AlertDescription>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>Unable to Save Draft</AlertTitle>
          <AlertDescription>
            Please check your connection and try again.
          </AlertDescription>
          <AlertAction>
            <Button variant="link" size="sm">
              Retry Connection
            </Button>
          </AlertAction>
        </Alert>
      </CardContent>
    </Card>
  )
}
