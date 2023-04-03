import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { AppleMusicDemo } from "@/components/apple-music-demo"
import { CopyButton } from "@/components/copy-button"
import { Icons } from "@/components/icons"
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
            Get Started
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "pl-6"
            )}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
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
