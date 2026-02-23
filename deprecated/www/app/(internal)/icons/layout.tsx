import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  title: "Icons",
  description: "All icons in all libraries.",
}

export default function IconsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Icons</PageHeaderHeading>
        <PageHeaderDescription>
          All icons in all libraries.
        </PageHeaderDescription>
      </PageHeader>
      <section id="icons" className="scroll-mt-20">
        {children}
      </section>
    </div>
  )
}
