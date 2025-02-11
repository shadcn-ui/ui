import { ChartAreaDemo } from "@/components/chart-area-demo"
import { ChartBarDemo } from "@/components/chart-bar-demo"
import { ChartLineDemo } from "@/components/chart-line-demo"

export function ChartDemo() {
  return (
    <div className="flex w-full max-w-screen-xl flex-col flex-wrap gap-4 *:data-[slot=card]:flex-1 md:flex-row">
      <ChartAreaDemo />
      <ChartBarDemo />
      <ChartLineDemo />
    </div>
  )
}
