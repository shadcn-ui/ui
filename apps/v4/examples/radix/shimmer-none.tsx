export function ShimmerNone() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <p className="shimmer md:shimmer-none">Generating response&hellip;</p>
      <p className="font-mono text-xs">shimmer md:shimmer-none</p>
    </div>
  )
}
