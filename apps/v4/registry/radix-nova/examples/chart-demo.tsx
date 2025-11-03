import ChartAreaDemo from "@/registry/radix-nova/examples/chart-area-demo"
import ChartBarDemo from "@/registry/radix-nova/examples/chart-bar-demo"
import ChartLineDemo from "@/registry/radix-nova/examples/chart-line-demo"

export default function ChartDemo() {
  return (
    <div className="grid w-full max-w-screen-2xl gap-4 *:data-[slot=card]:flex-1 @2xl:grid-cols-2 @6xl:grid-cols-3">
      <ChartAreaDemo />
      <ChartBarDemo />
      <div className="@6xl:hidden">
        <ChartLineDemo />
      </div>
    </div>
  )
}
