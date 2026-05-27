import { AccountAccess } from "./account-access"
import { AnalyticsCard } from "./analytics-card"
import { ClaimableBalance } from "./claimable-balance"
import { ContributionHistory } from "./contribution-history"
import { DividendIncome } from "./dividend-income"
import { EmptyDistributeTrack } from "./empty-distribute-track"
import { NewMilestone } from "./new-milestone"
import { NotificationSettings } from "./notification-settings"
import { Payments } from "./payments"
import { PayoutThreshold } from "./payout-threshold"
import { PowerUsage } from "./power-usage"
import { QrConnect } from "./qr-connect"
import { SavingsTargets } from "./savings-targets"
import { SidebarNav } from "./sidebar-nav"
import { AccountAccess as SkeletonAccountAccess } from "./skeleton/account-access"
import { AnalyticsCard as SkeletonAnalyticsCard } from "./skeleton/analytics-card"
import { ClaimableBalance as SkeletonClaimableBalance } from "./skeleton/claimable-balance"
import { ContributionHistory as SkeletonContributionHistory } from "./skeleton/contribution-history"
import { DividendIncome as SkeletonDividendIncome } from "./skeleton/dividend-income"
import { EmptyDistributeTrack as SkeletonEmptyDistributeTrack } from "./skeleton/empty-distribute-track"
import { NewMilestone as SkeletonNewMilestone } from "./skeleton/new-milestone"
import { NotificationSettings as SkeletonNotificationSettings } from "./skeleton/notification-settings"
import { Payments as SkeletonPayments } from "./skeleton/payments"
import { PayoutThreshold as SkeletonPayoutThreshold } from "./skeleton/payout-threshold"
import { PowerUsage as SkeletonPowerUsage } from "./skeleton/power-usage"
import { QrConnect as SkeletonQrConnect } from "./skeleton/qr-connect"
import { SavingsTargets as SkeletonSavingsTargets } from "./skeleton/savings-targets"
import { TransferFunds as SkeletonTransferFunds } from "./skeleton/transfer-funds"
import { UIElements as SkeletonUIElements } from "./skeleton/ui-elements"
import { TransferFunds } from "./transfer-funds"
import { UIElements } from "./ui-elements"

function CardsSkeletonRails() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden"
    >
      <div className="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div className="flex flex-col gap-(--gap)">
          <SkeletonContributionHistory />
          <SkeletonClaimableBalance />
          <SkeletonDividendIncome />
          <SkeletonPayoutThreshold />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <SkeletonUIElements />
          <SkeletonSavingsTargets />
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
        </div>
      </div>
      <div className="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div className="flex flex-col gap-(--gap)">
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
          <SkeletonAnalyticsCard />
          <SkeletonNotificationSettings />
          <SkeletonPowerUsage />
        </div>
      </div>
    </div>
  )
}

export function CardsDemo() {
  return (
    <div
      data-slot="demo"
      className="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background"
    >
      <CardsSkeletonRails />
      <div className="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
        <div className="flex flex-col items-start gap-(--gap)">
          <UIElements />
          <SidebarNav />
          <SavingsTargets />
        </div>
        <div className="hidden flex-col gap-(--gap) lg:flex">
          <ContributionHistory />
          <ClaimableBalance />
          <DividendIncome />
        </div>
        <div className="hidden flex-col gap-(--gap) 3xl:flex!">
          <NewMilestone />
          <PayoutThreshold />
          <AccountAccess />
        </div>
        <div className="hidden flex-col gap-(--gap) md:flex">
          <QrConnect />
          <TransferFunds />
          <Payments />
        </div>
        <div className="hidden flex-col gap-(--gap) min-[1400px]:flex">
          <EmptyDistributeTrack />
          <AnalyticsCard />
          <NotificationSettings />
          <PowerUsage />
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80" />
    </div>
  )
}
