import Link from "next/link"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"

export default function FigmaPage() {
  return (
    <>
      <section className="grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Figma UI Kit. Crafted to perfectly match the Radix UI components.
          </h1>
          <p className="max-w-[750px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
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
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
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
          className="h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
        />
      </AspectRatio>
    </>
  )
}
