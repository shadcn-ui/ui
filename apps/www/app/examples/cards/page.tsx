import { Metadata } from "next"

import { cn } from "@/lib/utils"

import { DemoCookieSettings } from "./components/cookie-settings"
import { DemoCreateAccount } from "./components/create-account"
import { DemoDatePicker } from "./components/date-picker"
import { DemoGithub } from "./components/github-card"
import { DemoNotifications } from "./components/notifications"
import { DemoPaymentMethod } from "./components/payment-method"
import { DemoReportAnIssue } from "./components/report-an-issue"
import { DemoShareDocument } from "./components/share-document"
import { DemoTeamMembers } from "./components/team-members"
import "./styles.css"

export const metadata: Metadata = {
  title: "Cards",
  description: "Examples of cards built using the components.",
}

function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  )
}

export default function CardsPage() {
  return (
    <div className="cards grid items-start justify-center gap-6 rounded-lg p-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
        <DemoContainer>
          <DemoCreateAccount />
        </DemoContainer>
        <DemoContainer>
          <DemoPaymentMethod />
        </DemoContainer>
      </div>
      <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
        <DemoContainer>
          <DemoTeamMembers />
        </DemoContainer>
        <DemoContainer>
          <DemoShareDocument />
        </DemoContainer>
        <DemoContainer>
          <DemoDatePicker />
        </DemoContainer>
        <DemoContainer>
          <DemoNotifications />
        </DemoContainer>
      </div>
      <div className="col-span-2 grid items-start gap-6 lg:col-span-1 lg:grid-cols-2 xl:grid-cols-1">
        <DemoContainer>
          <DemoReportAnIssue />
        </DemoContainer>
        <DemoContainer>
          <DemoGithub />
        </DemoContainer>
        <DemoContainer>
          <DemoCookieSettings />
        </DemoContainer>
      </div>
    </div>
  )
}
