import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth-form"

export default function LoginPage() {
  return (
    <main className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:top-8 md:right-8"
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-slate-100 lg:block"></div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px]">
        <div className="flex flex-col text-center">
          <Icons.logo className="mx-auto mb-4 h-12 w-12" />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click continue to login to the demo dashboard
            </p>
          </div>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-slate-600">
          By clicking continue, you agree to our{" "}
          <Link className="underline" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
