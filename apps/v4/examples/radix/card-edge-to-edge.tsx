import { Button } from "@/styles/radix-nova/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/radix-nova/ui/card"

export function CardEdgeToEdge() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>
          Review the terms before accepting the agreement.
        </CardDescription>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
          <p>
            These terms govern your use of the workspace, including access to
            shared documents, project files, and collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that
            your team has the appropriate permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When those
            changes materially affect your workflow, we will notify your
            workspace administrators.
          </p>
          <p>
            By continuing, you agree to keep your account credentials secure and
            to follow your organization&apos;s acceptable use policies.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
  )
}
