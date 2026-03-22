"use client"

import { ActivateAgentDialog } from "@/registry/radix-mira/blocks/preview/cards/activate-agent-dialog"
import { AnalyticsCard } from "@/registry/radix-mira/blocks/preview/cards/analytics-card"
import { AnomalyAlert } from "@/registry/radix-mira/blocks/preview/cards/anomaly-alert"
import { AssignIssue } from "@/registry/radix-mira/blocks/preview/cards/assign-issue"
import { BarChartCard } from "@/registry/radix-mira/blocks/preview/cards/bar-chart-card"
import { BarVisualizerCard } from "@/registry/radix-mira/blocks/preview/cards/bar-visualizer"
import { BookAppointment } from "@/registry/radix-mira/blocks/preview/cards/book-appointment"
import { CodespacesCard } from "@/registry/radix-mira/blocks/preview/cards/codespaces-card"
import { ContributionsActivity } from "@/registry/radix-mira/blocks/preview/cards/contributions-activity"
import { Contributors } from "@/registry/radix-mira/blocks/preview/cards/contributors"
import { EnvironmentVariables } from "@/registry/radix-mira/blocks/preview/cards/environment-variables"
import { FeedbackForm } from "@/registry/radix-mira/blocks/preview/cards/feedback-form"
import { FileUpload } from "@/registry/radix-mira/blocks/preview/cards/file-upload"
import { GithubProfile } from "@/registry/radix-mira/blocks/preview/cards/github-profile"
import { IconPreviewGrid } from "@/registry/radix-mira/blocks/preview/cards/icon-preview-grid"
import { InviteTeam } from "@/registry/radix-mira/blocks/preview/cards/invite-team"
import { Invoice } from "@/registry/radix-mira/blocks/preview/cards/invoice"
import { LiveWaveformCard } from "@/registry/radix-mira/blocks/preview/cards/live-waveform"
import { NoTeamMembers } from "@/registry/radix-mira/blocks/preview/cards/no-team-members"
import { NotFound } from "@/registry/radix-mira/blocks/preview/cards/not-found"
import { ObservabilityCard } from "@/registry/radix-mira/blocks/preview/cards/observability-card"
import { PieChartCard } from "@/registry/radix-mira/blocks/preview/cards/pie-chart-card"
import { ReportBug } from "@/registry/radix-mira/blocks/preview/cards/report-bug"
import { ShippingAddress } from "@/registry/radix-mira/blocks/preview/cards/shipping-address"
import { Shortcuts } from "@/registry/radix-mira/blocks/preview/cards/shortcuts"
import { SkeletonLoading } from "@/registry/radix-mira/blocks/preview/cards/skeleton-loading"
import { SleepReport } from "@/registry/radix-mira/blocks/preview/cards/sleep-report"
import { StyleOverview } from "@/registry/radix-mira/blocks/preview/cards/style-overview"
import { UIElements } from "@/registry/radix-mira/blocks/preview/cards/ui-elements"
import { UsageCard } from "@/registry/radix-mira/blocks/preview/cards/usage-card"
import { Visitors } from "@/registry/radix-mira/blocks/preview/cards/visitors"
import { WeeklyFitnessSummary } from "@/registry/radix-mira/blocks/preview/cards/weekly-fitness-summary"

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
