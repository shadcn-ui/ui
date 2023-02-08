import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { AppleMusicDemo } from "@/components/apple-music-demo"
import { CopyButton } from "@/components/copy-button"
import { PromoVideo } from "@/components/promo-video"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <>
      <section className="grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Beautifully designed components <br className="hidden sm:inline" />
            built with Radix UI and Tailwind CSS.
          </h1>
          <p className="max-w-[750px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Accessible and customizable components that you can copy and paste
            into your apps. Free. Open Source.{" "}
            <span className="font-semibold">
              Use this to build your own component library
            </span>
            .
          </p>
        </div>
        <div className="block lg:hidden">
          <PromoVideo />
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
          <Link href="/docs" className={buttonVariants({ size: "lg" })}>
            Documentation
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "md:hidden"
            )}
          >
            GitHub
          </Link>
          <pre className="hidden h-11 items-center justify-between space-x-2 overflow-x-auto rounded-lg border border-slate-100 bg-slate-100 pr-2 pl-6 dark:border-slate-700 dark:bg-black md:flex">
            <code className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">
              npx create-next-app -e https://github.com/shadcn/next-template
            </code>
            <CopyButton
              value="npx create-next-app -e https://github.com/shadcn/next-template"
              className="border-none text-slate-900 hover:bg-transparent dark:text-slate-50"
            />
          </pre>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You are looking at an early preview. You can follow the progress on{" "}
            <Link
              href={siteConfig.links.twitter}
              className="font-medium underline underline-offset-4"
            >
              Twitter
            </Link>
            .
          </p>
        </div>
      </section>
      <section className="hidden lg:block">
        <AppleMusicDemo />
      </section>
    </>
  )
}
