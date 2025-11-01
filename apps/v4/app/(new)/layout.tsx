import * as React from "react"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
