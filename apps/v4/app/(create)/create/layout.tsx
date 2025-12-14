import { LocksProvider } from "@/app/(create)/hooks/use-locks"

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LocksProvider>{children}</LocksProvider>
}
