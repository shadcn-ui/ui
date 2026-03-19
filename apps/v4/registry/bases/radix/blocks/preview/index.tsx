"use client"

import { ActivateAgentDialog } from "@/registry/bases/radix/blocks/preview/cards/activate-agent-dialog"
import { AnalyticsCard } from "@/registry/bases/radix/blocks/preview/cards/analytics-card"
import { AnomalyAlert } from "@/registry/bases/radix/blocks/preview/cards/anomaly-alert"
import { BarChartCard } from "@/registry/bases/radix/blocks/preview/cards/bar-chart-card"
import { BookAppointment } from "@/registry/bases/radix/blocks/preview/cards/book-appointment"
import { CodespacesCard } from "@/registry/bases/radix/blocks/preview/cards/codespaces-card"
import { ContributionsActivity } from "@/registry/bases/radix/blocks/preview/cards/contributions-activity"
import { Contributors } from "@/registry/bases/radix/blocks/preview/cards/contributors"
import { EnvironmentVariables } from "@/registry/bases/radix/blocks/preview/cards/environment-variables"
import { FeedbackForm } from "@/registry/bases/radix/blocks/preview/cards/feedback-form"
import { FileUpload } from "@/registry/bases/radix/blocks/preview/cards/file-upload"
import { GithubProfile } from "@/registry/bases/radix/blocks/preview/cards/github-profile"
import { IconPreviewGrid } from "@/registry/bases/radix/blocks/preview/cards/icon-preview-grid"
import { InviteTeam } from "@/registry/bases/radix/blocks/preview/cards/invite-team"
import { Invoice } from "@/registry/bases/radix/blocks/preview/cards/invoice"
import { LiveWaveformCard } from "@/registry/bases/radix/blocks/preview/cards/live-waveform"
import { NoTeamMembers } from "@/registry/bases/radix/blocks/preview/cards/no-team-members"
import { NotFound } from "@/registry/bases/radix/blocks/preview/cards/not-found"
import { ObservabilityCard } from "@/registry/bases/radix/blocks/preview/cards/observability-card"
import { PieChartCard } from "@/registry/bases/radix/blocks/preview/cards/pie-chart-card"
import { ReportBug } from "@/registry/bases/radix/blocks/preview/cards/report-bug"
import { ShippingAddress } from "@/registry/bases/radix/blocks/preview/cards/shipping-address"
import { Shortcuts } from "@/registry/bases/radix/blocks/preview/cards/shortcuts"
import { SkeletonLoading } from "@/registry/bases/radix/blocks/preview/cards/skeleton-loading"
import { SleepReport } from "@/registry/bases/radix/blocks/preview/cards/sleep-report"
import { StyleOverview } from "@/registry/bases/radix/blocks/preview/cards/style-overview"
import { TypographySpecimen } from "@/registry/bases/radix/blocks/preview/cards/typography-specimen"
import { UIElements } from "@/registry/bases/radix/blocks/preview/cards/ui-elements"
import { UsageCard } from "@/registry/bases/radix/blocks/preview/cards/usage-card"
import { Visitors } from "@/registry/bases/radix/blocks/preview/cards/visitors"
import { WeeklyFitnessSummary } from "@/registry/bases/radix/blocks/preview/cards/weekly-fitness-summary"

export default function PreviewExample() {
  return (
    <div className="overflow-x-auto overflow-y-hidden bg-muted contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)]">
      <div className="flex w-full min-w-max justify-center">
        <div
          className="grid w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] *:[div]:gap-(--gap)"
          data-slot="capture-target"
        >
          <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <StyleOverview />
            <TypographySpecimen />
            <div className="md:hidden">
              <UIElements />
            </div>
            <CodespacesCard />
            <Invoice />
          </div>
          <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <IconPreviewGrid />
            <div className="hidden w-full md:flex">
              <UIElements />
            </div>
            <ObservabilityCard />
            <ShippingAddress />
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
            <WeeklyFitnessSummary />
            <FileUpload />
            <AnalyticsCard />
            <UsageCard />
            <Shortcuts />
          </div>
          <div className="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <AnomalyAlert />
            <LiveWaveformCard />
            <Visitors />
            <ContributionsActivity />
            <NotFound />
          </div>
        </div>
      </div>
    </div>
  )
}
