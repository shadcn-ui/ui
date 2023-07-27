import { ThemeWrapper } from "@/components/theme-wrapper"
import { CardsActivityGoal } from "@/registry/default/example/cards/activity-goal"
import { CardsCalendar } from "@/registry/default/example/cards/calendar"
import { CardsChat } from "@/registry/default/example/cards/chat"
import { CardsCookieSettings } from "@/registry/default/example/cards/cookie-settings"
import { CardsCreateAccount } from "@/registry/default/example/cards/create-account"
import { CardsDataTable } from "@/registry/default/example/cards/data-table"
import { CardsMetric } from "@/registry/default/example/cards/metric"
import { CardsPaymentMethod } from "@/registry/default/example/cards/payment-method"
import { CardsReportIssue } from "@/registry/default/example/cards/report-issue"
import { CardsShare } from "@/registry/default/example/cards/share"
import { CardsStats } from "@/registry/default/example/cards/stats"
import { CardsTeamMembers } from "@/registry/default/example/cards/team-members"

export default function CardsDemo() {
  return (
    <ThemeWrapper>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-6 space-y-4">
          <CardsStats />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <CardsTeamMembers />
              <CardsCookieSettings />
              <CardsPaymentMethod />
            </div>
            <div className="space-y-4">
              <CardsChat />
              <CardsCreateAccount />
              <CardsReportIssue />
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="row grid grid-cols-[275px_235px] gap-4">
            <CardsCalendar />
            <CardsActivityGoal />
            <div className="col-span-2">
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
