import { HistoryProvider } from "@/app/(create)/hooks/use-history"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LocksProvider>
      <HistoryProvider>{children}</HistoryProvider>
    </LocksProvider>
  )
}
