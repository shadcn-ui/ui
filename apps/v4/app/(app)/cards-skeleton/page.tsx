import { type Metadata } from "next"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

import { CardsSkeletonDemo } from "./cards"

const title = "Cards Skeleton"
const description = "Skeleton outlines of the home page cards."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
}

export default function CardsSkeletonPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader className="md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
        <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
      </PageHeader>
      <div className="container-wrapper flex-1 pb-6 md:px-0">
        <div className="container overflow-hidden md:px-0 lg:max-w-none">
          <section className="hidden md:block">
            <CardsSkeletonDemo />
          </section>
        </div>
      </div>
    </div>
  )
}
