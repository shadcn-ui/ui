"use client"

import { ActivateAgentDialog } from "@/registry/base-lyra/blocks/preview/cards/activate-agent-dialog"
import { AnalyticsCard } from "@/registry/base-lyra/blocks/preview/cards/analytics-card"
import { AnomalyAlert } from "@/registry/base-lyra/blocks/preview/cards/anomaly-alert"
import { AssignIssue } from "@/registry/base-lyra/blocks/preview/cards/assign-issue"
import { BarChartCard } from "@/registry/base-lyra/blocks/preview/cards/bar-chart-card"
import { BarVisualizerCard } from "@/registry/base-lyra/blocks/preview/cards/bar-visualizer"
import { BookAppointment } from "@/registry/base-lyra/blocks/preview/cards/book-appointment"
import { CodespacesCard } from "@/registry/base-lyra/blocks/preview/cards/codespaces-card"
import { ContributionsActivity } from "@/registry/base-lyra/blocks/preview/cards/contributions-activity"
import { Contributors } from "@/registry/base-lyra/blocks/preview/cards/contributors"
import { EnvironmentVariables } from "@/registry/base-lyra/blocks/preview/cards/environment-variables"
import { FeedbackForm } from "@/registry/base-lyra/blocks/preview/cards/feedback-form"
import { FileUpload } from "@/registry/base-lyra/blocks/preview/cards/file-upload"
import { GithubProfile } from "@/registry/base-lyra/blocks/preview/cards/github-profile"
import { IconPreviewGrid } from "@/registry/base-lyra/blocks/preview/cards/icon-preview-grid"
import { InviteTeam } from "@/registry/base-lyra/blocks/preview/cards/invite-team"
import { Invoice } from "@/registry/base-lyra/blocks/preview/cards/invoice"
import { LiveWaveformCard } from "@/registry/base-lyra/blocks/preview/cards/live-waveform"
import { NoTeamMembers } from "@/registry/base-lyra/blocks/preview/cards/no-team-members"
import { NotFound } from "@/registry/base-lyra/blocks/preview/cards/not-found"
import { ObservabilityCard } from "@/registry/base-lyra/blocks/preview/cards/observability-card"
import { PieChartCard } from "@/registry/base-lyra/blocks/preview/cards/pie-chart-card"
import { ReportBug } from "@/registry/base-lyra/blocks/preview/cards/report-bug"
import { ShippingAddress } from "@/registry/base-lyra/blocks/preview/cards/shipping-address"
import { Shortcuts } from "@/registry/base-lyra/blocks/preview/cards/shortcuts"
import { SkeletonLoading } from "@/registry/base-lyra/blocks/preview/cards/skeleton-loading"
import { SleepReport } from "@/registry/base-lyra/blocks/preview/cards/sleep-report"
import { StyleOverview } from "@/registry/base-lyra/blocks/preview/cards/style-overview"
import { UIElements } from "@/registry/base-lyra/blocks/preview/cards/ui-elements"
import { UsageCard } from "@/registry/base-lyra/blocks/preview/cards/usage-card"
import { Visitors } from "@/registry/base-lyra/blocks/preview/cards/visitors"
import { WeeklyFitnessSummary } from "@/registry/base-lyra/blocks/preview/cards/weekly-fitness-summary"

export default function PreviewExample() {
  return (
    <div className="overflow-x-auto overflow-y-hidden contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)]">
      <div
        className="grid w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background *:[div]:gap-(--gap)"
        data-slot="capture-target"
      >
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <StyleOverview />
          <div className="md:hidden">
            <UIElements />
          </div>
          <CodespacesCard />
          <BarVisualizerCard />
          <Invoice />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <IconPreviewGrid />
          <div className="hidden w-full md:flex">
            <UIElements />
          </div>
          <ObservabilityCard />
          <Visitors />
          <Shortcuts />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <EnvironmentVariables />
          <BarChartCard />
          <InviteTeam />
          <ActivateAgentDialog />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <SkeletonLoading />
          <PieChartCard />
          <NoTeamMembers />
          <ReportBug />
          <Contributors />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <FeedbackForm />
          <BookAppointment />
          <SleepReport />
          <GithubProfile />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <AssignIssue />
          <WeeklyFitnessSummary />
          <FileUpload />
          <AnalyticsCard />
          <UsageCard />
          <ContributionsActivity />
        </div>
        <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
          <AnomalyAlert />
          <LiveWaveformCard />
          <ShippingAddress />
          <NotFound />
        </div>
      </div>
    </div>
  )
}
