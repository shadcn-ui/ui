import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"

export function CardsUnsubsribe() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Do you want to unsubscribe?</CardTitle>
        <CardDescription>
          You will no longer receive emails from us.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <Button variant="destructive">Unsubscribe</Button>
      </CardFooter>
    </Card>
  )
}
