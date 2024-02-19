import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Announcement } from "@/components/announcement"
import { ExamplesNav } from "@/components/examples-nav"
import { Icons } from "@/components/icons"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { buttonVariants } from "@/registry/new-york/ui/button"
import MailPage from "@/app/examples/mail/page"

export default async function IndexPage() {
  const result = await auth()
  return <div className="container relative">Welcome {result?.user?.email}</div>
}
