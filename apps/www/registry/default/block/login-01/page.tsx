import { LoginForm } from "@/registry/default/block/login-01/components/login-form"

export const description = "A simple login form."

export const iframeHeight = "870px"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
