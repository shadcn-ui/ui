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
        "group relative flex flex-col rounded-xl transition-all duration-200 ease-in-out hover:z-30",
        className
      )}
    >
      <ChartToolbar
        chart={chart}
        className="absolute inset-x-0 top-0 z-20 flex -translate-y-8 justify-end rounded-t-xl border bg-card px-4 py-3 text-card-foreground opacity-0 shadow transition-all duration-200 ease-in-out after:absolute after:inset-x-0 after:-bottom-2 after:h-2 after:border-t after:bg-card group-hover:-translate-y-12 group-hover:opacity-100"
      />
      <div className="relative z-10 transition-all duration-200 ease-in-out [&>div]:group-hover:rounded-t-none">
        {children}
      </div>
    </div>
  )
}
