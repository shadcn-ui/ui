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
        "group relative flex flex-col rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={chart}
        className="relative z-20 flex justify-end rounded-t-xl border-b bg-card px-4 py-3 text-card-foreground"
      />
      <div className="relative z-10 [&>div]:rounded-t-none [&>div]:border-none [&>div]:shadow-none">
        {children}
      </div>
    </div>
  )
}
