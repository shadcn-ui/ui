export function ShimmerColor() {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
      <p className="shimmer shimmer-color-blue-500/60">
        Generating response&hellip;
      </p>
      <p className="shimmer shimmer-color-[#378ADD]">
        Generating response&hellip;
      </p>
    </div>
  )
}
