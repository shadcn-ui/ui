import { ResponsiveLine } from "@nivo/line"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"

export default function Component() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Walking Heart Rate</CardTitle>
        <CardDescription>
          Your average walking heart rate over the past 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full">
          <ResponsiveLine
            data={[
              {
                id: "Desktop",
                data: [
                  { x: "Jan", y: 43 },
                  { x: "Feb", y: 137 },
                  { x: "Mar", y: 61 },
                  { x: "Apr", y: 145 },
                  { x: "May", y: 26 },
                  { x: "Jun", y: 120 },
                ],
              },
            ]}
            curve="cardinal"
            colors={["hsl(var(--primary))"]}
            useMesh
            axisBottom={{
              tickSize: 0,
              tickPadding: 16,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 16,
            }}
            margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
            pointSize={8}
            gridYValues={4}
            tooltip={({ point }) => (
              <div className="rounded-md border bg-background px-3 py-2 text-sm shadow">
                <div className="text-muted-foreground">Walking Average</div>
                <span className="font-medium">
                  {point.data["y"].toString()}
                </span>{" "}
                bpm
              </div>
            )}
            // tooltipFormat={(value) => `${value} bpm`}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                  },
                },
              },
              tooltip: {
                basic: {
                  color: "hsl(var(--foreground))",
                },
                chip: {
                  borderRadius: "9999px",
                },
                container: {
                  fontSize: "12px",
                  textTransform: "capitalize",
                  borderRadius: "6px",
                  background: "hsl(var(--background))",
                  borderWidth: "1px",
                  borderColor: "hsl(var(--border))",
                },
              },
              grid: {
                line: {
                  stroke: "hsl(var(--muted))",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
