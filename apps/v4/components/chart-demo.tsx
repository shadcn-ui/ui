import { ChartAreaDemo } from "@/components/chart-area-demo"
import { ChartBarDemo } from "@/components/chart-bar-demo"
import { ChartLineDemo } from "@/components/chart-line-demo"

export function ChartDemo() {
  return (
    <div className="flex flex-col flex-wrap gap-4 md:flex-row">
      <ChartAreaDemo />
      <ChartBarDemo />
      <ChartLineDemo />
    </div>
  )
}
