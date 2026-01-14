import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui/card"

export function CardHeaderWithBorderSmall() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Header with Border</CardTitle>
        <CardDescription>
          This is a small card with a header that has a bottom border.
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
