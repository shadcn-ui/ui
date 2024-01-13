import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { Separator } from "@/registry/new-york/ui/separator"

export function Announcement() {
  return (
    <Link
      href="/docs/changelog"
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span className="sm:hidden">New components and more.</span>
      <span className="hidden sm:inline">
        New components, breadcrumb and input otp.
      </span>
      <ArrowRightIcon className="ml-1 size-4" />
    </Link>
  )
}
