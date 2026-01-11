import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security Settings - Ocean ERP",
  description: "Manage your security settings",
}

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No permission guard - all authenticated users can access their security settings
  return <>{children}</>
}
