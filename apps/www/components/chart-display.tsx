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
        className="relative inset-x-0 top-0 z-20 flex justify-end rounded-t-xl border bg-card px-4 py-3 text-card-foreground shadow transition-all duration-200 ease-in-out after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:border-t after:border-border after:bg-card md:absolute md:-translate-y-8 md:opacity-0 group-hover:md:-translate-y-12 group-hover:md:opacity-100"
      />
      <div className="relative z-10 transition-all duration-200 ease-in-out [&>div]:rounded-t-none [&>div]:group-hover:rounded-t-none [&>div]:md:rounded-t-xl">
        {children}
      </div>
    </div>
  )
}
