import { Icons } from "@/components/icons"
import Link from "next/link"
import { Metadata } from "next"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { buttonVariants } from "@/registry/default/ui/button"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { getCurrentUserSession } from "@/lib/session"
import { metadata as pageMetadata } from "@/config/site"
import { redirect } from "next/navigation"

export const metadata: Metadata = pageMetadata

export default async function IndexPage() {
  const user = await getCurrentUserSession()

  if (user) {
    return redirect("/docs")
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <div className="container relative">
              <section className="flex h-full w-full flex-col items-center justify-center space-y-12  py-12 md:py-32">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]">
                  The elixir for your apps
                </h1>
                <div className="flex w-full flex-col items-center justify-center space-y-4">
                  <p className="text-lg font-medium leading-none text-muted-foreground">
                    Login and get your first magic 🪄✨ components for free.
                  </p>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "default",
                    })}
                  >
                    <span>✨ Get your free components now ✨</span>
                  </Link>
                </div>
              </section>
              <section className="flex h-full w-full flex-col items-center justify-center space-y-4 py-12">
                <div className="flex w-full  items-center justify-center">
                  <Icons.logo className="h-40 w-40 dark:fill-white" />
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                  Magic components for your apps
                </h1>
              </section>
            </div>
          </div>
        </div>
        <TailwindIndicator />
      </body>
    </html>
  )
}
