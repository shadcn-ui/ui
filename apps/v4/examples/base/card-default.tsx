import { Button } from "@/examples/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui/card"

export function CardDefault() {
  return (
    <Card size="default" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          This card uses the default size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that defaults to
          &quot;default&quot; for standard spacing and sizing.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  )
}
