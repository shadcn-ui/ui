import { AppSidebar } from "@/registry/new-york/blocks/sign-up-01/components/app-sidebar"

export default function Page() {
  return (
    <div className="h-screen w-screen grid items-center justify-items-center">
      <div className="flex flex-row w-fit overflow-hidden rounded-xl shadow-lg">
        <AppSidebar />
      </div>
    </div>
  )
}
