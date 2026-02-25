"use client"

import { lazy, Suspense } from "react"

const ActivateAgentDialog = lazy(() =>
  import(
    "@/registry/bases/radix/blocks/preview/cards/activate-agent-dialog"
  ).then((mod) => ({ default: mod.ActivateAgentDialog }))
)
const AnalyticsCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/analytics-card").then(
    (mod) => ({ default: mod.AnalyticsCard })
  )
)
const AnomalyAlert = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/anomaly-alert").then(
    (mod) => ({ default: mod.AnomalyAlert })
  )
)
const AssignIssue = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/assign-issue").then(
    (mod) => ({ default: mod.AssignIssue })
  )
)
const BarChartCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/bar-chart-card").then(
    (mod) => ({ default: mod.BarChartCard })
  )
)
const BarVisualizerCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/bar-visualizer").then(
    (mod) => ({ default: mod.BarVisualizerCard })
  )
)
const BookAppointment = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/book-appointment").then(
    (mod) => ({ default: mod.BookAppointment })
  )
)
const CodespacesCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/codespaces-card").then(
    (mod) => ({ default: mod.CodespacesCard })
  )
)
const ContributionsActivity = lazy(() =>
  import(
    "@/registry/bases/radix/blocks/preview/cards/contributions-activity"
  ).then((mod) => ({ default: mod.ContributionsActivity }))
)
const Contributors = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/contributors").then(
    (mod) => ({ default: mod.Contributors })
  )
)
const EnvironmentVariables = lazy(() =>
  import(
    "@/registry/bases/radix/blocks/preview/cards/environment-variables"
  ).then((mod) => ({ default: mod.EnvironmentVariables }))
)
const FeedbackForm = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/feedback-form").then(
    (mod) => ({ default: mod.FeedbackForm })
  )
)
const FileUpload = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/file-upload").then(
    (mod) => ({ default: mod.FileUpload })
  )
)
const GithubProfile = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/github-profile").then(
    (mod) => ({ default: mod.GithubProfile })
  )
)
const IconPreviewGrid = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/icon-preview-grid").then(
    (mod) => ({ default: mod.IconPreviewGrid })
  )
)
const InviteTeam = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/invite-team").then(
    (mod) => ({ default: mod.InviteTeam })
  )
)
const Invoice = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/invoice").then((mod) => ({
    default: mod.Invoice,
  }))
)
const LiveWaveformCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/live-waveform").then(
    (mod) => ({ default: mod.LiveWaveformCard })
  )
)
const NoTeamMembers = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/no-team-members").then(
    (mod) => ({ default: mod.NoTeamMembers })
  )
)
const NotFound = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/not-found").then(
    (mod) => ({ default: mod.NotFound })
  )
)
const ObservabilityCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/observability-card").then(
    (mod) => ({ default: mod.ObservabilityCard })
  )
)
const PieChartCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/pie-chart-card").then(
    (mod) => ({ default: mod.PieChartCard })
  )
)
const ReportBug = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/report-bug").then(
    (mod) => ({ default: mod.ReportBug })
  )
)
const ShippingAddress = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/shipping-address").then(
    (mod) => ({ default: mod.ShippingAddress })
  )
)
const Shortcuts = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/shortcuts").then(
    (mod) => ({ default: mod.Shortcuts })
  )
)
const SkeletonLoading = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/skeleton-loading").then(
    (mod) => ({ default: mod.SkeletonLoading })
  )
)
const SleepReport = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/sleep-report").then(
    (mod) => ({ default: mod.SleepReport })
  )
)
const StyleOverview = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/style-overview").then(
    (mod) => ({ default: mod.StyleOverview })
  )
)
const UIElements = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/ui-elements").then(
    (mod) => ({ default: mod.UIElements })
  )
)
const UsageCard = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/usage-card").then(
    (mod) => ({ default: mod.UsageCard })
  )
)
const Visitors = lazy(() =>
  import("@/registry/bases/radix/blocks/preview/cards/visitors").then(
    (mod) => ({
      default: mod.Visitors,
    })
  )
)
const WeeklyFitnessSummary = lazy(() =>
  import(
    "@/registry/bases/radix/blocks/preview/cards/weekly-fitness-summary"
  ).then((mod) => ({ default: mod.WeeklyFitnessSummary }))
)

export default function PreviewExample() {
  return (
    <div className="3xl:[--gap:--spacing(12)] overflow-x-auto overflow-y-hidden contain-[paint] [--gap:--spacing(10)]">
      <div
        className="bg-muted dark:bg-background grid w-[3000px] grid-cols-7 items-start gap-(--gap) p-(--gap) *:[div]:gap-(--gap)"
        data-slot="capture-target"
      >
        <Suspense>
          <div className="hidden flex-col lg:flex">
            <StyleOverview />
            <CodespacesCard />
            <BarVisualizerCard />
            <Invoice />
          </div>
          <div className="hidden flex-col lg:flex">
            <IconPreviewGrid />
            <UIElements />
            <ObservabilityCard />
            <Visitors />
            <Shortcuts />
          </div>
          <div className="flex flex-col">
            <EnvironmentVariables />
            <BarChartCard />
            <InviteTeam />
            <ActivateAgentDialog />
          </div>
          <div className="hidden flex-col lg:flex">
            <SkeletonLoading />
            <PieChartCard />
            <NoTeamMembers />
            <ReportBug />
            <Contributors />
          </div>
          <div className="hidden flex-col lg:flex">
            <FeedbackForm />
            <BookAppointment />
            <SleepReport />
            <GithubProfile />
          </div>
          <div className="hidden flex-col lg:flex">
            <AssignIssue />
            <WeeklyFitnessSummary />
            <FileUpload />
            <AnalyticsCard />
            <UsageCard />
            <ContributionsActivity />
          </div>
          <div className="hidden flex-col lg:flex">
            <AnomalyAlert />
            <LiveWaveformCard />
            <ShippingAddress />
            <NotFound />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
