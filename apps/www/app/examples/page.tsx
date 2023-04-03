import type { Metadata } from "next"

import { DemoCookieSettings } from "@/components/demo/cookie-settings"
import { DemoCreateAccount } from "@/components/demo/create-account"
import { DemoDatePicker } from "@/components/demo/date-picker"
import { DemoGithub } from "@/components/demo/github-card"
import { DemoNotifications } from "@/components/demo/notifications"
import { DemoPaymentMethod } from "@/components/demo/payment-method"
import { DemoReportAnIssue } from "@/components/demo/report-an-issue"
import { DemoShareDocument } from "@/components/demo/share-document"
import { DemoTeamMembers } from "@/components/demo/team-members"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  title: "Examples",
  description: "Examples built ",
}

interface DemoContainerProps {
  children: React.ReactNode
}

function DemoContainer({ children }: DemoContainerProps) {
  return (
    <div className="flex items-center justify-center [&>div]:w-full">
      {children}
    </div>
  )
}

export default function DemoPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Examples</PageHeaderHeading>
        <PageHeaderDescription>
          Check out some examples app built using the components.
        </PageHeaderDescription>
      </PageHeader>
      <div className="bg-muted grid grid-cols-3 items-start justify-center gap-6 rounded-lg p-8">
        <div className="grid items-start gap-6">
          <DemoContainer>
            <DemoReportAnIssue />
          </DemoContainer>
          <DemoContainer>
            <DemoPaymentMethod />
          </DemoContainer>
        </div>
        <div className="grid items-start gap-6">
          <DemoContainer>
            <DemoTeamMembers />
          </DemoContainer>
          <DemoContainer>
            <DemoDatePicker />
          </DemoContainer>
          <DemoContainer>
            <DemoNotifications />
          </DemoContainer>
          <DemoContainer>
            <DemoShareDocument />
          </DemoContainer>
        </div>
        <div className="grid items-start gap-6">
          <DemoContainer>
            <DemoGithub />
          </DemoContainer>
          <DemoContainer>
            <DemoCreateAccount />
          </DemoContainer>
          <DemoContainer>
            <DemoCookieSettings />
          </DemoContainer>
        </div>
      </div>
    </>
  )
}
