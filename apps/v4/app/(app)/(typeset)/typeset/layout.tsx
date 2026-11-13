import { Suspense } from "react"

import { TypesetSkeleton } from "@/app/(app)/(typeset)/components/typeset-skeleton"
import { TypesetHistoryProvider } from "@/app/(app)/(typeset)/hooks/use-history"
import { LocksProvider } from "@/app/(app)/(typeset)/hooks/use-locks"

export default function TypesetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LocksProvider>
      {/* TypesetHistoryProvider reads useSearchParams(), which opts this
          subtree out of prerendering up to this boundary. The fallback is
          what paints on first load, so it must be the page placeholder,
          not empty. */}
      <Suspense fallback={<TypesetSkeleton />}>
        <TypesetHistoryProvider>{children}</TypesetHistoryProvider>
      </Suspense>
    </LocksProvider>
  )
}
