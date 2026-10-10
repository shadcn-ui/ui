export function ScrollFadeNone() {
  return (
    <div className="mx-auto flex max-w-xs min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="h-48 scroll-fade scrollbar-none overflow-y-auto">
            <ScrollFadeNoneItems />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <div className="h-48 scroll-fade scrollbar-none overflow-y-auto scroll-fade-none">
            <ScrollFadeNoneItems />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade scroll-fade-none
        </p>
      </div>
    </div>
  )
}

function ScrollFadeNoneItems() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="rounded-lg bg-muted px-3 py-2.5 text-sm">
          Item {index + 1}
        </div>
      ))}
    </div>
  )
}
