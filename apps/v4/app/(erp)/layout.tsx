import { cookies } from "next/headers"
import { ERPLayoutClient } from "./components/erp-layout-client"

export default async function ERPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <ERPLayoutClient defaultOpen={defaultOpen}>
      {children}
    </ERPLayoutClient>
  )
}