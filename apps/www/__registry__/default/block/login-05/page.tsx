import { LoginForm } from "@/registry/default/block/login-05/components/login-form"

export const description = "A simple email-only login page."

export const iframeHeight = "870px"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
