import Link from "next/link"
import { UserAuthForm } from "@/components/auth/auth-form"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"

export default function Login() {
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
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
              <div className="relative pt-32 lg:p-8">
                <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      The magic for your apps 🪄✨
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to get your free magic components.
                    </p>
                  </div>
                  <UserAuthForm />

                  <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
