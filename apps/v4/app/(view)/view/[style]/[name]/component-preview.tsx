import { cn } from "@/lib/utils"

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "style-force-ui theme-default bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none" // [FORCE-UI]
      )}
    >
      {children}
    </div>
  )
}
