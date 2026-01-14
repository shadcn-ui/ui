import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/radix/ui/card"

export function CardHeaderWithBorder() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Header with Border</CardTitle>
        <CardDescription>
          This is a card with a header that has a bottom border.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The header has a border-b class applied, creating a visual separation
          between the header and content sections.
        </p>
      </CardContent>
    </Card>
  )
}
