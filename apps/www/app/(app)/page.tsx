import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Announcement } from "@/components/announcement"
import { ExamplesNav } from "@/components/examples-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york/ui/button"
import MailPage from "@/app/(app)/examples/mail/page"

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Welcome to the Project</PageHeaderHeading>
        <PageHeaderDescription>
        Forty Eight Point One’s award-winning DMO platform, proudly powering over 100 regions and countries worldwide. Use this guide to get set up and seamlessly join the project.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/docs">Get Started</Link>
          </Button>
        </PageActions>
      </PageHeader>
    </div>
  )
}
