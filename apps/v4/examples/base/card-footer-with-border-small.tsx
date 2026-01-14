import { Button } from "@/examples/base/ui/button"
import { Card, CardContent, CardFooter } from "@/examples/base/ui/card"

export function CardFooterWithBorderSmall() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardContent>
        <p>
          The footer has a border-t class applied, creating a visual separation
          between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="outline" size="sm" className="w-full">
          Footer with Border
        </Button>
      </CardFooter>
    </Card>
  )
}
