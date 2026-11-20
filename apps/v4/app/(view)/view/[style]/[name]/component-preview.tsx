import { cn } from "cn"

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none"
      )}
    >
      {/* This route is embedded in iframes. Let wheel gestures chain to the
          parent page instead of stopping at the root layout's overscroll-none. */}
      <style>{`html, body { overscroll-behavior-y: auto; }`}</style>
      {children}
    </div>
  )
}
