import { getBlock } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import { ChartToolbar } from "@/components/chart-toolbar"

export async function ChartDisplay({
  name,
  children,
  className,
}: { name: string } & React.ComponentProps<"div">) {
  const chart = await getBlock(name)

  // Cannot (and don't need to) pass to the client.
  delete chart?.component
  delete chart?.chunks

  if (!chart) {
    return null
  }

  return (
    <div
      className={cn(
        "themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={chart}
        className="relative z-20 flex justify-end border-b bg-card px-3 py-2.5 text-card-foreground"
      >
        {children}
      </ChartToolbar>
      <div className="relative z-10 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
        {children}
      </div>
    </div>
  )
}
