import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile Settings - Ocean ERP",
  description: "Manage your profile settings",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No permission guard - all authenticated users can access their profile
  return <>{children}</>
}
