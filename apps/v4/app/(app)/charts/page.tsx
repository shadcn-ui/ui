import { ComponentWrapper } from "@/components/component-wrapper"
import * as Charts from "@/app/(app)/charts/charts"

export default function ChartsPage() {
  return (
    <div className="grid flex-1 grid-cols-3 items-start gap-4 p-4 2xl:grid-cols-4">
      {Object.entries(Charts)
        .sort()
        .map(([key, Component]) => (
          <ComponentWrapper
            key={key}
            name={key}
            className="w-auto data-[name=chartareainteractive]:col-span-3 data-[name=chartbarinteractive]:col-span-3 data-[name=chartlineinteractive]:col-span-3 **:data-[slot=card]:w-full"
          >
            <Component />
          </ComponentWrapper>
        ))}
    </div>
  )
}
