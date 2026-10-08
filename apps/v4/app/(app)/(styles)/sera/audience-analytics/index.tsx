import { Separator } from "@/styles/base-sera/ui/separator"

import { Demographics } from "./components/demographics"
import { MetricsGrid } from "./components/metrics-grid"
import { PreviewHeader } from "./components/preview-header"
import { TopEditorial } from "./components/top-editorial"
import { TrafficOverviewDeferred } from "./components/traffic-overview-deferred"

export function AudienceAnalytics() {
  return (
    <div className="preview theme-taupe @container/preview w-full flex-1 bg-muted pt-4 font-sans ring-1 ring-foreground/5 [--gap:--spacing(4)] sm:pt-0 md:[--gap:--spacing(6)] xl:[--gap:--spacing(8)] 2xl:py-8 **:[.container]:px-(--gap)">
      <PreviewHeader />
      <Separator className="hidden sm:block" />
      <div className="container grid grid-cols-12 gap-(--gap) py-(--gap)">
        <MetricsGrid />
        <TrafficOverviewDeferred className="col-span-full md:col-span-6 lg:col-span-8" />
        <Demographics className="col-span-full md:col-span-6 lg:col-span-4" />
        <TopEditorial className="col-span-full" />
      </div>
    </div>
  )
}
