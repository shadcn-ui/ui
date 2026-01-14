import { Alert, AlertDescription, AlertTitle } from "@/examples/radix/ui/alert"
import { CircleAlertIcon } from "lucide-react"

export function AlertExample2() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert>
        <CircleAlertIcon />
        <AlertTitle>
          Let&apos;s try one with icon, title and a <a href="#">link</a>.
        </AlertTitle>
      </Alert>
      <Alert>
        <CircleAlertIcon />
        <AlertDescription>
          This one has an icon and a description only. No title.{" "}
          <a href="#">But it has a link</a> and a <a href="#">second link</a>.
        </AlertDescription>
      </Alert>

      <Alert>
        <CircleAlertIcon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <CircleAlertIcon />
        <AlertTitle>
          This is a very long alert title that demonstrates how the component
          handles extended text content and potentially wraps across multiple
          lines
        </AlertTitle>
      </Alert>
      <Alert>
        <CircleAlertIcon />
        <AlertDescription>
          This is a very long alert description that demonstrates how the
          component handles extended text content and potentially wraps across
          multiple lines
        </AlertDescription>
      </Alert>
      <Alert>
        <CircleAlertIcon />
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
    </div>
  )
}
