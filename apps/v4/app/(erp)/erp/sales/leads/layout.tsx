import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lead Management - Ocean ERP",
  description: "Manage sales leads and potential customers",
}

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}