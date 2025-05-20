import { Metadata } from "next"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeWrapper } from "@/components/theme-wrapper"

export const metadata: Metadata = {
  title: "Atari Theme Demo",
  description: "A demonstration of the custom Atari theme.",
}

export default function AtariThemeDemoPage() {
  return (
    <ThemeWrapper
      defaultTheme="atari" // Apply the Atari theme to this page
      className="flex flex-col items-start gap-4"
    >
      <PageHeader className="pb-8">
        <PageHeaderHeading>Atari Theme Demo</PageHeaderHeading>
        <PageHeaderDescription>
          Welcome to the Atari theme demo! This page showcases various UI
          components with the custom Atari theme applied.
        </PageHeaderDescription>
      </PageHeader>
      <div className="space-y-8">
        {/* Components will be added here in the next step */}
      </div>
    </ThemeWrapper>
  )
}
