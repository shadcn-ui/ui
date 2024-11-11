import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { ThemeWrapper } from "@/components/theme-wrapper"

export const metadata: Metadata = {
  title: "Themes",
  description: "Hand-picked themes that you can copy and paste into your apps.",
}

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <ThemeWrapper
        defaultTheme="zinc"
        className="relative flex w-full flex-col items-start md:flex-row"
      >
        <PageHeader>
          <Announcement />
          <PageHeaderHeading className="hidden md:block">
            Add colors. Make it yours.
          </PageHeaderHeading>
          <PageHeaderHeading className="md:hidden">
            Make it yours
          </PageHeaderHeading>
          <PageHeaderDescription>
            Hand-picked themes that you can copy and paste into your apps.
          </PageHeaderDescription>
          <PageActions>
            <ThemeCustomizer />
          </PageActions>
        </PageHeader>
      </ThemeWrapper>
      <div className="container py-6">
        <section id="themes" className="scroll-mt-20">
          {children}
        </section>
      </div>
    </div>
  )
}
