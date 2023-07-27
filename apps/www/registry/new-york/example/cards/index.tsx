import { ThemeWrapper } from "@/components/theme-wrapper"
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
    <ThemeWrapper>
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-6 space-y-6">
          <CardsStats />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <CardsTeamMembers />
              <CardsCookieSettings />
              <CardsPaymentMethod />
            </div>
            <div className="space-y-6">
              <CardsChat />
              <CardsCreateAccount />
              <CardsReportIssue />
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-1">
            <CardsCalendar />
            <div className="pl-4">
              <CardsActivityGoal />
            </div>
            <div className="col-span-2 pt-4">
              <CardsMetric />
            </div>
          </div>
          <CardsDataTable />
          <CardsShare />
        </div>
      </div>
    </ThemeWrapper>
  )
}
