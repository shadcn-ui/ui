import { ResponsiveLine } from "@nivo/line"

export default function Component() {
  return (
    <div className="aspect-[9/4] w-full">
      <ResponsiveLine
        data={[
          {
            id: "desktop",
            data: [
              { x: "Jan", y: 0 },
              { x: "Feb", y: 45 },
              { x: "Mar", y: 31 },
              { x: "Apr", y: 100 },
              { x: "May", y: 26 },
              { x: "Jun", y: 80 },
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
          tickValues: [0, 50, 100],
        }}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
        pointSize={8}
        gridYValues={4}
        tooltip={({ point }) => (
          <div className="flex min-w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-sm shadow-sm">
            <div className="aspect-square w-2.5 rounded-full bg-primary" />
            <div className="text-muted-foreground">Visitors</div>
            <div className="ml-auto font-medium text-foreground">
              {point.data.yFormatted}
            </div>
          </div>
        )}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "hsl(var(--muted-foreground))",
              },
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
  )
}
