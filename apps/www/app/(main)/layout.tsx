import "@/styles/globals.css"

import { getCurrentUserSession } from "@/lib/session"
import { redirect } from "next/navigation"

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUserSession()

  if (!user) {
    return redirect("/")
  }
  return <>{children}</>
}
