const tags = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Research",
  "Sales",
  "Support",
  "Operations",
  "Finance",
  "Legal",
  "People",
  "Security",
]

export function ScrollFadeHorizontal() {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border">
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-1.5 p-1.5">
          {tags.map((tag) => (
            <div
              key={tag}
              className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
