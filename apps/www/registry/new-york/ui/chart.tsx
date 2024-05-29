"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k in string]: {
    label: React.ReactNode
    icon?: React.ComponentType
    colors: {
      light: string
      dark: string
    }
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }

  return context
}

const Chart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ className, children, config, ...props }, ref) => {
  const id = React.useId()

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={id}
        ref={ref}
        className={cn(
          "aspect-video w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-accent",
          className
        )}
        {...props}
      >
        <ChartStyle id={id} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
Chart.displayName = "Chart"

const ChartStyle = ({ id }: { id: string }) => {
  const { config } = useChart()

  return (
    <style>
      {`
        [data-chart="${id}"] {
          ${Object.entries(config)
            .map(([key, { colors }]) => {
              return `
                --color-${key}: ${colors.light};
              `
            })
            .join("")}
        .dark & {
          ${Object.entries(config)
            .map(([key, { colors }]) => {
              return `
                --color-${key}: ${colors.dark};
              `
            })
            .join("")}
        }
        }
      `}
    </style>
  )
}

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      flipped?: boolean
      indicator?: "line" | "dot" | "dashed" | "none"
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      flipped,
      label,
      labelFormatter,
      labelClassName,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (!payload?.length || hideLabel) return null

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(label, payload)}
          </div>
        )
      }

      return <div className={cn("font-medium", labelClassName)}>{label}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName])

    if (!active || !payload?.length) return null

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel && tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item) => {
            const itemConfig = config[item.dataKey as keyof typeof config]

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {itemConfig.icon ? (
                  <itemConfig.icon />
                ) : (
                  indicator !== "none" && (
                    <div
                      className={cn("shrink-0", {
                        "h-2.5 w-2.5 rounded-[2px]": indicator === "dot",
                        "w-1 rounded-[2px]": indicator === "line",
                        "w-0 border border-dashed": indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      })}
                      style={{
                        backgroundColor:
                          indicator === "dashed" ? "transparent" : item.color,
                        borderColor: item.color,
                      }}
                    />
                  )
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    flipped && "flex-row-reverse",
                    nestLabel ? "items-end" : "items-center"
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel && tooltipLabel}
                    <span className="text-muted-foreground">
                      {itemConfig.label}
                    </span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom" }, ref) => {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const itemConfig = config[item.dataKey as keyof typeof config]

        return (
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            )}
          >
            {itemConfig.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegend.displayName = "ChartLegend"

export { Chart, ChartTooltip, ChartLegend }
