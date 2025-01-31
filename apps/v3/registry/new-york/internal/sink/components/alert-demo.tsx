import {
  AlertCircleIcon,
  ArrowRightIcon,
  BookmarkCheckIcon,
  CheckCircle2Icon,
  GiftIcon,
  PopcornIcon,
  ShieldAlertIcon,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert"
import { Button } from "@/registry/new-york/ui/button"

export function AlertDemo() {
  return (
    <div className="gap-4 grid items-start max-w-xl">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <BookmarkCheckIcon>Heads up!</BookmarkCheckIcon>
        <AlertDescription>
          This one has an icon and a description only. No title.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertDescription>
          This one has a description only. No title. No icon.
        </AlertDescription>
      </Alert>
      <Alert>
        <PopcornIcon />
        <AlertTitle>Let's try one with icon and title.</AlertTitle>
      </Alert>
      <Alert>
        <ShieldAlertIcon />
        <AlertTitle>
          This is a very long alert title that demonstrates how the component
          handles extended text content and potentially wraps across multiple
          lines
        </AlertTitle>
      </Alert>
      <Alert>
        <GiftIcon />
        <AlertDescription>
          This is a very long alert description that demonstrates how the
          component handles extended text content and potentially wraps across
          multiple lines
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>
          This is an extremely long alert title that spans multiple lines to
          demonstrate how the component handles very lengthy headings while
          maintaining readability and proper text wrapping behavior
        </AlertTitle>
        <AlertDescription>
          This is an equally long description that contains detailed information
          about the alert. It shows how the component can accommodate extensive
          content while preserving proper spacing, alignment, and readability
          across different screen sizes and viewport widths. This helps ensure
          the user experience remains consistent regardless of the content
          length.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
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
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2.5 h-6 right-3 shadow-none"
        >
          Undo
        </Button>
      </Alert>
      <Alert className="bg-amber-50 text-amber-900 border-amber-50 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-950">
        <CheckCircle2Icon />
        <AlertTitle>Plot Twist: This Alert is Actually Amber!</AlertTitle>
        <AlertDescription>
          This one has custom colors for light and dark mode.
        </AlertDescription>
      </Alert>
    </div>
  )
}
