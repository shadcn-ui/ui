export function ShimmerSkeleton() {
  return (
    <div className="flex w-full max-w-xs items-center gap-4">
      <div className="shimmer size-10 shrink-0 rounded-full bg-muted" />
      <div className="flex w-full flex-col gap-2">
        <div className="shimmer h-4 w-2/3 rounded-md bg-muted" />
        <div className="shimmer h-4 w-full rounded-md bg-muted" />
      </div>
    </div>
  )
}
