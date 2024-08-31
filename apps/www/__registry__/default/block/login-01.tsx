import { LoginForm } from "@/registry/default/block/login-01/components/login-form"

export const iframeHeight = "870px"

export const containerClassName = "w-full h-full"

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
