import { Metadata } from "next"
import Link from "next/link"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  title: "Figma",
  description:
    "Every component recreated in Figma. With customizable props, typography and icons.",
}

export default function FigmaPage() {
  return (
    <div className="container pb-10">
      <PageHeader>
        <PageHeaderHeading>Grab the free Figma UI Kit.</PageHeaderHeading>
        <PageHeaderDescription>
          Every component recreated in Figma. With customizable props,
          typography and icons. Open sourced by{" "}
          <Link
            href="https://twitter.com/skirano"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Pietro Schirano
          </Link>
          .
        </PageHeaderDescription>
      </PageHeader>
      <section className="mb-4 grid items-center gap-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:flex-row">
          <Link
            href="https://www.figma.com/community/file/1203061493325953101"
            className={buttonVariants({ size: "lg" })}
            target="_blank"
            rel="noreferrer"
          >
            Get a copy
          </Link>
          <Link
            href="https://twitter.com/skirano"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "px-5"
            )}
            target="_blank"
            rel="noreferrer"
          >
            <Heart className="mr-2 h-4 w-4 fill-current" />
            Follow Pietro
          </Link>
        </div>
      </section>
      <AspectRatio ratio={16 / 9} className="w-full">
        <iframe
          src="https://embed.figma.com/file/1203061493325953101/hf_embed?community_viewer=true&embed_host=shadcn&hub_file_id=1203061493325953101&kind=&viewer=1"
          className="h-full w-full overflow-hidden rounded-lg border bg-muted"
        />
      </AspectRatio>
    </div>
  )
}
