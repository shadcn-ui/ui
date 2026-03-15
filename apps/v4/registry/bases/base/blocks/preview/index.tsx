"use client"

import { ActivateAgentDialog } from "@/registry/bases/base/blocks/preview/cards/activate-agent-dialog"
import { AnalyticsCard } from "@/registry/bases/base/blocks/preview/cards/analytics-card"
import { AnomalyAlert } from "@/registry/bases/base/blocks/preview/cards/anomaly-alert"
import { AssignIssue } from "@/registry/bases/base/blocks/preview/cards/assign-issue"
import { BarChartCard } from "@/registry/bases/base/blocks/preview/cards/bar-chart-card"
import { BarVisualizerCard } from "@/registry/bases/base/blocks/preview/cards/bar-visualizer"
import { BookAppointment } from "@/registry/bases/base/blocks/preview/cards/book-appointment"
import { CodespacesCard } from "@/registry/bases/base/blocks/preview/cards/codespaces-card"
import { ContributionsActivity } from "@/registry/bases/base/blocks/preview/cards/contributions-activity"
import { Contributors } from "@/registry/bases/base/blocks/preview/cards/contributors"
import { EnvironmentVariables } from "@/registry/bases/base/blocks/preview/cards/environment-variables"
import { FeedbackForm } from "@/registry/bases/base/blocks/preview/cards/feedback-form"
import { FileUpload } from "@/registry/bases/base/blocks/preview/cards/file-upload"
import { GithubProfile } from "@/registry/bases/base/blocks/preview/cards/github-profile"
import { IconPreviewGrid } from "@/registry/bases/base/blocks/preview/cards/icon-preview-grid"
import { InviteTeam } from "@/registry/bases/base/blocks/preview/cards/invite-team"
import { Invoice } from "@/registry/bases/base/blocks/preview/cards/invoice"
import { LiveWaveformCard } from "@/registry/bases/base/blocks/preview/cards/live-waveform"
import { NoTeamMembers } from "@/registry/bases/base/blocks/preview/cards/no-team-members"
import { NotFound } from "@/registry/bases/base/blocks/preview/cards/not-found"
import { ObservabilityCard } from "@/registry/bases/base/blocks/preview/cards/observability-card"
import { PieChartCard } from "@/registry/bases/base/blocks/preview/cards/pie-chart-card"
import { ReportBug } from "@/registry/bases/base/blocks/preview/cards/report-bug"
import { ShippingAddress } from "@/registry/bases/base/blocks/preview/cards/shipping-address"
import { Shortcuts } from "@/registry/bases/base/blocks/preview/cards/shortcuts"
import { SkeletonLoading } from "@/registry/bases/base/blocks/preview/cards/skeleton-loading"
import { SleepReport } from "@/registry/bases/base/blocks/preview/cards/sleep-report"
import { StyleOverview } from "@/registry/bases/base/blocks/preview/cards/style-overview"
import { UIElements } from "@/registry/bases/base/blocks/preview/cards/ui-elements"
import { UsageCard } from "@/registry/bases/base/blocks/preview/cards/usage-card"
import { Visitors } from "@/registry/bases/base/blocks/preview/cards/visitors"
import { WeeklyFitnessSummary } from "@/registry/bases/base/blocks/preview/cards/weekly-fitness-summary"

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
