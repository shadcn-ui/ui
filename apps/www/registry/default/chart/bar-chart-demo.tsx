import { ResponsiveLine } from "@nivo/line"

export default function Component() {
  return (
    <div className="aspect-video w-full">
      <ResponsiveLine
        data={[
          {
            id: "values",
            data: [
              { x: "Jan", y: 10 },
              { x: "Feb", y: 75 },
              { x: "Mar", y: 31 },
              { x: "Apr", y: 105 },
              { x: "May", y: 26 },
              { x: "Jun", y: 60 },
            ],
          },
        ]}
        curve="natural"
        colors={["hsl(var(--primary))"]}
        enableArea
        // areaOpacity={0.7}
        defs={[
          {
            id: "solid",
            type: "linearGradient",
            colors: [{ offset: 0, color: "hsl(var(--primary))" }],
          },
          {
            id: "gradient",
            type: "linearGradient",
            colors: [
              { offset: 0, color: "hsla(var(--primary))", opacity: 0.7 },
              { offset: 70, color: "hsla(var(--primary))", opacity: 0.1 },
            ],
          },
        ]}
        fill={[{ match: "*", id: "gradient" }]}
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
          <div className="rounded-md border bg-background px-3 py-2 text-sm shadow">
            <div className="text-muted-foreground">Walking Average</div>
            <span className="font-medium">
              {point.data["y"].toString()}
            </span>{" "}
            bpm
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
  )
}
