import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york-v4/ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <AlertIcon>
          <CheckCircle2Icon className="size-4 text-green-600" />
        </AlertIcon>
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertIcon>
          <PopcornIcon className="size-4 text-yellow-500" />
        </AlertIcon>
        <AlertTitle>
          This Alert has a title and an icon. No description.
        </AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon>
          <AlertCircleIcon className="size-4 text-red-600" />
        </AlertIcon>
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
