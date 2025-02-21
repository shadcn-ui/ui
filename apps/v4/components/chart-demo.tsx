import { ChartAreaDemo } from "@/components/chart-area-demo"
import { ChartBarDemo } from "@/components/chart-bar-demo"
import { ChartBarMixed } from "@/registry/new-york-v4/charts/chart-bar-mixed"

export function ChartDemo() {
  return (
    <div className="flex w-full max-w-screen-xl flex-col flex-wrap gap-4 *:data-[slot=card]:flex-1 md:flex-row">
      <ChartAreaDemo />
      <ChartBarDemo />
      <ChartBarMixed />
    </div>
  )
}
