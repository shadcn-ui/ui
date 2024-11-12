import { LoginForm } from "@/registry/new-york/block/login-04/components/login-form"

export const description = "A login page with form and image."

export const iframeHeight = "870px"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
