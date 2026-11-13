export function ScrollFadeOverflow() {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border">
      <div className="scroll-fade scrollbar-none overflow-y-auto">
        <div className="flex flex-col gap-1.5 p-1.5">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-lg bg-muted px-3 py-2.5 text-sm"
            >
              Item {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
