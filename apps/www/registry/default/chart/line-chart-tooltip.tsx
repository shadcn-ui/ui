import { ResponsiveLine } from "@nivo/line"

export default function Component() {
  return (
    <div className="aspect-[9/4] w-full">
      <ResponsiveLine
        data={[
          {
            id: "desktop",
            data: [
              { x: "January", y: 0 },
              { x: "February", y: 45 },
              { x: "March", y: 31 },
              { x: "April", y: 100 },
              { x: "May", y: 26 },
              { x: "June", y: 80 },
            ],
          },
        ]}
        enableArea
        areaOpacity={0.1}
        curve="cardinal"
        colors={["hsl(var(--primary))"]}
        useMesh
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
          format: (value) => value.toString().substring(0, 3),
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
          <div className="flex min-w-[140px] items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-sm">
            <div className="h-[1.8rem] w-1 rounded-full bg-primary" />
            <div className="flex w-full flex-col gap-0.5">
              <div className="font-medium">Visitors</div>
              <div className="flex w-full items-center text-muted-foreground">
                {point.data.xFormatted}
                <div className="ml-auto font-mono font-medium text-foreground">
                  {point.data.yFormatted}
                </div>
              </div>
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
