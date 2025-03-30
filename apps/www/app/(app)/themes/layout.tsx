import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeCustomizer } from "@/components/theme-customizer"

const title = "Add colors. Make it yours."
const description =
  "Hand-picked themes that you can copy and paste into your apps."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <ThemeCustomizer />
        </PageActions>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-6">
          <section id="themes" className="scroll-mt-20">
            {children}
          </section>
        </div>
      </div>
    </>
  )
}
