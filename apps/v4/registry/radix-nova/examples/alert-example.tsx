import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/radix-nova/ui/alert"
import { Button } from "@/registry/radix-nova/ui/button"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function AlertDemo() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center px-6 py-12">
      <div className="grid max-w-xl items-start gap-4">
        <Alert>
          <IconPlaceholder name="CheckCircle2Icon" />
          <AlertTitle>Success! Your changes have been saved</AlertTitle>
          <AlertDescription>
            This is an alert with icon, title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <IconPlaceholder name="BookmarkCheckIcon" />
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
          <IconPlaceholder name="ShoppingBagIcon" />
          <AlertTitle>Let&apos;s try one with icon and title.</AlertTitle>
        </Alert>
        <Alert>
          <IconPlaceholder name="ShieldAlertIcon" />
          <AlertTitle>
            This is a very long alert title that demonstrates how the component
            handles extended text content and potentially wraps across multiple
            lines
          </AlertTitle>
        </Alert>
        <Alert>
          <IconPlaceholder name="GiftIcon" />
          <AlertDescription>
            This is a very long alert description that demonstrates how the
            component handles extended text content and potentially wraps across
            multiple lines
          </AlertDescription>
        </Alert>
        <Alert>
          <IconPlaceholder name="AlertCircleIcon" />
          <AlertTitle>
            This is an extremely long alert title that spans multiple lines to
            demonstrate how the component handles very lengthy headings while
            maintaining readability and proper text wrapping behavior
          </AlertTitle>
          <AlertDescription>
            This is an equally long description that contains detailed
            information about the alert. It shows how the component can
            accommodate extensive content while preserving proper spacing,
            alignment, and readability across different screen sizes and
            viewport widths. This helps ensure the user experience remains
            consistent regardless of the content length.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <IconPlaceholder name="AlertCircleIcon" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <IconPlaceholder name="AlertCircleIcon" />
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
          <IconPlaceholder name="CheckCircle2Icon" />
          <AlertTitle className="max-w-[calc(100%-4rem)] overflow-ellipsis">
            The selected emails have been marked as spam.
          </AlertTitle>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2.5 right-3 h-6 shadow-none"
          >
            Undo
          </Button>
        </Alert>
        <Alert>
          <IconPlaceholder name="CheckCircle2Icon" />
          <AlertTitle className="max-w-[calc(100%-4rem)] overflow-ellipsis">
            The selected emails have been marked as spam.
          </AlertTitle>
          <AlertDescription className="pr-24">
            This is a very long alert title that demonstrates how the component
            handles extended text content.
          </AlertDescription>
          <Button
            size="sm"
            className="absolute top-2.5 right-3 h-6 shadow-none"
          >
            Confirm
          </Button>
        </Alert>
      </div>
    </div>
  )
}
