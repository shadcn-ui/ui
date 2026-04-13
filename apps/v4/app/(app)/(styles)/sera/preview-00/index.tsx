import { AlertsCard } from "./components/alerts-card"
import { ButtonsCard } from "./components/buttons-card"
import { ChartCard } from "./components/chart-card"
import { ControlsCard } from "./components/controls-card"
import { FieldsCard } from "./components/fields-card"
import { LineChartCard } from "./components/line-chart-card"
import { NavCard } from "./components/nav-card"
import { ProgressCard } from "./components/progress-card"

export function Preview00() {
  return (
    <div className="preview theme-taupe @container/preview w-full flex-1 bg-muted pt-4 font-sans ring-1 ring-foreground/5 [--gap:--spacing(4)] sm:pt-0 md:[--gap:--spacing(6)] xl:[--gap:--spacing(8)] 2xl:py-8 **:[.container]:px-(--gap)">
      <div className="container grid grid-cols-12 gap-(--gap) py-(--gap)">
        <ButtonsCard />
        <FieldsCard />
        <ControlsCard />
        <NavCard />
        <ChartCard />
        <LineChartCard />
        <ProgressCard />
        <AlertsCard />
      </div>
    </div>
  )
}
