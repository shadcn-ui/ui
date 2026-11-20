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
import { TransferFunds } from "./transfer-funds"
import { UIElements } from "./ui-elements"

export function CardsSkeletonDemo() {
  return (
    <div
      data-slot="demo"
      className="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:[--gap:--spacing(10)]! lg:p-8 lg:[--gap:--spacing(6)] xl:p-12 dark:bg-muted/30"
    >
      <div className="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] xl:grid-cols-4 2xl:max-w-[1900px]">
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
        <div className="hidden flex-col gap-(--gap) xl:flex">
          <EmptyDistributeTrack />
          <AnalyticsCard />
          <NotificationSettings />
          <PowerUsage />
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-1 h-80 bg-linear-to-b from-background via-muted to-transparent dark:via-muted/30" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-80 bg-linear-to-t from-background via-muted to-transparent dark:via-muted/30" />
    </div>
  )
}
