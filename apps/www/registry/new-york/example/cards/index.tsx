import { CardsActivityGoal } from "@/registry/new-york/example/cards/activity-goal"
import { CardsCalendar } from "@/registry/new-york/example/cards/calendar"
import { CardsChat } from "@/registry/new-york/example/cards/chat"
import { CardsCookieSettings } from "@/registry/new-york/example/cards/cookie-settings"
import { CardsCreateAccount } from "@/registry/new-york/example/cards/create-account"
import { CardsDataTable } from "@/registry/new-york/example/cards/data-table"
import { CardsMetric } from "@/registry/new-york/example/cards/metric"
import { CardsPaymentMethod } from "@/registry/new-york/example/cards/payment-method"
import { CardsReportIssue } from "@/registry/new-york/example/cards/report-issue"
import { CardsShare } from "@/registry/new-york/example/cards/share"
import { CardsStats } from "@/registry/new-york/example/cards/stats"
import { CardsTeamMembers } from "@/registry/new-york/example/cards/team-members"

export default function CardsDemo() {
  return (
    <div className="md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4">
      <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
        <CardsStats />
        <div className="grid gap-1 sm:grid-cols-[260px_1fr] md:hidden">
          <CardsCalendar />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsMetric />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-4 xl:space-y-4">
            <CardsTeamMembers />
            <CardsCookieSettings />
            <CardsPaymentMethod />
          </div>
          <div className="space-y-4 xl:space-y-4">
            <CardsChat />
            <CardsCreateAccount />
            <div className="hidden xl:block">
              <CardsReportIssue />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
        <div className="hidden gap-1 sm:grid-cols-[260px_1fr] md:grid">
          <CardsCalendar />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-3">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-3">
            <CardsMetric />
          </div>
        </div>
        <div className="hidden md:block">
          <CardsDataTable />
        </div>
        <CardsShare />
        <div className="xl:hidden">
          <CardsReportIssue />
        </div>
      </div>
    </div>
  )
}
